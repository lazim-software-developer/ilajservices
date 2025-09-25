import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  location?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const enquiryData: EnquiryData = await req.json();
    
    if (!enquiryData.name || !enquiryData.email || !enquiryData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or find customer
    let customer;
    const { data: existingCustomer } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('email', enquiryData.email)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      const { data: newCustomer, error: customerError } = await supabaseClient
        .from('customers')
        .insert([{
          name: enquiryData.name,
          email: enquiryData.email,
          phone: enquiryData.phone,
          location: enquiryData.location,
          lead_status: 'new'
        }])
        .select('id')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        return new Response(
          JSON.stringify({ error: 'Failed to create customer' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      customer = newCustomer;
    }

    // Create enquiry
    const { data: enquiry, error: enquiryError } = await supabaseClient
      .from('enquiries')
      .insert([{
        customer_id: customer.id,
        name: enquiryData.name,
        email: enquiryData.email,
        phone: enquiryData.phone,
        service_type: enquiryData.service_type,
        location: enquiryData.location,
        message: enquiryData.message,
        status: 'new'
      }])
      .select()
      .single();

    if (enquiryError) {
      console.error('Error creating enquiry:', enquiryError);
      return new Response(
        JSON.stringify({ error: 'Failed to create enquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully created enquiry for customer ${customer.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        enquiry_id: enquiry.id,
        message: 'Enquiry submitted successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});