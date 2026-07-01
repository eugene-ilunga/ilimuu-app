"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Upload, SquarePlus, PlusCircle } from "lucide-react";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadImage } from "@/utils/upload-image";
import TextareaList from "@/components/textarea-dynmaic";
import useCourseData from "@/hooks/useCourseSelectors";

import { useMentorPlanHooks } from "@/hooks/useMentorPlanHooks";
import { set } from "mongoose";

const AddCourse = () => {
  const router = useRouter();

  const { mentorPlan } = useMentorPlanHooks();
  const [starterService, setStarterService] = useState([""]);
  const [advancedService, setAdvancedService] = useState([""]);
  const [premiumService, setPremiumService] = useState([""]);

  useEffect(() => {
    if (mentorPlan) {
      setStarterService(mentorPlan.starterPlan?.services || [""]);
      setAdvancedService(mentorPlan.advancedPlan?.services || [""]);
      setPremiumService(mentorPlan.premiumPlan?.services || [""]);
    }
  }, [mentorPlan]);

  const createCourse = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("starter_service", JSON.stringify(starterService));
    formData.append("advanced_service", JSON.stringify(advancedService));
    formData.append("premium_service", JSON.stringify(premiumService));

    if (mentorPlan && mentorPlan.id) {
      formData.append("plan_id", mentorPlan.id);
    }

    const toastID = toast.loading("Creating Plan...");

    try {
      const res = await fetch("/api/mentorship-plan/add-plan", {
        method: "POST",
        body: formData,
      });

      toast.dismiss(toastID);
      const data = await res.json();

      if (res.status !== 201 || data.success !== true) {
        toast.error(`Failed to create plan! ${data.message}`);
      } else {
        toast.success(`${data.message}`);
        router.push("/dashboard/mentorship/all-plan");
      }
    } catch (error) {
      toast.dismiss(toastID);
    }
  };

  return (
    <div>
      <main className="grid flex-1 mt-3 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <form onSubmit={createCourse} className="grid gap-4 py-4">
          <div className=" grid  auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/course">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>

              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Mentorship Plan
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {mentorPlan?.id ? "Mettre à jour" : "New"}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                </Link>
                <Button type="submit" size="sm" className="text-white">
                  Save Plan
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Starter Plan</CardTitle>
                  <CardDescription>Add Starter plan info here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="starter_short_description">
                        Short Description
                      </Label>
                      <Textarea
                        name="starter_short_description"
                        required
                        className="min-h-15"
                        defaultValue={
                          mentorPlan?.starterPlan?.short_description
                        }
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="starter_charge">Charge (Per Month)</Label>
                      <Input
                        name="starter_charge"
                        type="number"
                        className="w-full"
                        defaultValue={mentorPlan?.starterPlan?.price}
                        required
                      />
                    </div>

                    <TextareaList
                      label="Service Includes"
                      items={starterService}
                      setItems={setStarterService}
                      handleAddNew={() =>
                        setStarterService([...starterService, ""])
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Advanced Plan</CardTitle>
                  <CardDescription>Add Advanced plan info here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="advanced_short_description">
                        Short Description
                      </Label>
                      <Textarea
                        name="advanced_short_description"
                        required
                        className="min-h-15"
                        defaultValue={
                          mentorPlan?.advancedPlan?.short_description
                        }
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="advanced_charge">
                        Charge (Per Month)
                      </Label>
                      <Input
                        name="advanced_charge"
                        type="number"
                        className="w-full"
                        required
                        defaultValue={mentorPlan?.advancedPlan?.price}
                      />
                    </div>

                    <TextareaList
                      label="Service Includes"
                      items={advancedService}
                      setItems={setAdvancedService}
                      handleAddNew={() =>
                        setAdvancedService([...advancedService, ""])
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <CardDescription>Add Premium plan info here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="short_description">
                        Short Description
                      </Label>
                      <Textarea
                        name="premium_short_description"
                        required
                        className="min-h-15"
                        defaultValue={
                          mentorPlan?.premiumPlan?.short_description
                        }
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="premium_charge">Charge (Per Month)</Label>
                      <Input
                        name="premium_charge"
                        type="number"
                        className="w-full"
                        required
                        defaultValue={mentorPlan?.premiumPlan?.price}
                      />
                    </div>

                    <TextareaList
                      label="Service Includes"
                      items={premiumService}
                      setItems={setPremiumService}
                      handleAddNew={() =>
                        setPremiumService([...premiumService, ""])
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button type="submit" size="sm" className="text-white">
                Save Plan
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddCourse;
