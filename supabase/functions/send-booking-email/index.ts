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
  customerEmail: string;
  customerPhone: string;
  packageTitle: string;
  packageSessions: number;
  properties: Array<{
    type: string;
    quantity: number;
    pricePerUnit: number;
  }>;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();

    const propertiesHtml = bookingData.properties
      .map(
        (p) =>
          `<tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.type}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">AED ${p.pricePerUnit}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">AED ${p.quantity * p.pricePerUnit}</td>
          </tr>`
      )
      .join("");

    const emailResponse = await resend.emails.send({
      from: "Ilaj Services <onboarding@resend.dev>",
      to: ["info@ilaj.ae"],
      subject: `New Holiday Home Booking - ${bookingData.packageTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            New Holiday Home Booking
          </h1>
          
          <h2 style="color: #4CAF50;">Package Details</h2>
          <p><strong>Package:</strong> ${bookingData.packageTitle}</p>
          <p><strong>Sessions:</strong> ${bookingData.packageSessions}</p>
          
          <h2 style="color: #4CAF50;">Customer Information</h2>
          <p><strong>Name:</strong> ${bookingData.customerName}</p>
          <p><strong>Email:</strong> ${bookingData.customerEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${bookingData.customerPhone}</p>
          
          <h2 style="color: #4CAF50;">Properties</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Property Type</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price per Unit</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${propertiesHtml}
            </tbody>
          </table>
          
          <div style="background-color: #4CAF50; color: white; padding: 15px; margin-top: 20px; border-radius: 5px;">
            <h2 style="margin: 0;">Total Amount: AED ${bookingData.totalAmount}</h2>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This is an automated notification from your Ilaj Services booking system.
          </p>
        </div>
      `,
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
