import { FC, useRef } from 'react';
import { useClickAway } from "@uidotdev/usehooks";
import { useAppDispatch } from '../store/hooks';
import { closeCompanyForm } from '../store/user/companySlice';
import { closeFieldForm, openFieldForm } from '../store/user/fieldSlice';
import { closeSiteForm, openSiteForm } from '../store/user/siteSlice';
import { closeWellForm, openWellForm } from '../store/user/wellSlice';
import { closeWellBoreForm, openWellBoreForm } from '../store/user/wellBoreSlice';
import { closeDesignForm, openDesignForm } from '../store/user/designSlice';
import { closeTrajectoryForm, openTrajectoryForm } from '../store/user/trajectorySlice';
import { closeCaseForm, openCaseForm } from '../store/user/caseSlice';
import { useNavigate } from 'react-router-dom';

interface ContextMenuProps {
  x: number;
  y: number;
  level: number;
  closeContextMenu: () => void;
}

const ContextMenu: FC<ContextMenuProps> = ({ x, y, level, closeContextMenu }) => {
    const entities = ["месторождение", "куст", "скважину", "ствол скважины", "дизайн", "траекторию", "кейс",];
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fieldCreateFormOpenHandler = () => {
        dispatch(closeCompanyForm());
        dispatch(openFieldForm());
        dispatch(closeSiteForm());
        dispatch(closeWellForm());
        dispatch(closeWellBoreForm());
        dispatch(closeDesignForm());
        dispatch(closeTrajectoryForm());
        dispatch(closeCaseForm());
      };
    
      const siteCreateFormOpenHandler = () => {
        dispatch(openSiteForm());
        dispatch(closeCompanyForm());
        dispatch(closeFieldForm());
        dispatch(closeWellForm());
        dispatch(closeWellBoreForm());
        dispatch(closeDesignForm());
        dispatch(closeTrajectoryForm());
        dispatch(closeCaseForm());
      };
    
      const wellCreateFormOpenHandler = () => {
        dispatch(openWellForm());
        dispatch(closeCompanyForm());
        dispatch(closeFieldForm());
        dispatch(closeSiteForm());
        dispatch(closeWellBoreForm());
        dispatch(closeDesignForm());
        dispatch(closeTrajectoryForm());
        dispatch(closeCaseForm());
      };
    
      const wellBoreCreateFormOpenHandler = () => {
        dispatch(openWellBoreForm());
        dispatch(closeWellForm());
        dispatch(closeCompanyForm());
        dispatch(closeFieldForm());
        dispatch(closeSiteForm());
        dispatch(closeDesignForm());
        dispatch(closeTrajectoryForm());
        dispatch(closeCaseForm());
      };
    
      const designCreateFormOpenHandler = () => {
        dispatch(closeWellBoreForm());
        dispatch(closeWellForm());
        dispatch(closeCompanyForm());
        dispatch(closeFieldForm());
        dispatch(closeSiteForm());
        dispatch(openDesignForm());
        dispatch(closeTrajectoryForm());
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
        dispatch(closeCaseForm());
      };
    
      const caseCreateFormOpenHandler = () => {
        dispatch(closeTrajectoryForm());
        dispatch(closeWellBoreForm());
        dispatch(closeWellForm());
        dispatch(closeCompanyForm());
        dispatch(closeFieldForm());
        dispatch(closeSiteForm());
        dispatch(closeDesignForm());
        dispatch(openCaseForm());
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
        } else if (level === 6) {
          caseCreateFormOpenHandler();
        }
        navigate('/');
      };


  const contextMenuRef = useClickAway<HTMLDivElement>(() => {
    closeContextMenu();
  }) as React.MutableRefObject<HTMLDivElement | null>; // Type cast to satisfy TypeScript

  return (
    <div
      ref={contextMenuRef}
      onClick={func}
      className='absolute z-100 bg-white text-black shadow-md p-2 rounded'
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      + Cоздать
    </div>
  );
};

export default ContextMenu;