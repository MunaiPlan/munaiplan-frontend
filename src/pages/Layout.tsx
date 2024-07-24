import { FC } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { MenuItem } from "../components/SideBarItem";

const menuStructure: MenuItem[] = [
    {
      id: 1,
      name: 'Компания 1',
      children: [
        {
          id: 2,
          name: 'Месторождение но...',
          children: [
            {
              id: 3,
              name: 'Куст 1',
              children: [
                {
                  id: 4,
                  name: 'Скважина 1',
                  children: [
                    {
                      id: 5,
                      name: 'Ствол Скважины 1',
                      children: [
                        {
                          id: 5,
                          name: 'Дизайн 1',
                          children: [
                            {
                              id: 5,
                              name: 'Кейс 1',
                              children: [
                                // ... more nested items
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 8,
              name: 'Месторождение 1',
              children: [
                {
                  id: 5,
                  name: 'Месторождение 1',
                  children: [
                    // ... more nested items
                  ],
                },
              ],
            },
          ],
        },
        // ... more children
      ],
    },
    // ... more top-level items
  ];

const Layout: FC = () => {
    return (
    <div className="flex h-screen w-full">
        <SideBar menuItems={menuStructure}/>
        <Outlet />
    </div>)
}

export default Layout;