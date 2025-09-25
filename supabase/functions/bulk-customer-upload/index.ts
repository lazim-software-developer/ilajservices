import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomerData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_type?: 'individual' | 'corporate' | 'holiday_home';
  location?: string;
  notes?: string;
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

    const { customers } = await req.json();
    
    if (!customers || !Array.isArray(customers)) {
      return new Response(
        JSON.stringify({ error: 'Invalid customers data format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate customer data
    const validatedCustomers: CustomerData[] = [];
    const errors: string[] = [];

    customers.forEach((customer: any, index: number) => {
      if (!customer.name) {
        errors.push(`Row ${index + 1}: Name is required`);
        return;
      }

      if (customer.email && !isValidEmail(customer.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
        return;
      }

      validatedCustomers.push({
        name: customer.name,
        email: customer.email || null,
        phone: customer.phone || null,
        address: customer.address || null,
        customer_type: customer.customer_type || 'individual',
        location: customer.location || null,
        notes: customer.notes || null,
      });
    });

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation errors', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert customers in batch
    const { data, error } = await supabaseClient
      .from('customers')
      .insert(validatedCustomers)
      .select();

    if (error) {
      console.error('Error inserting customers:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to insert customers', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully uploaded ${data.length} customers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully uploaded ${data.length} customers`,
        inserted_count: data.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk customer upload:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}