import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await payment.create({
      body: {
        transaction_amount: 19.9,
        description: "BooyahStats VIP",
        payment_method_id: "pix",
        payer: {
          email: body.email || "cliente@email.com",
        },
        external_reference: body.user_id,
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago-webhook`,
      },
    });

    return NextResponse.json({
      qr_code:
        response.point_of_interaction?.transaction_data?.qr_code,

      qr_code_base64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,

      payment_id: response.id,
      status: response.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao gerar pagamento PIX" },
      { status: 500 }
    );
  }
}