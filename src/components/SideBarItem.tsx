import { useState } from 'react';
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaRegFile } from "react-icons/fa";
import { useAppDispatch } from '../store/hooks';
import { closeFieldForm, openFieldForm, setCompanyId } from '../store/user/fieldSlice';
import { closeCompanyForm } from '../store/user/companySlice';
import { closeSiteForm, openSiteForm, setFieldId } from '../store/user/siteSlice';
import { closeWellForm, openWellForm, setSiteId } from '../store/user/wellSlice';
import { closeWellBoreForm, openWellBoreForm, setWellId } from '../store/user/wellBoreSlice';
import { closeDesignForm, openDesignForm, setWellboreId } from '../store/user/designSlice';
import { closeCaseForm, openCaseForm, setTrajectoryId } from '../store/user/caseSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { closeTrajectoryForm, openTrajectoryForm, setDesignId } from '../store/user/trajectorySlice';
import ContextMenu from './ContextMenu';

interface MenuItemProps {
  item: MenuItem;
  level?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];  // Optional
}

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0
}

const SideBarMenu: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(initialContextMenu)
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;  // Safeguard for undefined children
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (level === 0) {
      dispatch(setCompanyId(item.id));
    } else if (level === 1) {
      dispatch(setFieldId(item.id));
    } else if (level === 2) {
      dispatch(setSiteId(item.id));
    } else if (level === 3) {
      dispatch(setWellId(item.id));
    } else if (level === 4) {
      dispatch(setWellboreId(item.id));
    } else if (level === 5) {
      dispatch(setDesignId(item.id))
    } else if (level === 6) {
      dispatch(setTrajectoryId(item.id))
    }
    console.log(item.id);
    console.log(item.children);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
  
    const { pageX, pageY } = e;
    setContextMenu({ show: true, x: pageX, y: pageY });
  };
  
  const contextMenuClose = () => {
    setContextMenu(initialContextMenu);
  };

  const goTo = () => {
    if (level === 0) {
      navigate(`/${item.id}`);
    } else if (level === 1) {
      navigate(`/fields/${item.id}`);
    } else if (level === 2) {
      navigate(`/sites/${item.id}`);
    } else if (level === 3) {
      navigate(`/wells/${item.id}`);
    } else if (level === 4) {
      navigate(`/wellbores/${item.id}`);
    } else if (level === 5) {
      navigate(`/designs/${item.id}`);
    } else if (level === 6) {
      navigate(`/trajectories/${item.id}`);
    } else if (level === 7) {
      navigate(`/cases/${item.id}`)
    }
  };

  return (
    <>
      {contextMenu.show && <ContextMenu x={contextMenu.x} y={contextMenu.y} level={level} closeContextMenu={contextMenuClose}/>}
      <div className="flex gap-x-1 items-center justify-start mt-2">
        <div className="flex items-center">
          {level === 7 ? (
            <FaRegFile className="mr-1" onClick={handleToggle}/>
          ) : isOpen ? (
            <IoIosArrowDown onClick={handleToggle} className="mr-1" />
          ) : (
            <IoIosArrowForward onClick={handleToggle} className="mr-1" />
          )}
          <label onClick={goTo} onContextMenu={handleContextMenu}>{item.name ? item.name : '   '}</label>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-2">
          {item.children?.map((child) => (
            <div>
              <SideBarMenu key={child.id} item={child} level={level + 1}/>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SideBarMenu;