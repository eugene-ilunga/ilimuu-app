"use client";
import React from "react";
import { useMentorPlanHooks } from "@/hooks/useMentorPlanHooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MentorshipPlan = () => {
  const { mentorPlan } = useMentorPlanHooks();

  return (
    <div className="">
      <div>
        <h2 className="text-3xl font-bold tracki text-center mt-12 sm:text-5xl ">
          Mentorship Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center ">
          Get started on with your plan and upgrade when you are ready.
        </p>
      </div>

      {mentorPlan && mentorPlan.status === 404 ? (
        <main className="flex flex-2 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center p-10">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no plan
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a plan.
              </p>
              <Link href="/dashboard/mentorship/add-plan">
                <Button className="mt-4 text-white">Add Plan</Button>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        <div className="mt-24 container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {mentorPlan?.starterPlan && (
            <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold ">
                  {mentorPlan.starterPlan?.title}
                </h3>
                <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                  Most popular
                </p>
                <p className="mt-4 flex items-baseline ">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${mentorPlan.starterPlan?.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 ">
                  {mentorPlan.starterPlan?.short_description}
                </p>
                <ul role="list" className="mt-6 space-y-6">
                  {mentorPlan.starterPlan?.services.map((service, sindex) => (
                    <li key={sindex} className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 w-6 h-6 text-emerald-500"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="ml-3 ">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                className="bg-emerald-500 text-white  hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
                href={`/mentor?id=${mentorPlan.userid}`}
              >
                View plan
              </a>
            </div>
          )}

          {mentorPlan?.advancedPlan && (
            <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold ">
                  {mentorPlan.advancedPlan.title}
                </h3>
                <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                  Most popular
                </p>
                <p className="mt-4 flex items-baseline ">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${mentorPlan.advancedPlan?.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 ">
                  {mentorPlan.advancedPlan?.short_description}
                </p>
                <ul role="list" className="mt-6 space-y-6">
                  {mentorPlan.advancedPlan?.services.map((service, sindex) => (
                    <li key={sindex} className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 w-6 h-6 text-emerald-500"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="ml-3 ">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                className="bg-emerald-500 text-white  hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
                href="/auth/login"
              >
                View plan
              </a>
            </div>
          )}

          {mentorPlan?.premiumPlan && (
            <div className="relative p-8  border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold ">
                  {mentorPlan.premiumPlan.title}
                </h3>

                <p className="mt-4 flex items-baseline ">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${mentorPlan.premiumPlan?.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 ">
                  {mentorPlan.premiumPlan?.short_description}
                </p>
                <ul role="list" className="mt-6 space-y-6">
                  {mentorPlan.premiumPlan?.services.map((service, sindex) => (
                    <li key={sindex} className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 w-6 h-6 text-emerald-500"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="ml-3 ">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                className="bg-emerald-500 text-white  hover:bg-emerald-600 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium"
                href="/auth/login"
              >
                View plan
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentorshipPlan;
