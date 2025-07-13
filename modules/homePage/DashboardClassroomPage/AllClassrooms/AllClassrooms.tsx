"use client"

import { useGetAllClassrooms } from "../hooks/useGetAllClassroom";

export default function AllClassrooms() {
  const { data, isLoading, error } = useGetAllClassrooms();
  if (isLoading) return <p>Loading classrooms...</p>;
  if (error) return <p>Error: {error.message}</p>;
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
