// pages/api/withdraw-stats.js
import WithdrawRequest from '@/app/model/withdrawRequestModel';
import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';


export  async function GET(req, res) {


  try {
    await connectToDB(); // Ensure database connection

    // Aggregation pipeline to calculate totals by status
    const stats = await WithdrawRequest.aggregate([
      {
        $group: {
          _id: '$status',
          totalCount: { $count: {} },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          totalCount: 1,
          totalAmount: 1,
        },
      },
    ]);

    // Ensure all statuses are included in the response, even if they have 0 entries
    const statuses = ['En attente', 'Approuvé', 'Rejeté', 'En cours', 'Terminé'];
    const result = statuses.map((status) => {
      const match = stats.find((stat) => stat.status === status);
      return {
        status,
        totalCount: match?.totalCount || 0,
        totalAmount: match?.totalAmount || 0,
      };
    });

   return NextResponse.json({ status: 200, data: result });
  } catch (error) {
  return  NextResponse.json({ status: 500, message: 'Internal server error' });
  }
}
