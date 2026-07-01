"use client";
import { useState, useEffect } from "react";
import { CreditCard, Building, Wallet, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePayoutAccountHooks } from "@/hooks/usePayoutAccountHooks";
import { maskSensitiveData } from "@/utils/mask-sensitive-data";
import { useWithdrawGetwayHooks } from "@/hooks/useWithdrawGetwayHooks";
import toast from "react-hot-toast";

export default function PaymentMethods() {
  const [formData, setFormData] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const { PayoutAccountData, fetchPayoutAccount } = usePayoutAccountHooks();
  const { withdrawGetway } = useWithdrawGetwayHooks("Actif");

  useEffect(() => {
    setPaymentMethods(withdrawGetway);
    if (withdrawGetway?.length > 0) {
      setSelectedMethod(withdrawGetway[0]);
    }
  }, [withdrawGetway]);

  const handleMethodChange = (methodId) => {
    const method = paymentMethods.find((m) => m._id === methodId);
    setSelectedMethod(method || null);
    setFormData({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestPayload = {
      id: editingAccount?._id,
      accountType: selectedMethod?.name,
      accountDetails: {
        type: selectedMethod?.name,
        details: { ...formData },
      },
    };

    try {
      const url = editingAccount
        ? `/api/payout-account/update`
        : "/api/payout-account/add-new";
      const method = editingAccount ? "POST" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      if (data.status === 200 || data.status === 201) {
        toast.success(
          editingAccount ? "Payment method updated." : "Payment method added."
        );
        setIsDialogOpen(false);
        setEditingAccount(null);
        fetchPayoutAccount();
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setSelectedMethod(
      paymentMethods.find((m) => m.name === account.accountType)
    );
    setFormData(account.accountDetails.details);
    setIsDialogOpen(true);
  };

  const handleDelete = async (accountId) => {
    toast(
      (t) => (
        <div className="flex flex-col items-start space-y-2">
          <p className="text-gray-800">
            Are you sure you want to delete this item?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                deleteItem(accountId); // Perform delete operation
                toast.dismiss(t.id); // Dismiss the toast
                toast.success("Item deleted successfully!");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Dismiss the toast
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000, // Adjust as needed
      }
    );
  };

  const deleteItem = async (itemId) => {
    try {
      const formData = new FormData();
      formData.append("account_id", itemId);
      const response = await fetch("/api/payout-account/delete", {
        method: "DELETE",
        body: formData,
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Payment method deleted successfully.");
        fetchPayoutAccount();
      } else {
        toast.error(data.error || "Failed to delete payment method.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "bank account":
        return <Building className="mb-3 h-6 w-6" />;
      case "stripe":
        return <CreditCard className="mb-3 h-6 w-6" />;
      default:
        return <Wallet className="mb-3 h-6 w-6" />;
    }
  };

  return (
    <div className="m-6">
      <div className="w-full mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Payout Account</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Add and manage your payout accounts. These accounts are used to receive earnings.

          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex justify-end">
                <Button className="w-full sm:w-auto text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Payout Account
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Modifier" : "Add"} Payment Method
                </DialogTitle>
                <DialogDescription>
                  Enter your details to {editingAccount ? "update" : "add"} a
                  payment method.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingAccount && (
                  <div className="space-y-2">
                    <RadioGroup
                      defaultValue={selectedMethod?._id}
                      className="grid grid-cols-3 gap-4"
                      onValueChange={handleMethodChange}
                    >
                      {paymentMethods?.map((method) => (
                        <div key={method._id}>
                          <RadioGroupItem
                            value={method._id}
                            id={method._id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={method._id}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            {getIcon(method.name)}
                            {method.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {selectedMethod?.requiredFields.map((field) => (
                  <div key={field._id} className="space-y-2">
                    <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
                    {field.fieldType === "boolean" ? (
                      <div>
                        <input
                          id={field.fieldName}
                          name={field.fieldName}
                          type="checkbox"
                          checked={formData[field.fieldName] ?? false}
                          onChange={handleInputChange}
                        />
                        <Label htmlFor={field.fieldName} className="ml-2">
                          {field.fieldName}
                        </Label>
                      </div>
                    ) : (
                      <Input
                        id={field.fieldName}
                        name={field.fieldName}
                        type={
                          field.fieldType === "number"
                            ? "number"
                            : field.fieldType
                        }
                        placeholder={field.fieldName}
                        value={formData[field.fieldName] || ""}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  {editingAccount ? "Mettre à jour" : "Enregistrer"} Payment Method
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Account Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PayoutAccountData?.map((acc) => (
                <TableRow key={acc._id}>
                  <TableCell className="font-medium">{acc.accountType}</TableCell>
                  <TableCell>
                    {acc.accountDetails.details
                      ? Object.entries(acc.accountDetails.details).map(
                        ([key, value], index) => (
                          <div key={index}>
                            <strong>{key}:</strong>{" "}
                            {maskSensitiveData(String(value))}
                          </div>
                        )
                      )
                      : "No Details Available"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(acc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(acc._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
