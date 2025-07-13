import AllClassrooms from "@/modules/homePage/DashboardClassroomPage/AllClassrooms/AllClassrooms";
import { CreateClassroomModal } from "@/modules/homePage/DashboardClassroomPage/CreateClassroomForm/CreateClassroomForm";

export default function DashboardClassroomPage() {
  return (
    <>
      <AllClassrooms />
      <CreateClassroomModal />
    </>
  );
}
