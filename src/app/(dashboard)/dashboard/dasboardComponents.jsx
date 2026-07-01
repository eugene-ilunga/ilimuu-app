"use client";
import Link from "next/link";
import { Progress } from "../../../components/ui/progress";

import {
  Users,
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Menu,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { Charts } from "@/components/dashbaord-chart";
import useMockOrderNotifications from "@/hooks/useMockOrderNotifications";

import { useCourseSalesHooks } from "@/hooks/useCourseSalesHooks";
import { useMentorSalesHooks } from "@/hooks/useMentorSalesHooks";
import { useDashboardSummryHooks } from "@/hooks/useDashboardSummryHooks";
import { useTransactionHooks, useTransactionSummary } from "@/hooks/useTransactionHooks";
import { useCourseCheckoutHooks } from "@/hooks/useCourseCheckoutHooks";
import { useEffect } from "react";

export default function DashboardComponent({ user }) {
  const { salesSummeryData } = useCourseSalesHooks();
  const { salesMentorData } = useMentorSalesHooks();
  const { dashboardSummryData } = useDashboardSummryHooks();
  const { transactionData } = useTransactionHooks();
  const { checkoutData, totalPages } = useCourseCheckoutHooks(1, "", () => { });
  const { summary: transactionSummary, loading: transactionLoading } = useTransactionSummary();


  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1  flex-col gap-4 p-4 md:gap-8 md:p-8">
        {user.role === "admin" && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">

            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardSummryData?.totalSales}
                </div>
                <p className="text-xs text-muted-foreground">
                  Earn from courses & plans
                </p>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardSummryData?.totalUser}
                </div>
                <p className="text-xs text-muted-foreground">Total user count</p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Commission</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(dashboardSummryData?.commission || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total sales amount
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Course
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardSummryData?.totalCourse}
                </div>
                <p className="text-xs text-muted-foreground">All course count</p>
              </CardContent>
            </Card>
          </div>
        )}

        <h1 className="text-2xl font-semibold">Course Sales</h1>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-3xl">
                {salesSummeryData?.data.totalOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesSummeryData?.data.totalOrderLastweekPercentageChange}%
                from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesSummeryData?.data.totalOrderLastweekPercentageChange >
                    100
                    ? 100
                    : salesSummeryData?.data.totalOrderLastweekPercentageChange
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>

          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-3xl">
                ${salesSummeryData?.data.totalSalesAmount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesSummeryData?.data.totalSalesPercentageChange}% from last
                week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesSummeryData?.data.totalSalesPercentageChange > 100
                    ? 100
                    : salesSummeryData?.data.totalSalesPercentageChange
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">
                ${salesSummeryData?.data.totalSalesAmountThisWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesSummeryData?.data.totalSalesPercentageChangeThisWeek}%
                from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesSummeryData?.data.totalSalesPercentageChangeThisWeek >
                    100
                    ? 100
                    : salesSummeryData?.data.totalSalesPercentageChangeThisWeek
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">
                ${salesSummeryData?.data.totalSalesAmountThisMonth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesSummeryData?.data.monthlySalesPercentageChange}% from last
                month
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesSummeryData?.data.monthlySalesPercentageChange > 100
                    ? 100
                    : salesSummeryData?.data.monthlySalesPercentageChange
                }
                aria-label="12% increase"
              />
            </CardFooter>
          </Card>
        </div>

        <Charts />

        <h1 className="text-2xl font-semibold">Mentorship</h1>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-3xl">
                {salesMentorData?.data.totalOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesMentorData?.data.totalOrderLastweekPercentageChange}% from
                last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesMentorData?.data.totalOrderLastweekPercentageChange > 100
                    ? 100
                    : salesMentorData?.data.totalOrderLastweekPercentageChange
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>

          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Sales</CardDescription>
              <CardTitle className="text-3xl">
                ${salesMentorData?.data.totalSalesAmount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesMentorData?.data.totalSalesPercentageChange}% from last
                week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesMentorData?.data.totalSalesPercentageChange > 100
                    ? 100
                    : salesMentorData?.data.totalSalesPercentageChange
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">
                ${salesMentorData?.data.totalSalesAmountThisWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesMentorData?.data.totalSalesPercentageChangeThisWeek}% from
                last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesMentorData?.data.totalSalesPercentageChangeThisWeek > 100
                    ? 100
                    : salesMentorData?.data.totalSalesPercentageChangeThisWeek
                }
                aria-label="25% increase"
              />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">
                ${salesMentorData?.data.totalSalesAmountThisMonth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {salesMentorData?.data.monthlySalesPercentageChange}% from last
                month
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={
                  salesMentorData?.data.monthlySalesPercentageChange > 100
                    ? 100
                    : salesMentorData?.data.monthlySalesPercentageChange
                }
                aria-label="12% increase"
              />
            </CardFooter>
          </Card>
        </div>

        {/* Transaction Summary Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Transaction Summary</h1>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today Transaction
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionLoading ? "0.00" : (transactionSummary?.today || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Transactions made today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionLoading ? "0.00" : (transactionSummary?.thisMonth || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Transactions this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  All Transactions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionLoading ? "0.00" : (transactionSummary?.all || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total transaction amount
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions & Recent Sales Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Transactions & Recent Sales</h1>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2">
            <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest transactions from your platform.
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1 text-white">
                  <Link href="/dashboard/transection">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {transactionData && transactionData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>TRX ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionData.slice(0, 5).map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {transaction.transactionId?.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {transaction.type?.toUpperCase()}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {transaction.description || "Transaction"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${transaction.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-2">
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Latest sales from your platform.
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1 text-white">
                  <Link href="/dashboard/sales-report/course">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {checkoutData && checkoutData.length > 0 ? (
                  <div className="grid gap-4">
                    {checkoutData.slice(0, 5).map((checkout, index) => (
                      <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/01.png" alt="Avatar" />
                          <AvatarFallback>
                            {checkout.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 flex-1">
                          <p className="text-sm font-medium leading-none">
                            {checkout.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {checkout.user?.email || "No email"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            ${checkout?.totalAmount || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {checkout?.course?.title?.substring(0, 20) || "Cours"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No recent sales found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
