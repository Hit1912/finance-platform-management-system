import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Outlet />
    </div>
  );
};

export default BaseLayout;