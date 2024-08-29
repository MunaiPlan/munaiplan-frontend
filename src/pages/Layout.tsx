import { FC } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { MenuItem } from "../components/SideBarItem";

const Layout: FC = () => {
    return <>
      <Outlet />
    </>
}

export default Layout;