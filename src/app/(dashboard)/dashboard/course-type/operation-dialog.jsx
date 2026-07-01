import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

export function CourseTypeAddDialog({ onTypeAdded }) {
  const createCourseType = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const toastId = toast.loading("Saving changes...");
    const res = await fetch("/api/course-type/add-new", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.status === 201) {
      onTypeAdded();
      toast.success("Course Type created successfully", { id: toastId });
    } else {
      toast.error(`${result.message}`, { id: toastId });
    }
    toast.dismiss(toastId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1 text-white">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add New
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Course Type</DialogTitle>
          <DialogDescription>
            Make changes to your course type here. Click save when you&aposre
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createCourseType} className="grid gap-4 py-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input name="name" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild className="sm:justify-start gap-5">
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogTrigger asChild>
              <Button className="text-white" type="submit">Save changes</Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CourseTypeUpdateDialog({
  onTypeupdate,
  courseType,
  isEditOpen,
  onClose,
}) {
  const upateCourseType = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("id", courseType._id);
    const toastId = toast.loading("Saving changes...");
    const res = await fetch("/api/course-type/update", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.status === 200) {
      onTypeupdate();
      toast.success("Course Type update successfully", { id: toastId });
      onClose(); // Close the dialog after successful update

    } else {
      toast.error(`${result.message}`, { id: toastId });
    }

    toast.dismiss(toastId);
  };

  return (
    <Dialog open={isEditOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Course Type</DialogTitle>
          <DialogDescription>
            Make changes to your course type here. Click save when you&aposre
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={upateCourseType} className="grid gap-4 py-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                defaultValue={courseType.name}
                name="name"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild className="sm:justify-start gap-5">
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
           
              <Button type="submit">Save changes</Button>
           
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
