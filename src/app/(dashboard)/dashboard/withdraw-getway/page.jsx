"use client";

import { useState, useEffect } from "react";
import { WithdrawGatewayList } from "@/components/dynamic-field/withdraw-gateway-list";
import { WithdrawGatewayForm } from "@/components/dynamic-field/withdraw-gateway-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useWithdrawGetwayHooks } from "@/hooks/useWithdrawGetwayHooks";
import toast from "react-hot-toast";

export default function WithdrawGatewaysPage() {
  const [editingGateway, setEditingGateway] = useState(null);
  const [viewingGateway, setViewingGateway] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { withdrawGetway, getWithdrawGetway } = useWithdrawGetwayHooks();

  const handleAddGateway = () => {
    setEditingGateway(null);
    setIsFormVisible(true);
  };

  const handleEditGateway = (gateway) => {
    setEditingGateway(gateway);
    setIsFormVisible(true);
  };

  const handleDeleteGateway = async (id) => {
    try {
      // Update logic

      const formData = new FormData();
      formData.append("id", id);
      const res = await fetch("/api/withdraw-getway/delete", {
        method: "DELETE",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success("Gateway deleted successfully");
        getWithdrawGetway(); // Refresh the list after deletion
      }
    } catch (error) {
      toast.error("Failed to delete gateway");
    }
  };

  const handleSaveGateway = async (gateway) => {
    try {
      if (editingGateway) {
        // Update logic
        const formData = new FormData();
        formData.append("id", editingGateway._id);
        formData.append("name", gateway.name);
        formData.append(
          "requiredFields",
          JSON.stringify(gateway.requiredFields)
        );
        const res = await fetch("/api/withdraw-getway/update", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.status === 200) {
          toast.success("Gateway updated successfully");
        }
      } else {
        // Add logic
        const formData = new FormData();
        formData.append("name", gateway.name);
        formData.append("status", gateway.status);
        formData.append(
          "requiredFields",
          JSON.stringify(gateway.requiredFields)
        );
        const res = await fetch("/api/withdraw-getway/add-new", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Gateway added successfully");
        }
      }
      getWithdrawGetway(); // Refresh the list after saving
    } catch (error) {
      toast.error("Failed to save gateway");
    }

    setIsFormVisible(false);
    setEditingGateway(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const res = await fetch(`/api/withdraw-getway/toggle-status`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success("Status updated successfully");
        getWithdrawGetway(); // Refresh the list after status toggle
      }
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const handleViewGateway = (gateway) => {
    setViewingGateway(gateway);
  };

  return (
    <div className="m-6">
      <div className="mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Withdraw Gateways</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Configure the dynamic fields for withdrawal gateways used by instructors. These fields will be required when instructors set up a withdrawal method to access their earnings.<br />
          Add a gateway with the necessary fields to ensure instructors provide all required information when creating a withdrawal method.
        </p>

        <div className="mb-4">
          <div className="flex justify-end">
            <Button onClick={handleAddGateway} className="text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Gateway
            </Button>
          </div>
        </div>
        {isFormVisible ? (
          <WithdrawGatewayForm
            gateway={editingGateway}
            onSave={handleSaveGateway}
            onCancel={() => setIsFormVisible(false)}
          />
        ) : viewingGateway ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Gateway Details</h2>
            {viewingGateway && (
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      Name
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {viewingGateway.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      Status
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {viewingGateway.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      Required Fields
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {viewingGateway.requiredFields?.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {viewingGateway.requiredFields.map((field, index) => (
                            <li key={index} className="mb-1">
                              <span className="font-medium">Field Name:</span>{" "}
                              {field.fieldName},&nbsp;
                              <span className="font-medium">Type:</span>{" "}
                              {field.fieldType}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No fields required</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <Button onClick={() => setViewingGateway(null)}>Back</Button>
            </div>
          </div>
        ) : (
          <WithdrawGatewayList
            gateways={withdrawGetway}
            onEdit={handleEditGateway}
            onDelete={handleDeleteGateway}
            onToggleStatus={handleToggleStatus}
            onView={handleViewGateway}
          />
        )}
      </div>
    </div>
  );
}
