// pages/api/bkash/initiate.js

import { initiatePayment } from '@/utils/bkashService';
import { m } from 'framer-motion';
import { NextResponse } from 'next/server';

export async function POST(req, res) {

  const { amount, orderId } = req.body;

  try {
    const paymentData = await initiatePayment(amount, orderId);
    
    if (paymentData && paymentData.bkashURL) {
     return NextResponse.json({ bkashURL: paymentData.bkashURL });
    } else {
        return NextResponse.json({ error: 'Failed to initiate payment' });
    }
  } catch (error) {
   return NextResponse.json({ error: 'Server error', details: error.message }); 
  }
}
