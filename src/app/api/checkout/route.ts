import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
 apiVersion:"2025-02-24.acacia",
});

export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log("APIリクエストの受信データ:", body); // 受信データをログに出力
  
      const { accommodationName, price, reservationId } = body;
  
      if (!accommodationName || !price) {
        console.error("必要なデータが不足しています:", { accommodationName, price });
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "jpy", 
              product_data: { name: accommodationName },
              unit_amount: price, 
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?reservationId=${reservationId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      });
  
      console.log("Stripe セッション作成成功:", session.id);
      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
  }
  