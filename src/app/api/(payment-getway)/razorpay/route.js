import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_ID_KEY,
 key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export async function POST(req) {
//  const { amount, currency } = (await req.json());

 var options = {
  amount: 5000,
  currency: 'INR',
  receipt: 'rcp1',
 };
 const order = await razorpay.orders.create(options);
 console.log(order);
 return NextResponse.json({ orderId: order.id }, { status: 200 });
}