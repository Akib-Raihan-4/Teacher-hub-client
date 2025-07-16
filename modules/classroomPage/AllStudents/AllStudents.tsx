import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "@/components/shared/loader/Loader";
import { useGetStudentsByClassroom } from "../hooks/useGetStudentsByClassroom";
import StudentCard from "../StudentCard/StudentCard";

export default function AllStudents({ classroomId }: { classroomId: string }) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useGetStudentsByClassroom(classroomId, { page, limit });

  const handlePageChange = (newPage: number) => {
    if (!isFetching) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const students = response?.data || [];
  const pagination = response?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: limit,
    hasNextPage: false,
  };

  return (
    <div className="mb-14">
      {students.length === 0 ? (
        <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
          <p className="text-gray-500">No Students are Enrolled</p>
        </div>
      ) : (
        <>
          <div
            className={`${isFetching ? "opacity-50" : ""} transition-opacity`}
          >
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                classroomId={classroomId}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.currentPage > 1 && !isFetching) {
                          handlePageChange(pagination.currentPage - 1);
                        }
                      }}
                      className={
                        pagination.currentPage <= 1 || isFetching
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.currentPage;

                    if (totalPages > 0) {
                      pages.push(
                        <PaginationItem key={1}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isFetching) handlePageChange(1);
                            }}
                            isActive={currentPage === 1}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (currentPage > 3) {
                      pages.push(
                        <PaginationItem key="ellipsis-start">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = startPage; i <= endPage; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isFetching) handlePageChange(i);
                              }}
                              isActive={currentPage === i}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    }

                    if (currentPage < totalPages - 2) {
                      pages.push(
                        <PaginationItem key="ellipsis-end">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (totalPages > 1) {
                      pages.push(
                        <PaginationItem key={totalPages}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isFetching) handlePageChange(totalPages);
                            }}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    return pages;
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          pagination.currentPage < pagination.totalPages &&
                          !isFetching
                        ) {
                          handlePageChange(pagination.currentPage + 1);
                        }
                      }}
                      className={
                        pagination.currentPage >= pagination.totalPages ||
                        isFetching
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
