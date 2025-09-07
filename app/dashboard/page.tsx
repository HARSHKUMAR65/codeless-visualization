import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import UserTable from "../components/UserData/UserData";
// import FileUpload from "@/components/FileUpload/FileUploadHome";
const Page = () => {
    return (
      <DashboardLayout>
        {/* <FileUpload /> */}
        <UserTable />
      </DashboardLayout>
    );
}

export default Page