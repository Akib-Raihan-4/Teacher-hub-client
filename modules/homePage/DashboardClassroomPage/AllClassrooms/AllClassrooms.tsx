"use client";

import Loader from "@/components/shared/loader/Loader";
import { useGetAllClassrooms } from "../hooks/useGetAllClassroom";

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

  if (data?.length === 0) {
    return <p>No classrooms found.</p>;
  }
  return (
    <div>
      {data?.map((c) => (
        <div key={c.id}>
          <h3>{c.name}</h3>
          <p>Subject: {c.subject}</p>
        </div>
      ))}
    </div>
  );
}
