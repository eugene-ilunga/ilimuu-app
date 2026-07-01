'use client'

import { useState, useEffect } from 'react'
import { Plus, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from 'next/link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function AdminNotificationTable() {
  const [notifications, setNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5 // Number of items per page

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await fetch(`/api/notification/send?page=${currentPage}&limit=${pageSize}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await res.json()
        setNotifications(data.notifications)
        setTotalPages(data.pagination.totalPages) // Update total pages from response
      } catch (error) {
        console.error("Error fetching notification data:", error)
      }
    }

    fetchNotification()
  }, [currentPage]) // Re-fetch data when the current page changes

  return (
    <div className='m-6'>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notification Management</CardTitle>
          <Link href="/dashboard/notification/add-new">
            <Button className="text-white">
              <Plus className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Title</TableHead>
                <TableHead >Message</TableHead>
                <TableHead >Recipients</TableHead>
                <TableHead >Sent At</TableHead>
                <TableHead >Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification._id.title}>
                  <TableCell>{notification._id.title}</TableCell>
                  <TableCell>{notification._id.message}</TableCell>
                  <TableCell>
                    {notification._id.recipients.toUpperCase()} ({notification.count})
                  </TableCell>
                  <TableCell>{new Date(notification.lastSent).toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{notification._id.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input id="title" value={notification._id.title} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="message" className="text-right">
                              Message
                            </Label>
                            <Textarea id="message" value={notification._id.message} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="recipients" className="text-right">
                              Recipients
                            </Label>
                            <Input id="recipients" value={notification._id.recipients} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sentAt" className="text-right">
                              Sent At
                            </Label>
                            <Input
                              id="sentAt"
                              value={new Date(notification.lastSent).toLocaleString()}
                              className="col-span-3"
                              readOnly
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong>{Math.min(currentPage * pageSize, notifications.length)}</strong> of <strong>{totalPages * pageSize}</strong> notifications
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink href="#" onClick={() => setCurrentPage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}
