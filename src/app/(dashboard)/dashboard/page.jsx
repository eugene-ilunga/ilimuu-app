import React from 'react'
import DashboardComponent from './dasboardComponents'
import { getUserFromCookies } from "@/utils/cookies";




const Dashboard = async() => {
    const userinfo = await getUserFromCookies();

  return (
    <div>
      <DashboardComponent user={userinfo} />
    </div>
  )
}

export default Dashboard
