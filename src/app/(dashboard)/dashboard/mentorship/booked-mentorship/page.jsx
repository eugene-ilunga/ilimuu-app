"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Edit,
  Clock,
  User,
  Play,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useEnrollListHooks } from "@/hooks/useEntrollListHooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useBookedPlanHooks } from "@/hooks/useMentorPlanEnrollHooks";
import { MentorList } from "./mentor-list";

export default function StudentProfile() {
  const { enrollPlan, total } = useBookedPlanHooks();

  return (
    <div className="container mx-auto p-4">
      <div></div>

      <div>
        <MentorList enrollList={enrollPlan} total={total} />
      </div>
    </div>
  );
}
