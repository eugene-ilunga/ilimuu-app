"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  HelpCircle,
  MoreVertical,
  Search,
  X,
  Calendar,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { formatDateTime } from "@/utils/dateformate";
import { useMentorSalesHooks } from "@/hooks/useMentorSalesHooks";
import { usePlanCheckoutHooks } from "@/hooks/useMentorshipCheckoutHooks";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

function Dashboard() {
  const { salesMentorData } = useMentorSalesHooks();
  const route = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [selectedOrder, setSelectedOrder] = useState({});
  const { checkoutData, totalPages, totalItems, loading } = usePlanCheckoutHooks(
    currentPage,
    searchQuery,
    setSelectedOrder,
    paymentStatus,
    dateRange
  );

  const handleOnclickTable = (order) => {
    setSelectedOrder(order);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status) => {
    setPaymentStatus(status === paymentStatus ? "" : status);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleDateRangeFilter = (range) => {
    setDateRange(range === dateRange ? "" : range);
    setCurrentPage(1); // Reset to first page on filter
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPaymentStatus("");
    setDateRange("");
    setCurrentPage(1);
  };

  const getDateRangeLabel = (range) => {
    const labels = {
      today: "Aujourd'hui",
      yesterday: "Hier",
      last7days: "Last 7 Days",
      "1month": "1 Month",
      "6months": "6 Months",
    };
    return labels[range] || "";
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* Stats Section */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Total Sales</CardDescription>
                  <CardTitle className="text-3xl">
                    {salesMentorData?.data.totalOrders}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {salesMentorData?.data.totalOrderLastweekPercentageChange}%
                    from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={
                      salesMentorData?.data
                        .totalOrderLastweekPercentageChange > 100
                        ? 100
                        : salesMentorData?.data
                            .totalOrderLastweekPercentageChange
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
                    {salesMentorData?.data.totalSalesPercentageChange}% from
                    last week
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
                    {salesMentorData?.data.totalSalesPercentageChangeThisWeek}%
                    from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={
                      salesMentorData?.data
                        .totalSalesPercentageChangeThisWeek > 100
                        ? 100
                        : salesMentorData?.data
                            .totalSalesPercentageChangeThisWeek
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
                    {salesMentorData?.data.monthlySalesPercentageChange}% from
                    last month
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

          {/* Main Content Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Orders Table Section */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">Plan sales</CardTitle>
                      <CardDescription className="mt-1">
                        Manage and view all mentorship plan purchase orders
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Filters Section */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search by invoice, customer name, or email..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 pr-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2">
                        <span>Status</span>
                        {paymentStatus && (
                          <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {paymentStatus}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("")}
                        className={paymentStatus === "" ? "bg-muted" : ""}
                      >
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("Terminé")}
                        className={paymentStatus === "Terminé" ? "bg-muted" : ""}
                      >
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("En attente")}
                        className={paymentStatus === "En attente" ? "bg-muted" : ""}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusFilter("Échoué")}
                        className={paymentStatus === "Échoué" ? "bg-muted" : ""}
                      >
                        Failed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                        {dateRange && (
                          <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {getDateRangeLabel(dateRange)}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("")}
                        className={dateRange === "" ? "bg-muted" : ""}
                      >
                        All Time
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("today")}
                        className={dateRange === "today" ? "bg-muted" : ""}
                      >
                        Today
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("yesterday")}
                        className={dateRange === "yesterday" ? "bg-muted" : ""}
                      >
                        Yesterday
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("last7days")}
                        className={dateRange === "last7days" ? "bg-muted" : ""}
                      >
                        Last 7 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("1month")}
                        className={dateRange === "1month" ? "bg-muted" : ""}
                      >
                        1 Month
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDateRangeFilter("6months")}
                        className={dateRange === "6months" ? "bg-muted" : ""}
                      >
                        6 Months
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                    {(searchQuery || paymentStatus || dateRange) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 shrink-0"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Invoice</TableHead>
                            <TableHead className="hidden sm:table-cell font-semibold">
                              Customer
                            </TableHead>
                            <TableHead className="hidden sm:table-cell font-semibold">
                              Status
                            </TableHead>
                            <TableHead className="hidden md:table-cell font-semibold">
                              Date
                            </TableHead>
                            <TableHead className="text-right font-semibold">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                      <TableBody>
                        {loading ? (
                          // Shimmer loading rows
                          Array.from({ length: 10 }).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                              <TableCell>
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-36" />
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Skeleton className="h-5 w-20 rounded-full" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-20 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : checkoutData?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No orders found. Try adjusting your filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          checkoutData?.map((order, index) => {
                            const isSelected = selectedOrder?.invoiceId === order.invoiceId;
                            return (
                            <TableRow
                              key={index}
                              onClick={() => handleOnclickTable(order)}
                              className={`cursor-pointer transition-colors ${
                                isSelected 
                                  ? "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary" 
                                  : "hover:bg-muted/50"
                              }`}
                            >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground sm:hidden">INV:</span>
                                <span className="font-mono text-sm">{order.invoiceId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{order.user?.name || "N/A"}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {order.user?.email || ""}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge 
                                className="text-xs" 
                                variant={
                                  order.paymentStatus === "Terminé" ? "default" :
                                  order.paymentStatus === "En attente" ? "secondary" :
                                  "destructive"
                                }
                              >
                                {order.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ${order.totalAmount?.toFixed(2) || "0.00"}
                            </TableCell>
                          </TableRow>
                          );
                          })
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/30 px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong className="text-foreground">
                        {checkoutData.length > 0 ? (currentPage - 1) * 10 + 1 : 0}
                      </strong> to{" "}
                      <strong className="text-foreground">{(currentPage - 1) * 10 + (checkoutData?.length || 0)}</strong> of{" "}
                      <strong className="text-foreground">{totalItems}</strong> Orders
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNumber);
                                }}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {totalPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(totalPages);
                                }}
                                isActive={currentPage === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage(currentPage + 1);
                            }}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </CardFooter>
                </Card>
            </div>

            {/* Order Details Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
              {loading ? (
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              ) : selectedOrder?.invoiceId ? (
                <>
                  <CardHeader className="space-y-3 pb-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg group flex items-center gap-2">
                          Order Details
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOrder.invoiceId);
                              toast.success("Invoice ID copied!");
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-muted-foreground">
                            {selectedOrder.invoiceId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(selectedOrder?.createdAt)}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Export</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Plan Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Plan</h3>
                      {selectedOrder?.package ? (
                        <div
                          onClick={() =>
                            route.push(
                              `/course/details?id=${selectedOrder?.package._id}`
                            )
                          }
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {selectedOrder?.package?.title}
                            </p>
                            {selectedOrder?.package?.short_description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {selectedOrder.package.short_description}
                              </p>
                            )}
                          </div>
                          <span className="font-semibold text-sm shrink-0">
                            ${selectedOrder?.package?.price?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No plan found</p>
                      )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Price Breakdown</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">${selectedOrder?.totalAmount?.toFixed(2) || "0.00"}</span>
                        </div>
                        {(selectedOrder?.commission || 0) > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              Sales Commission
                              <div className="relative group">
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute z-10 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded-md p-2 w-48 shadow-lg border -top-2 left-6">
                                  Commission deducted by the organization upon plan purchase.
                                </div>
                              </div>
                            </span>
                            <span className="font-medium text-foreground">
                              -${(selectedOrder.commission || 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(selectedOrder?.platformFee || 0) > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              Platform Fee
                              <div className="relative group">
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute z-10 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded-md p-2 w-48 shadow-lg border -top-2 left-6">
                                  Platform fee charged by the organization for providing the plan.
                                </div>
                              </div>
                            </span>
                            <span className="font-medium text-foreground">
                              -${(selectedOrder.platformFee || 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {(selectedOrder?.tax || 0) > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              Tax
                              <div className="relative group">
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute z-10 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded-md p-2 w-48 shadow-lg border -top-2 left-6">
                                  Tax applied to the total amount of the plan.
                                </div>
                              </div>
                            </span>
                            <span className="font-medium text-foreground">
                              -${(selectedOrder.tax || 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex items-center justify-between text-base font-semibold pt-1">
                          <span className="text-foreground">Total Earning</span>
                          <span className="text-foreground">${(selectedOrder?.amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Customer Information */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Customer</h3>
                      <dl className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <dt className="text-muted-foreground">Name</dt>
                          <dd className="font-medium text-right">{selectedOrder?.user?.name || "N/A"}</dd>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd className="font-medium text-right break-all">
                            {selectedOrder?.user?.email ? (
                              <a href={`mailto:${selectedOrder.user.email}`} className="text-foreground hover:underline">
                                {selectedOrder.user.email}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </dd>
                        </div>
                        {selectedOrder?.user?.phone && (
                          <div className="flex items-center justify-between text-sm">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd className="font-medium text-right">
                              <a href={`tel:${selectedOrder.user.phone}`} className="text-foreground hover:underline">
                                {selectedOrder.user.phone}
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <Separator />

                    {/* Payment Information */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Payment</h3>
                      <dl className="space-y-2.5">
                        {selectedOrder?.paymentMethod && (
                          <div className="flex items-center justify-between text-sm">
                            <dt className="text-muted-foreground flex items-center gap-1.5">
                              <CreditCard className="h-3.5 w-3.5" />
                              Method
                            </dt>
                            <dd className="font-medium">{selectedOrder.paymentMethod}</dd>
                          </div>
                        )}
                        {selectedOrder?.paymentStatus && (
                          <div className="flex items-center justify-between text-sm">
                            <dt className="text-muted-foreground flex items-center gap-1.5">
                              Status
                            </dt>
                            <dd>
                              <Badge
                                variant={
                                  selectedOrder.paymentStatus === "Terminé" ? "default" :
                                  selectedOrder.paymentStatus === "En attente" ? "secondary" :
                                  "destructive"
                                }
                                className="text-xs"
                              >
                                {selectedOrder.paymentStatus}
                              </Badge>
                            </dd>
                          </div>
                        )}
                        {selectedOrder?.releaseDate && (
                          <div className="flex items-center justify-between text-sm">
                            <dt className="text-muted-foreground flex items-center gap-1.5">
                              <CalendarRange className="h-3.5 w-3.5" />
                              Release Date
                              <div className="relative group">
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute z-10 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded-md p-2 w-48 shadow-lg border -top-2 left-6">
                                  Date when earnings will be released for withdrawal.
                                </div>
                              </div>
                            </dt>
                            <dd className="font-medium text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {formatDateTime(selectedOrder.releaseDate)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 px-6 py-3">
                    <div className="text-xs text-muted-foreground w-full text-center">
                      Updated {new Date(selectedOrder?.updatedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </>
              ) : (
                <CardContent className="p-6">
                  <div className="text-center py-8 space-y-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No Order Selected</p>
                    <p className="text-xs text-muted-foreground">
                      Click on an order from the table to view details
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
