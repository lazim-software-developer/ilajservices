import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    customer_type?: string;
    location?: string;
  };
  service_id: string;
  addon_services?: string[];
  booking_date: string;
  booking_time?: string;
  promo_code?: string;
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

    const bookingData: BookingData = await req.json();
    
    if (!bookingData.customer?.name || !bookingData.customer?.email || !bookingData.service_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: customer name, email, and service_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create or find customer
    let customer;
    const { data: existingCustomer } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('email', bookingData.customer.email)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      const { data: newCustomer, error: customerError } = await supabaseClient
        .from('customers')
        .insert([{
          name: bookingData.customer.name,
          email: bookingData.customer.email,
          phone: bookingData.customer.phone,
          address: bookingData.customer.address,
          customer_type: bookingData.customer.customer_type || 'individual',
          location: bookingData.customer.location,
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

    // Get service details for pricing
    const { data: service, error: serviceError } = await supabaseClient
      .from('services')
      .select('base_price')
      .eq('id', bookingData.service_id)
      .single();

    if (serviceError || !service) {
      return new Response(
        JSON.stringify({ error: 'Invalid service ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalAmount = service.base_price;

    // Add addon service prices
    if (bookingData.addon_services && bookingData.addon_services.length > 0) {
      const { data: addons } = await supabaseClient
        .from('services')
        .select('base_price')
        .in('id', bookingData.addon_services);

      if (addons) {
        totalAmount += addons.reduce((sum, addon) => sum + addon.base_price, 0);
      }
    }

    // Validate and apply promo code if provided
    let promoCodeId = null;
    let discountAmount = 0;
    if (bookingData.promo_code) {
      const { data: promoCode } = await supabaseClient
        .from('promo_codes')
        .select('*')
        .eq('code', bookingData.promo_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (promoCode) {
        // Apply discount
        if (promoCode.discount_type === 'percentage') {
          discountAmount = (totalAmount * promoCode.discount_value) / 100;
          if (promoCode.max_discount_amount) {
            discountAmount = Math.min(discountAmount, promoCode.max_discount_amount);
          }
        } else {
          discountAmount = promoCode.discount_value;
        }
        promoCodeId = promoCode.id;

        // Update promo code usage
        await supabaseClient
          .from('promo_codes')
          .update({ used_count: promoCode.used_count + 1 })
          .eq('id', promoCode.id);
      }
    }

    const finalAmount = totalAmount - discountAmount;

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert([{
        customer_id: customer.id,
        service_id: bookingData.service_id,
        addon_services: bookingData.addon_services || [],
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        total_amount: totalAmount,
        promo_code_id: promoCodeId,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        notes: bookingData.notes,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully created booking for customer ${customer.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        booking_id: booking.id,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});