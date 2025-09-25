import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  bookingDate: string;
  bookingTime?: string;
  location: string;
  totalAmount: number;
  finalAmount: number;
  discountAmount?: number;
  promoCode?: string;
  specialRequests?: string;
  bookingId: string;
  paymentStatus: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();
    console.log("Received booking data:", bookingData);

    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      serviceName, 
      bookingDate, 
      bookingTime, 
      location, 
      totalAmount, 
      finalAmount, 
      discountAmount, 
      promoCode, 
      specialRequests,
      bookingId,
      paymentStatus
    } = bookingData;

    // Format the booking date
    const formattedDate = new Date(bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email to ILAJ team
    const emailResponse = await resend.emails.send({
      from: "ILAJ Bookings <bookings@ilaj.ae>",
      to: ["info@ilaj.ae"],
      subject: `New Booking Confirmed - ${serviceName} (${bookingId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">New Service Booking</h1>
              <p style="background-color: ${paymentStatus === 'paid' ? '#10b981' : '#f59e0b'}; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-weight: bold;">
                ${paymentStatus === 'paid' ? '✓ PAID' : '⚠ PENDING PAYMENT'}
              </p>
            </div>
            
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #374151; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
                Booking Details
              </h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
                <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
                ${bookingTime ? `<p style="margin: 5px 0;"><strong>Time:</strong> ${bookingTime}</p>` : ''}
              </div>
            </div>

            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #374151; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
                Customer Information
              </h2>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
              ${customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${customerPhone}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
            </div>

            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #374151; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
                Payment Summary
              </h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px;">
                <p style="margin: 5px 0; display: flex; justify-content: space-between;">
                  <span>Base Amount:</span> 
                  <span><strong>AED ${totalAmount.toFixed(2)}</strong></span>
                </p>
                ${discountAmount && discountAmount > 0 ? `
                  <p style="margin: 5px 0; display: flex; justify-content: space-between; color: #10b981;">
                    <span>Discount ${promoCode ? `(${promoCode})` : ''}:</span> 
                    <span><strong>-AED ${discountAmount.toFixed(2)}</strong></span>
                  </p>
                ` : ''}
                <hr style="margin: 10px 0; border: 1px solid #e5e7eb;">
                <p style="margin: 5px 0; display: flex; justify-content: space-between; font-size: 18px; color: #2563eb;">
                  <span><strong>Final Amount:</strong></span> 
                  <span><strong>AED ${finalAmount.toFixed(2)}</strong></span>
                </p>
              </div>
            </div>

            ${specialRequests ? `
              <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #374151; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
                  Special Requests
                </h2>
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
                  ${specialRequests.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="color: #2563eb; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                Next Steps:
              </p>
              <ol style="text-align: left; color: #374151; max-width: 400px; margin: 0 auto;">
                <li style="margin: 8px 0;">Contact customer within 2 hours to confirm appointment</li>
                <li style="margin: 8px 0;">Assign service team for the scheduled date</li>
                <li style="margin: 8px 0;">${paymentStatus === 'paid' ? 'Service is paid - proceed with booking' : 'Follow up on payment if required'}</li>
                <li style="margin: 8px 0;">Send service team details to customer 1 day before</li>
              </ol>
            </div>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
              <p>This booking was placed via the ILAJ website.</p>
              <p><strong>Customer Support:</strong> +971 600 562624</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking email sent successfully",
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);