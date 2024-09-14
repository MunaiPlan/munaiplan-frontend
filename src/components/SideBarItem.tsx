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
import { closeCaseForm, openCaseForm } from '../store/user/caseSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { openTrajectoryForm, setDesignId } from '../store/user/trajectorySlice';

interface MenuItemProps {
  item: MenuItem;
  level?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];  // Optional
}

const SideBarMenu: React.FC<MenuItemProps> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;  // Safeguard for undefined children
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const entities = ["месторождение", "куст", "скважину", "ствол скважины", "дизайн", "траекторию", "кейс",];

  const fieldCreateFormOpenHandler = () => {
    dispatch(closeCompanyForm());
    dispatch(openFieldForm());
    dispatch(closeSiteForm());
    dispatch(closeWellForm());
    dispatch(closeWellBoreForm());
    dispatch(closeDesignForm());
    dispatch(closeCaseForm());
  };

  const siteCreateFormOpenHandler = () => {
    dispatch(openSiteForm());
    dispatch(closeCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeWellForm());
    dispatch(closeWellBoreForm());
    dispatch(closeDesignForm());
    dispatch(closeCaseForm());
  };

  const wellCreateFormOpenHandler = () => {
    dispatch(openWellForm());
    dispatch(closeCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeSiteForm());
    dispatch(closeWellBoreForm());
    dispatch(closeDesignForm());
    dispatch(closeCaseForm());
  };

  const wellBoreCreateFormOpenHandler = () => {
    dispatch(openWellBoreForm());
    dispatch(closeWellForm());
    dispatch(closeCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeSiteForm());
    dispatch(closeDesignForm());
    dispatch(closeCaseForm());
  };

  const designCreateFormOpenHandler = () => {
    dispatch(closeWellBoreForm());
    dispatch(closeWellForm());
    dispatch(closeCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeSiteForm());
    dispatch(openDesignForm());
    dispatch(closeCaseForm());
  };

  const trajectoryCreateFormOpenHandler = () => {
    dispatch(openTrajectoryForm());
    dispatch(closeWellBoreForm());
    dispatch(closeWellForm());
    dispatch(closeCompanyForm());
    dispatch(closeFieldForm());
    dispatch(closeSiteForm());
    dispatch(closeDesignForm());
  };

  const func = () => {
    if (level === 0) {
      fieldCreateFormOpenHandler();
    } else if (level === 1) {
      siteCreateFormOpenHandler();
    } else if (level === 2) {
      wellCreateFormOpenHandler();
    } else if (level === 3) {
      wellBoreCreateFormOpenHandler();
    } else if (level === 4) {
      designCreateFormOpenHandler();
    } else if (level === 5) {
      trajectoryCreateFormOpenHandler();
    }
    navigate('/');
  };

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
    }
    console.log(item.id);
    console.log(item.children);
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
    }
  };

  return (
    <>
      <div className="flex gap-x-1 items-center justify-start mt-2">
        <div className="flex items-center">
          {item.name && item.name.split(' ')[0] === 'Кейс' ? (
            <FaRegFile className="mr-1" />
          ) : isOpen ? (
            <IoIosArrowDown onClick={handleToggle} className="mr-1" />
          ) : (
            <IoIosArrowForward onClick={handleToggle} className="mr-1" />
          )}
          <label onClick={goTo}>{item.name ? item.name : '   '}</label>
        </div>
      </div>
      {isOpen && hasChildren ? (
        <div className="ml-2">
          {item.children?.map((child) => (
            <SideBarMenu key={child.id} item={child} level={level + 1} />
          ))}
          <button onClick={func} className="text-gray-200 hover:text-gray-400 text-md mt-2 truncate">
            {`+ Создать ${entities[level]}`}
          </button>
        </div>
      ) : (
        isOpen && (
          <button onClick={func} className="ml-2 text-gray-200 hover:text-gray-400 text-md mt-2 truncate">
            {`+ Создать ${entities[level]}`}
          </button>
        )
      )}
    </>
  );
};

export default SideBarMenu;