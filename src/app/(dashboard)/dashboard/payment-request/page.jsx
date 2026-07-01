"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Loader2, MoreHorizontal, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CheckCircle,
  XCircle,
  Eye,
  PersonStanding,
  Loader,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { useWithdrawRequestStatsHooks } from "@/hooks/useWithdrawRequestStatsHooks";
import { useWithdrawRequestHooks } from "@/hooks/userWithdrawRequestHooks";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";

const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "destructive",
  Processing: "info",
  Completed: "success",
};



function WithdrawRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [filter, setFilter] = useState("all");
  const { withdrawRequestData, fetchWithdrawRequest, total } =
    useWithdrawRequestHooks(currentPage, "all-list", searchQuery, filter === "all" ? "" : filter);
  const { withdrawRequestStats, fetchWithdrawRequestStats } =
    useWithdrawRequestStatsHooks();


  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
    requestId: null,
    remark: "",
  });
  const [detailsDialog, setDetailsDialog] = useState({
    isOpen: false,
    request: null,
  });

  const [currentStatus, setCurrentStatus] = useState(
    detailsDialog.request?.status || ""
  );

  const updatePaymentStatus = async (id, newStatus, remark) => {
    const formData = new FormData();
    formData.append("requestId", id);
    formData.append("status", newStatus);
    formData.append("remarks", remark);
    const response = await fetch("/api/withdraw-request/change-status", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.status === 200) {
      toast.success(data.message);


      fetchWithdrawRequest(currentPage);
      fetchWithdrawRequestStats();
    }
    else {
      toast.error(data.message);
    }


    setConfirmDialog({
      isOpen: false,
      action: null,
      requestId: null,
      remark: "",
    });
  };

  const openConfirmDialog = (action, id) => {
    setConfirmDialog({ isOpen: true, action, requestId: id, remark: "" });
  };

  const openDetailsDialog = (request) => {
    setDetailsDialog({ isOpen: true, request });
  };

  const filteredRequests = withdrawRequestData.filter(
    (request) => filter === "all" || request.status === filter
  );

  const handleStatusChange = (newStatus) => {
    if (detailsDialog.request) {
      updatePaymentStatus(
        detailsDialog.request._id,
        newStatus,
        "Status changed from details dialog"
      );
      setCurrentStatus(newStatus);
    }
  };

  useEffect(() => {
    fetchWithdrawRequest();
    setTotalPages(Math.ceil(total / 5));
  }
    , [total, searchQuery]);




  return (

    <div className="m-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Payment Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-5">
        {(withdrawRequestStats || []).map(
          ({ status, totalCount, totalAmount }, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status} Requests
                </CardTitle>
                {status === "Approuvé" || status === "Terminé" ? (
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                ) : status === "Rejeté" ? (
                  <XCircle className="h-4 w-4 text-gray-500" />
                ) : (
                  <Loader className="h-4 w-4 text-gray-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${totalAmount || 0} total
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Payment Requests</CardTitle>

          <div className="flex justify-end space-x-2 mb-4">
            <div className="flex justify-end space-x-2">
              <Input
                type="search"
                placeholder="Search by Transaction ID"
                className="w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change

              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.keys(statusColors).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TRX ID</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <Tooltip key={request._id}>
                    <TooltipTrigger asChild>
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request?.transactionId}
                        </TableCell>
                        <TableCell>{request?.accountDetails?.type}</TableCell>
                        <TableCell>${request.amount}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} >
                            {request.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => openDetailsDialog(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openDetailsDialog(request)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {request.status !== "Terminé" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog("En attente", request._id)
                                    }
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>Set as Pending</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog("Approuvé", request._id)
                                    }
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <span>Approve</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog("Rejeté", request._id)
                                    }
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    <span>Reject</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog("En cours", request._id)
                                    }
                                  >
                                    <Loader2 className="mr-2 h-4 w-4" />
                                    <span>Set as Processing</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog("Terminé", request._id)
                                    }
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    <span>Set as Completed</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                        <p>User: {request?.user?.name}</p>
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
                              {key}: {((value))}
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          setConfirmDialog({ ...confirmDialog, isOpen })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to{" "}
              {confirmDialog.action}?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remark" className="text-right">
                Remark
              </Label>
              <Input
                id="remark"
                value={confirmDialog.remark}
                onChange={(e) =>
                  setConfirmDialog({ ...confirmDialog, remark: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({
                  isOpen: false,
                  action: null,
                  requestId: null,
                  remark: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmDialog.action === "Approuvé" ? "default" : "destructive"
              }
              onClick={() =>
                updatePaymentStatus(
                  confirmDialog.requestId,
                  confirmDialog.action,
                  confirmDialog.remark
                )
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailsDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDetailsDialog({ ...detailsDialog, isOpen })
        }
      >
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {detailsDialog.request && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Badge variant="success">
                    {detailsDialog.request?.status}
                  </Badge>
                </div>

                <p>Transaction ID: {detailsDialog.request.transactionId}</p>
                <p>Amount: ${detailsDialog.request.amount}</p>
                <p>Status: {detailsDialog.request.status}</p>
                <p>
                  User Balance Before: $
                  {detailsDialog.request.userBalanceBefore}
                </p>
                <p>
                  User Balance After: ${detailsDialog.request.userBalanceAfter}
                </p>
                <p>
                  Is Recurring:{" "}
                  {detailsDialog.request.isRecurring ? "Oui" : "Non"}
                </p>
                <p>Request IP: {detailsDialog.request.requestIP}</p>
                <p>
                  Created At:{" "}
                  {new Date(detailsDialog.request.createdAt).toLocaleString()}
                </p>
                <p>
                  Updated At:{" "}
                  {new Date(detailsDialog.request.updatedAt).toLocaleString()}
                </p>
                <hr />
                {detailsDialog.request.remarks && (
                  <p className="text-fuchsia-500">
                    Remarks: {detailsDialog.request.remarks}
                  </p>
                )}

                {detailsDialog.request.status === "Rejeté" && (
                  <p className="text-red-500">
                    Reason: {detailsDialog.request.rejectionReason}
                  </p>
                )}
                <hr />

                <h4 className="font-semibold mt-2">Account Details</h4>
                <p>Type: {detailsDialog.request?.accountDetails?.type}</p>
                {detailsDialog.request?.accountDetails?.details
                  ? Object.entries(
                    detailsDialog.request?.accountDetails?.details
                  ).map(([key, value], index) => (
                    <div key={index}>
                      {key}: {String(value)}
                    </div>
                  ))
                  : "No Details Available"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(statusColors).map((status) => (
                    <Button
                      key={status}
                      variant={currentStatus === status ? "default" : "outline"}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="remark" className="text-right font-semibold">
                  Remark
                </Label>
                <div className="items-center gap-4 mt-2">
                  <Textarea
                    id="remark"
                    value={confirmDialog.remark}
                    onChange={(e) =>
                      setConfirmDialog({
                        ...confirmDialog,
                        remark: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setDetailsDialog({ isOpen: false, request: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
}

export default function Component() {
  return <WithdrawRequest />;
}
