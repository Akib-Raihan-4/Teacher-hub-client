import Loader from "@/components/shared/loader/Loader";
import { useGetStudentsByClassroom } from "../hooks/useGetStudentsByClassroom";
import StudentCard from "../StudentCard/StudentCard";

export default function AllStudents({ classroomId }: { classroomId: string }) {
  const {
    data: students,
    isLoading,
    error,
  } = useGetStudentsByClassroom(classroomId);

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

  if (!students || students.length === 0) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <p className="text-gray-500">No Students are Enrolled</p>
      </div>
    );
  }

  return (
    <div className="mb-14">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          classroomId={classroomId}
        />
      ))}
    </div>
  );
}
