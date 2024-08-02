import { useState } from 'react';
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaRegFile } from "react-icons/fa";
import { useAppDispatch } from '../store/hooks';
import { closeFieldForm, toggleFieldForm } from '../store/user/fieldSlice';
import { closeCompanyForm } from '../store/user/companySlice';
import { closeSiteForm, toggleSiteForm } from '../store/user/siteSlice';
import { toggleWellForm } from '../store/user/wellSlice';


interface MenuItemProps {
  item: MenuItem;
  level?: number;
}

export interface MenuItem {
  id: number;
  name: string;
  children?: MenuItem[];
}



const SideBarMenu: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const dispatch = useAppDispatch()

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const fieldCreateFormOpenHandler = () => {
    dispatch(toggleFieldForm())
    dispatch(closeCompanyForm())
    dispatch(closeSiteForm())
  }

  const siteCreateFormOpenHandler = () => {
    dispatch(toggleSiteForm())
    dispatch(closeCompanyForm())
    dispatch(closeFieldForm())
  }

  const wellCreateFormOpenHandler = () => {
    dispatch(toggleWellForm())
    dispatch(closeCompanyForm())
    dispatch(closeFieldForm())
    dispatch(closeSiteForm())
  }

  const func = () => {
    let content;
    if (level === 0) {
      fieldCreateFormOpenHandler()
    } else if (level === 1) {
      siteCreateFormOpenHandler()
    } else if (level === 2) { 
      wellCreateFormOpenHandler()
    } else {
      content = <div className='w-screen flex flex-col justify-start items-center'>Тут ваши компании</div>
    }
  }

  return (
    <>
      <div className="flex gap-x-1 items-center justify-start mt-2">
        <div className="flex items-center" onClick={handleToggle}>
          {item.name.split(' ')[0] === "Кейс" ? (<FaRegFile className='mr-1'/>) : (isOpen ? <IoIosArrowDown className='mr-1'/> : <IoIosArrowForward className='mr-1'/>)}   
          {item.name}
        </div>
        {/* {hasChildren && (
          <button onClick={handleToggle}>
            {isOpen ? '-' : '+'}
          </button>
        )} */}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4">
          {item.children?.map((child) => (
            <SideBarMenu key={child.id} item={child} level={level + 1} />
          ))}
          {/* The create button might also be conditional based on level or other factors */}
          <button 
            onClick={func}
            className="text-gray-200 hover:text-gray-400 text-md mt-2">+ Создать</button>
        </div>
      )}
    </>
  );
};


export default SideBarMenu;