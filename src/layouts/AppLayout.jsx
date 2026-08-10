import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/common/Sidebar";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-gray-200">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 shrink-0 md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <main className="mx-auto min-h-screen max-w-[1500px] px-4 pb-10 md:px-8">
            <Outlet
              context={{
                onMenu: () => setOpen(true),
              }}
            />
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />

          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <Sidebar />
          </div>
        </>
      )}
    </div>
  );
}