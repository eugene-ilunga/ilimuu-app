"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { CircleUser, Search, Menu, LogOut, User, Settings } from "lucide-react";

import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "./ui/dropdown-menu";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  // All available dashboard options
  const allDashboardOptions = [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Cours", path: "/dashboard/course" },
    { label: "Ajouter un cours", path: "/dashboard/course/add-new" },
    { label: "Manage Course", path: "/dashboard/course/" },
    { label: "Course Types", path: "/dashboard/course-type" },
    { label: "Ajouter un plan", path: "/dashboard/mentorship/add-plan" },
    { label: "Manage Plan", path: "/dashboard/mentorship/all-plan" },
    { label: "Booked Mentorship", path: "/dashboard/mentorship/booked-mentorship" },
    { label: "Catégorie", path: "/dashboard/category" },
    { label: "Add Category", path: "/dashboard/category/add" },
    { label: "Manage Category", path: "/dashboard/category/manage" },
    { label: "Utilisateurs", path: "/dashboard/user" },
    { label: "Financial", path: "/dashboard/financial" },
    { label: "Analytics", path: "/dashboard/analytics" },
    { label: "Post Feed", path: "/dashboard/post-feed" },
    { label: "Messages", path: "/dashboard/contact-message" },
    { label: "Notifications", path: "/dashboard/notification" },
    { label: "Paramètres", path: "/dashboard/settings" },
    { label: "Transaction", path: "/dashboard/transection" },
    { label: "App Settings", path: "/dashboard/appsettings" },
    { label: "Rapport des ventes", path: "/dashboard/sales-report" },
    { label: "Course Sales", path: "/dashboard/sales-report/course" },
    { label: "Bootcamp Sales", path: "/dashboard/sales-report/bootcamp" },
    { label: "Mentorship Sales", path: "/dashboard/sales-report/mentorship" },
    { label: "Paiement", path: "/dashboard/payment-method" },
    { label: "Manage Account", path: "/dashboard/payment-account" },
    { label: "Withdraw Gateway", path: "/dashboard/withdraw-getway" },
    { label: "Online Class", path: "/dashboard/online-class" },
    { label: "Banners", path: "/dashboard/banners" },
    { label: "Pages personnalisées", path: "/dashboard/custom-pages" },
  ];

  // Instructor-specific options
  const instructorOptions = [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Cours", path: "/dashboard/course" },
    { label: "Ajouter un cours", path: "/dashboard/course/add-new" },
    { label: "Manage Course", path: "/dashboard/course/" },
    { label: "Ajouter un plan", path: "/dashboard/mentorship/add-plan" },
    { label: "Manage Plan", path: "/dashboard/mentorship/" },
    { label: "Booked Mentorship", path: "/dashboard/booked-mentorship" },
    { label: "Rapport des ventes", path: "/dashboard/sales-report" },
    { label: "Course Sales", path: "/dashboard/sales-report/course" },
    { label: "Bootcamp Sales", path: "/dashboard/sales-report/bootcamp" },
    { label: "Mentorship Sales", path: "/dashboard/sales-report/mentorship" },
    { label: "Financial", path: "/dashboard/financial" },
    { label: "Paiement", path: "/dashboard/payment-method" },
    { label: "Manage Account", path: "/dashboard/payment-account" },
    { label: "Online Class", path: "/dashboard/online-class" },
    { label: "Transaction", path: "/dashboard/transection" },
  ];

  const [query, setQuery] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  // Get user role from cookies
  useEffect(() => {
    const getCookieValue = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const role = getCookieValue('role');
    const name = getCookieValue('name');
    
    if (role) {
      setUserRole(role);
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  // Get role-based options
  const getRoleBasedOptions = () => {
    switch (userRole) {
      case 'instructor':
        return instructorOptions;
      case 'admin':
        return allDashboardOptions;
      default:
        return instructorOptions; // Default to instructor options
    }
  };

  const dashboardOptions = getRoleBasedOptions();

  const filteredLinks = dashboardOptions.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    setQuery("");
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout/", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <header className="flex h-16 items-center gap-4 border-b  px-4 lg:h-[70px] lg:px-6 shadow-sm">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden border-gray-200 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-white">
            <div className="mb-4 p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
              <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {dashboardOptions.map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Search Section */}
        <div className="w-full flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={`Search ${userRole} options...`}
              className="w-full appearance-none bg-white pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.length > 0 && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelect(item.path)}
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <span className="text-gray-800 font-medium">{item.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No options found for {query}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3">
          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="capitalize">{userRole}</span>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <CircleUser className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    {userName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-gray-500 capitalize">
                    {userRole} Account
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuGroup>
                <Link href="/dashboard/admin-profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                    <User className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Profile</span>
                  </DropdownMenuItem>
                </Link>
               
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default Header;
