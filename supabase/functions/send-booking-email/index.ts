import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  serviceType: string;
  serviceDetails: string;
  totalAmount: number;
  bookingType: 'holiday-home' | 'professional' | 'corporate';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();

    console.log("Received booking request:", bookingData);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New ${bookingData.bookingType === 'holiday-home' ? 'Holiday Home' : bookingData.bookingType === 'corporate' ? 'Corporate' : 'Professional Service'} Booking
        </h1>
        
        <h2 style="color: #4CAF50;">Service Details</h2>
        <p><strong>Service:</strong> ${bookingData.serviceType}</p>
        
        <h2 style="color: #4CAF50;">Customer Information</h2>
        <p><strong>Name:</strong> ${bookingData.customerName}</p>
        <p><strong>Email:</strong> ${bookingData.customerEmail || "Not provided"}</p>
        <p><strong>Phone:</strong> ${bookingData.customerPhone}</p>
        
        <h2 style="color: #4CAF50;">Booking Details</h2>
        <div style="white-space: pre-wrap; font-family: monospace; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
${bookingData.serviceDetails}
        </div>
        
        <div style="background-color: #4CAF50; color: white; padding: 15px; margin-top: 20px; border-radius: 5px;">
          <h2 style="margin: 0;">Total Amount: AED ${bookingData.totalAmount}</h2>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          This is an automated notification from your Ilaj Services booking system.
        </p>
      </div>
    `;

    // Array to hold email recipients
    const recipients = ["info@ilaj.ae"];
    
    // Add customer email if provided
    if (bookingData.customerEmail && bookingData.customerEmail.trim() !== "") {
      recipients.push(bookingData.customerEmail);
    }

    console.log("Sending emails to:", recipients);

    const emailResponse = await resend.emails.send({
      from: "Ilaj Services <onboarding@resend.dev>",
      to: recipients,
      subject: `New ${bookingData.bookingType === 'holiday-home' ? 'Holiday Home' : bookingData.bookingType === 'corporate' ? 'Corporate' : 'Professional Service'} Booking - ${bookingData.serviceType}`,
      html: emailHtml,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
