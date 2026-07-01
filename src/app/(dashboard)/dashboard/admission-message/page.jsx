'use client';
import { useState, useEffect } from 'react';
import { Plus, Info, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,

  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AdmissionMessageList = () => {
  const [admissionMsg, setAdmissionMsg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchAdmissionMsg = async () => {
      try {
        const response = await fetch('/api/contact/admissionMessage/list');
        const data = await response.json();
        if (data.success) {
          setAdmissionMsg(data.contacts);
        } else {
          console.error('Error fetching contacts:', data.error);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionMsg();
  }, []); // Added searchQuery to dependencies

  if (loading) return <div>Loading...</div>;

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/contact/admissionMessage/deleteMessage?id=${id}`, {
            method: 'DELETE',
          });

          const data = await res.json();
          if (data.success) {
            setAdmissionMsg(admissionMsg.filter(contact => contact._id !== id));
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } else {
            console.error('Delete failed:', data.error);
            alert('Failed to delete contact. Try again later.');
          }
        } catch (error) {
          console.error('Delete failed:', error);
          alert('Something went wrong. Try again later.');
        }
      }
    });
  };
  return (

    <div className='m-6'>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admission Message Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead >Name</TableHead>
                <TableHead >Email</TableHead>
                <TableHead >Phone</TableHead>
                <TableHead >Course</TableHead>
                <TableHead >Message</TableHead>
                <TableHead >Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissionMsg.length > 0 ? (
                admissionMsg.map((msg, index) => (
                  <TableRow className=" items-center" key={index}>
                    <TableCell className="text-md text-black text-nowrap">{msg.name}</TableCell>
                    <TableCell className="text-md  text-black text-nowrap">{msg.email}</TableCell>
                    <TableCell className="text-md  text-black text-nowrap">{msg.phone}</TableCell>
                    <TableCell className="text-md  text-black text-nowrap">{msg.courseName}</TableCell>
                    <TableCell className="text-md  text-black">{msg.message}</TableCell>
                    <TableCell className="flex gap-2 text-md font-semibold text-gray-500">
                      <div>


                        <Dialog>
                          <DialogTrigger asChild>
                            <Eye
                              onClick={() => setSelectedMessage(msg)}
                              className="text-gray-500 p-2 border-[1px] rounded-sm cursor-pointer w-9 h-9"
                            />
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Post Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 overflow-y-scroll h-[400px]">
                              <p><strong>Name:</strong> {selectedMessage?.name}</p>
                              <p><strong>Email:</strong> {selectedMessage?.email}</p>
                              <p><strong>Phone:</strong> {selectedMessage?.phone}</p>
                              <p><strong>Course:</strong> {selectedMessage?.courseName}</p>
                              <p><strong>Created At:</strong> {selectedMessage ? new Date(selectedMessage.createdAt).toLocaleDateString() : ''}</p>
                              <p><strong>Message:</strong> {selectedMessage?.message}</p>
                            </div>
                          </DialogContent>
                        </Dialog>

                      </div>
                      <Trash2 onClick={() => handleDelete(msg._id)} className='text-gray-500 p-2 border-[1px] rounded-sm cursor-pointer w-9 h-9' />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdmissionMessageList;