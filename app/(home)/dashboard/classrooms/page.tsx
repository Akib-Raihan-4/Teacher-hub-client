"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import AllClassrooms from "@/modules/homePage/DashboardClassroomPage/AllClassrooms/AllClassrooms";
import ClassroomsSummary from "@/modules/homePage/DashboardClassroomPage/ClassroomsSummary/ClassroomsSummary";
import { CreateClassroomModal } from "@/modules/homePage/DashboardClassroomPage/CreateClassroomForm/CreateClassroomForm";

export default function DashboardClassroomPage() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Welcome Back, {user?.name}! </h1>
      <p className="text-xl font-semibold mb-8">
        Manage your classrooms and track your students&apos; progress.
      </p>
      <ClassroomsSummary />

      <div className="flex justify-between items-center mt-10">
        <h1 className="text-3xl font-bold">Your Classrooms</h1>
        <CreateClassroomModal/>
      </div>

      <AllClassrooms />
    </>
  );
}
