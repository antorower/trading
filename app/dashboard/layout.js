import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-grow h-screen">
        <div className="flex flex-col h-full">
          <TopBar />
          <div className="h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
