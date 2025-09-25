import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { amount, serviceName, customerData } = await req.json();
    
    console.log("Creating payment for:", { amount, serviceName, customerData });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27",
    });

    // Create or find Stripe customer
    let customerId;
    if (customerData?.email) {
      const customers = await stripe.customers.list({ 
        email: customerData.email, 
        limit: 1 
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          metadata: {
            source: 'ilaj_website',
            service: serviceName
          }
        });
        customerId = customer.id;
      }
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerData?.email,
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: serviceName,
              description: `Professional ${serviceName} service by ILAJ`,
            },
            unit_amount: Math.round(amount * 100), // Convert AED to fils (smallest currency unit)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/services`,
      metadata: {
        service_name: serviceName,
        customer_name: customerData?.name || '',
        customer_phone: customerData?.phone || '',
        customer_location: customerData?.location || ''
      }
    });

    console.log("Payment session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});