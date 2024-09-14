import { FC, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { instance } from '../../api/axios.api';
import { toast } from 'react-toastify';
import { store } from '../../store/store';

interface ITrajcetoryForm {
  type: 'post' | 'put';
  id?: string;
  designId: string;
  prevName: string;
  prevDescription: string;
  prevCustomerTrajectory: string;
  prevProjectTrajectory: string;
  prevProfileTypeTrajectory: string;
  prevFieldTrajectory: string;
  prevYourRefTrajectory: string;
  prevStructureTrajectory: string;
  prevJob_number: string;
  prevWell_head: string;
  prevKelly_bushing_elev: number;
  prevProfile: string;
  prevMdTrajectory: number;
  prevInclTrajectory: number;
  prevAzimTrajectory: number;
  prevSubSea: number;
  prevTVD: number;
  prev_local_n_coord: number;
  prev_local_e_coord: number;
  prev_global_n_coord: number;
  prev_global_e_coord: number;
  prev_dogleg: number;
  prev_vertical_section: number;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void;
}

const CreateTrajectory: FC<ITrajcetoryForm> = ({
  type = 'post',
  id,
  prevName,
  prevDescription,
  prevCustomerTrajectory,
  prevProjectTrajectory,
  prevProfileTypeTrajectory,
  prevFieldTrajectory,
  prevYourRefTrajectory,
  prevStructureTrajectory,
  prevJob_number,
  prevWell_head,
  prevKelly_bushing_elev,
  prevProfile,
  prevMdTrajectory,
  prevInclTrajectory,
  prevAzimTrajectory,
  prevSubSea,
  prevTVD,
  prev_local_n_coord,
  prev_local_e_coord,
  prev_global_n_coord,
  prev_global_e_coord,
  prev_dogleg,
  prev_vertical_section,
  setIsEdit,
  onSuccess,
}) => {
  const [nameTrajectory, setNameTrajectory] = useState(prevName);
  const [descriptionTrajectory, setDescriptionTrajectory] = useState(prevDescription);
  const [customerTrajectoryHeader, setCustomerTrajectoryHeader] = useState(prevCustomerTrajectory);
  const [projectTrajectoryHeader, setProjectTrajectoryHeader] = useState(prevProjectTrajectory);
  const [profileTypeTrajectoryHeader, setProfileTypeTrajectoryHeader] = useState(prevProfileTypeTrajectory);
  const [fieldTrajectoryHeader, setFieldTrajectoryHeader] = useState(prevFieldTrajectory);
  const [your_refTrajectoryHeader, setYour_refTrajectoryHeader] = useState(prevYourRefTrajectory);
  const [structureTrajectoryHeader, setStructureTrajectoryHeader] = useState(prevStructureTrajectory);
  const [job_numberTrajectoryHeader, setJob_numberTrajectoryHeader] = useState(prevJob_number);
  const [wellHeadTrajectoryHeader, setWellHeadTrajectoryHeader] = useState(prevWell_head);
  const [kelly_bushing_elevTrajectoryHeader, setKelly_bushing_elevTrajectoryHeader] = useState(prevKelly_bushing_elev);
  const [profileTrajectoryHeader, setProfileTrajectoryHeader] = useState(prevProfile);
  const [mdTrajectoryUnit, setMdTrajectoryUnit] = useState(prevMdTrajectory);
  const [inclTrajectoryUnit, setInclTrajectoryUnit] = useState(prevInclTrajectory);
  const [azimTrajectoryUnit, setAzimTrajectoryUnit] = useState(prevAzimTrajectory);
  const [subSeaTrajectoryUnit, setSubSeaTrajectoryUnit] = useState(prevSubSea);
  const [tvdTrajectoryUnit, setTvdTrajectoryUnit] = useState(prevTVD);
  const [local_n_coord_trajectory_unit, set_local_n_coord_trajectory_unit] = useState(prev_local_n_coord);
  const [local_e_coord_trajectory_unit, set_local_e_coord_trajectory_unit] = useState(prev_local_e_coord);
  const [global_n_coord_trajectory_unit, set_global_n_coord_trajectory_unit] = useState(prev_global_n_coord);
  const [global_e_coord_trajectory_unit, set_global_e_coord_trajectory_unit] = useState(prev_global_e_coord);
  const [dogleg_trajectory_unit, setDogleg_trajectory_unit] = useState(prev_dogleg);
  const [verticalSectionTrajectoryUnit, setVerticalSectionTrajectoryUnit] = useState(prev_vertical_section);

  const navigate = useNavigate();

  const getDesignIdFromStore = (): string | null => {
    const state = store.getState();
    return state.trajectory.designId;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTrajectory = {
      name: nameTrajectory,
      description: descriptionTrajectory,
      trajectory_headers: {
        customer: customerTrajectoryHeader,
        project: projectTrajectoryHeader,
        profile_type: profileTypeTrajectoryHeader,
        field: fieldTrajectoryHeader,
        your_ref: your_refTrajectoryHeader,
        structure: structureTrajectoryHeader,
        job_number: job_numberTrajectoryHeader,
        well_head: wellHeadTrajectoryHeader,
        kelly_bushing_elev: kelly_bushing_elevTrajectoryHeader,
        profile: profileTrajectoryHeader,
      },
      trajectory_units: {
        md: mdTrajectoryUnit,
        incl: inclTrajectoryUnit,
        azim: azimTrajectoryUnit,
        sub_sea: subSeaTrajectoryUnit,
        tvd: tvdTrajectoryUnit,
        local_n_coord: local_n_coord_trajectory_unit,
        local_e_coord: local_e_coord_trajectory_unit,
        global_n_coord: global_n_coord_trajectory_unit,
        global_e_coord: global_e_coord_trajectory_unit,
        dogleg: dogleg_trajectory_unit,
        vertical_section: verticalSectionTrajectoryUnit,
      },
    };

    try {
      const designId = getDesignIdFromStore();
      if (type === 'post') {
        await instance.post(`/api/v1/trajectories/?designId=${designId}`, newTrajectory);
        toast.success('Trajectory was added');
        navigate('/');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/trajectories/${id}`, newTrajectory);
        toast.success('Траектория была успешно обновлена');
        navigate('/');
      }
    } catch (error) {
      toast.error('Ошибка при добавлении/обновлении новой траектории');
      console.error(error);
    }
  };

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto overflow-y-auto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">
          {type === 'post' ? 'Создать новую траекторию' : 'Обновить эту траекторию'}
        </h2>
        <Form className="grid grid-cols-2 gap-x-2" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-wrapper grid-cols-12">
            <label htmlFor="nameTrajectory">Имя траектории</label>
            <input
              id="nameTrajectory"
              type="text"
              value={nameTrajectory}
              onChange={(e) => setNameTrajectory(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="input-wrapper grid-cols-2">
            <label htmlFor="descriptionTrajectory">Описание</label>
            <input
              id="descriptionTrajectory"
              type="text"
              value={descriptionTrajectory}
              onChange={(e) => setDescriptionTrajectory(e.target.value)}
              required
            />
          </div>

          {/* Trajectory Headers Group */}
          <div className="grid-cols-1">
            <h3 className="font-medium">Заголовок траектории</h3>

            <div className="input-wrapper">
              <label htmlFor="customerTrajectory">Клиент</label>
              <input
                id="customerTrajectory"
                type="text"
                value={customerTrajectoryHeader}
                onChange={(e) => setCustomerTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="projectTrajectory">Проект</label>
              <input
                id="projectTrajectory"
                type="text"
                value={projectTrajectoryHeader}
                onChange={(e) => setProjectTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="profileTypeTrajectory">Тип профиля</label>
              <input
                id="profileTypeTrajectory"
                type="text"
                value={profileTypeTrajectoryHeader}
                onChange={(e) => setProfileTypeTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="fieldTrajectory">Поле</label>
              <input
                id="fieldTrajectory"
                type="text"
                value={fieldTrajectoryHeader}
                onChange={(e) => setFieldTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="yourRefTrajectory">Ваше ссылочное имя</label>
              <input
                id="yourRefTrajectory"
                type="text"
                value={your_refTrajectoryHeader}
                onChange={(e) => setYour_refTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="structureTrajectory">Структура</label>
              <input
                id="structureTrajectory"
                type="text"
                value={structureTrajectoryHeader}
                onChange={(e) => setStructureTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="jobNumberTrajectory">Номер работы</label>
              <input
                id="jobNumberTrajectory"
                type="text"
                value={job_numberTrajectoryHeader}
                onChange={(e) => setJob_numberTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="wellHeadTrajectory">Устье</label>
              <input
                id="wellHeadTrajectory"
                type="text"
                value={wellHeadTrajectoryHeader}
                onChange={(e) => setWellHeadTrajectoryHeader(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="kellyBushingElevation">Высота Kelly Bushing</label>
              <input
                id="kellyBushingElevation"
                type="number"
                value={kelly_bushing_elevTrajectoryHeader}
                onChange={(e) => setKelly_bushing_elevTrajectoryHeader(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="profile">Профиль</label>
              <input
                id="profile"
                type="text"
                value={profileTrajectoryHeader}
                onChange={(e) => setProfileTrajectoryHeader(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Trajectory Units Group */}
          <div className="grid-cols-1">
            <h3 className="font-medium">Единица траектории</h3>

            <div className="input-wrapper">
              <label htmlFor="mdTrajectory">MD</label>
              <input
                id="mdTrajectory"
                type="number"
                value={mdTrajectoryUnit}
                onChange={(e) => setMdTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="inclTrajectory">Угол</label>
              <input
                id="inclTrajectory"
                type="number"
                value={inclTrajectoryUnit}
                onChange={(e) => setInclTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="azimTrajectory">Азимут</label>
              <input
                id="azimTrajectory"
                type="number"
                value={azimTrajectoryUnit}
                onChange={(e) => setAzimTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="subSeaTrajectory">Под уровнем моря</label>
              <input
                id="subSeaTrajectory"
                type="number"
                value={subSeaTrajectoryUnit}
                onChange={(e) => setSubSeaTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="tvdTrajectory">TVD</label>
              <input
                id="tvdTrajectory"
                type="number"
                value={tvdTrajectoryUnit}
                onChange={(e) => setTvdTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="localNCoord">Местные координаты (север)</label>
              <input
                id="localNCoord"
                type="number"
                value={local_n_coord_trajectory_unit}
                onChange={(e) => set_local_n_coord_trajectory_unit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="localECoord">Местные координаты (восток)</label>
              <input
                id="localECoord"
                type="number"
                value={local_e_coord_trajectory_unit}
                onChange={(e) => set_local_e_coord_trajectory_unit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="globalNCoord">Глобальные координаты (север)</label>
              <input
                id="globalNCoord"
                type="number"
                value={global_n_coord_trajectory_unit}
                onChange={(e) => set_global_n_coord_trajectory_unit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="globalECoord">Глобальные координаты (восток)</label>
              <input
                id="globalECoord"
                type="number"
                value={global_e_coord_trajectory_unit}
                onChange={(e) => set_global_e_coord_trajectory_unit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="doglegTrajectory">Dogleg</label>
              <input
                id="doglegTrajectory"
                type="number"
                value={dogleg_trajectory_unit}
                onChange={(e) => setDogleg_trajectory_unit(parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="verticalSection">Вертикальная секция</label>
              <input
                id="verticalSection"
                type="number"
                value={verticalSectionTrajectoryUnit}
                onChange={(e) => setVerticalSectionTrajectoryUnit(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center justify-between mt-3 mx-6">
            <button
              type="submit"
              className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
            >
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            {type === 'put' && (
              <button
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
                onClick={() => {
                  if (setIsEdit) {
                    setIsEdit(false);
                  }
                }}
              >
                Закрыть
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateTrajectory;