"use client";

import Loader from "@/components/shared/loader/Loader";
import { useGetAllClassrooms } from "../hooks/useGetAllClassroom";
import ClassroomCard from "../ClassroomCard/ClassroomCard";

export default function AllClassrooms() {
  const { data, isLoading, error } = useGetAllClassrooms();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <Loader />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (data?.length === 0) return <p>No classrooms found.</p>;

  return (
    <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-24">
      {data!.map((classroom) => (
        <ClassroomCard key={classroom.id} classroom={classroom} />
      ))}
    </div>
  );
}
