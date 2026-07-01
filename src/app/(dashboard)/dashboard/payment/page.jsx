"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEarningHooks } from "@/hooks/useEarningHooks";
import { useWithdrawRequestHooks } from "@/hooks/userWithdrawRequestHooks";
import { maskSensitiveData } from "@/utils/mask-sensitive-data";
import { usePayoutAccountHooks } from "@/hooks/usePayoutAccountHooks";
import { from } from "form-data";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaymentWithdraw() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const { earning, fetchEarning } = useEarningHooks();
  const { withdrawRequestData, fetchWithdrawRequest, total } =
    useWithdrawRequestHooks(currentPage, "");

  const { PayoutAccountData } = usePayoutAccountHooks();


  useEffect(() => {
    fetchWithdrawRequest();
    fetchEarning();
    setTotalPages(Math.ceil(total / 5));
  }, [total]);

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    //create a new withdraw request

    const formData = new FormData(event.target);

    const toastID = toast.loading("Please wait...");


    formData.append("account", selectedAccount);

    const request = await fetch("/api/withdraw-request/create", {
      method: "POST",
      body: formData,
    });

    toast.dismiss(toastID);

    const data = await request.json();
    if (data.status === 201) {
      setIsDialogOpen(false);
      fetchWithdrawRequest();
      fetchEarning();
      toast.success("Withdraw request submitted successfully");
    } else {
      toast.error(data.error);
    }
  };

  return (

    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-6 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earning
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earning?.totalEarnings}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Balance
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earning?.availableBalance}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Withdraw List</CardTitle>
                <CardDescription>
                  Recent withdrawal request from your account.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="ml-auto gap-1 text-white">
                    Withdraw Request
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Withdraw Request</DialogTitle>
                    <DialogDescription>
                      Please fill in the details for your withdrawal request.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleOnSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          name="amount"
                          type="number"
                          className="col-span-3"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                          Account Details
                        </Label>
                        <Select
                          value={selectedAccount}
                          onValueChange={setSelectedAccount}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {PayoutAccountData?.map((account) => (
                              <SelectItem key={account._id} value={account._id}>
                                {account.accountDetails.type} -
                                {account?.accountDetails?.details
                                  ? (() => {
                                    const entries = Object.entries(
                                      account?.accountDetails?.details
                                    );
                                    const [key, value] = entries[0] || []; // Destructure the first entry
                                    return entries.length > 0 ? (
                                      <div>
                                        {key}: {String(value)}
                                      </div>
                                    ) : (
                                      "No Details Available"
                                    );
                                  })()
                                  : "No Details Available"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"

                      >
                        Submit Request
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawRequestData?.map((request) => (
                      <Tooltip key={request._id}>
                        <TooltipTrigger asChild>
                          <TableRow className="cursor-pointer">
                            <TableCell className="font-medium">
                              {request?.transactionId}
                            </TableCell>
                            <TableCell>
                              {request?.accountDetails?.type}
                            </TableCell>
                            <TableCell>
                              {request?.accountDetails?.details
                                ? Object.entries(
                                  request?.accountDetails?.details
                                ).map(([key, value], index) => (
                                  <div key={index}>
                                    {key}: {maskSensitiveData(String(value))}
                                  </div>
                                ))
                                : "No Details Available"}
                            </TableCell>
                            <TableCell>{request?.amount}</TableCell>
                            <TableCell>
                              <Badge variant="success">{request?.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(request?.createdAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="w-80 p-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-teal-400">
                                Withdrawal Details
                              </h3>
                              <Badge variant="success">{request?.status}</Badge>
                            </div>

                            <p>Transaction ID: {request.transactionId}</p>
                            <p>Amount: ${request.amount}</p>
                            <p>Status: {request.status}</p>
                            <p>
                              User Balance Before: ${request.userBalanceBefore}
                            </p>
                            <p>
                              User Balance After: ${request.userBalanceAfter}
                            </p>
                            <p>
                              Is Recurring: {request.isRecurring ? "Oui" : "Non"}
                            </p>
                            <p>Request IP: {request.requestIP}</p>
                            <p>
                              Created At:{" "}
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <p>
                              Updated At:{" "}
                              {new Date(request.updatedAt).toLocaleString()}
                            </p>
                            <hr />
                            {request.remarks && (
                              <p className="text-fuchsia-500">
                                Remarks: {request.remarks}
                              </p>
                            )}

                            {request.status === "Rejeté" && (
                              <p className="text-red-500">
                                Reason: {request.rejectionReason}
                              </p>
                            )}
                            <hr />

                            <h4 className="font-semibold mt-2">
                              Account Details
                            </h4>
                            <p>Type: {request?.accountDetails?.type}</p>
                            {request?.accountDetails?.details
                              ? Object.entries(
                                request?.accountDetails?.details
                              ).map(([key, value], index) => (
                                <div key={index}>
                                  {key}: {maskSensitiveData(String(value))}
                                </div>
                              ))
                              : "No Details Available"}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </CardContent>

            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
                <strong>{(currentPage - 1) * 5 + 5}</strong> Data
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>

  );
}
