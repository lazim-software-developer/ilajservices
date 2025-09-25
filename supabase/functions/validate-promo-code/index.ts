import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { code, orderAmount, serviceIds } = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Promo code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get promo code details
    const { data: promoCode, error } = await supabaseClient
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promoCode) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid or expired promo code' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if promo code is still valid
    const now = new Date();
    const validFrom = promoCode.valid_from ? new Date(promoCode.valid_from) : null;
    const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null;

    if (validFrom && now < validFrom) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Promo code is not yet active' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (validUntil && now > validUntil) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Promo code has expired' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check usage limit
    if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Promo code usage limit reached' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check minimum order amount
    if (orderAmount && promoCode.min_order_amount && orderAmount < promoCode.min_order_amount) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Minimum order amount of $${promoCode.min_order_amount} required` 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if applicable to selected services
    if (promoCode.applicable_services && promoCode.applicable_services.length > 0 && serviceIds) {
      const hasApplicableService = serviceIds.some((id: string) => 
        promoCode.applicable_services.includes(id)
      );
      
      if (!hasApplicableService) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Promo code not applicable to selected services' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discount_type === 'percentage') {
      discountAmount = (orderAmount * promoCode.discount_value) / 100;
      if (promoCode.max_discount_amount) {
        discountAmount = Math.min(discountAmount, promoCode.max_discount_amount);
      }
    } else {
      discountAmount = promoCode.discount_value;
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        promoCode: {
          id: promoCode.id,
          code: promoCode.code,
          description: promoCode.description,
          discount_type: promoCode.discount_type,
          discount_value: promoCode.discount_value,
          discount_amount: discountAmount
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error validating promo code:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});