import { FC, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { toast } from 'react-toastify';
import { Form, useNavigate } from 'react-router-dom';
import { IDesign } from '../../types/types';
import instance from '../../api/axios.api';
import { store } from '../../store/store';

interface IWellBoreForm {
    type: 'post' | 'put';
    id?: string;
    prevName: string;
    prevBottomLocation: string;
    prevDepth: number;
    prevAverageHookLead: number;
    prevRiserPressure: number;
    prevAverageInLetFlow: number;
    prevAverageColumnRotationFrequency: number;
    prevMaximumColumnRotationFrequency: number;
    prevAverageWeightOnBit: number;
    prevMaximumWeightOnBit: number;
    prevAverageTorque: number;
    prevMaximumTorque: number;
    prevDownStaticFriction: number;
    prevDepthIntervalWellBore: number;
    designs?: IDesign[];
    setIsEdit?: (edit: boolean) => void;
    onSuccess?: () => void;
    wellId: string | null;
  }


const CreateWellBore: FC<IWellBoreForm> = ({
    type="post",
    id,
    prevName = '',
    prevBottomLocation = '',
    prevDepth = 0,
    prevAverageHookLead = 0,
    prevRiserPressure = 0,
    prevAverageInLetFlow = 0,
    prevAverageColumnRotationFrequency = 0,
    prevMaximumColumnRotationFrequency = 0,
    prevAverageWeightOnBit = 0,
    prevMaximumWeightOnBit = 0,
    prevAverageTorque = 0,
    prevMaximumTorque = 0,
    prevDownStaticFriction = 0,
    prevDepthIntervalWellBore = 0,
    setIsEdit,
    wellId

}) => {
  const navigate = useNavigate();

  const [nameWelBore, setNameWellBore] = useState<string>(prevName || '');
  const [bottomLocationWellBore, setBottomLocationWellBore] = useState<string>(prevBottomLocation);
  const [depthWellBore, setDepthWellBore] = useState<number>(prevDepth);
  const [averageHookLeadWellBore, setAverageHookLeadWellBore] = useState<number>(prevAverageHookLead);
  const [riserPressureWellBore, setRiserPressureWellBore] = useState<number>(prevRiserPressure);
  const [averageInLetFlowWellBore, setAverageInLetFlow] = useState<number>(prevAverageInLetFlow);
  const [averageColumnRotationFrequencyWellBore, setAverageColumnRotationFrequencyWellBore] = useState<number>(prevAverageColumnRotationFrequency);
  const [maximumColumnRotationFrequencyWellBore, setMaximumColumnRotationFrequencyWellBore] = useState<number>(prevMaximumColumnRotationFrequency);
  const [averageWeightOnBitWellBore, setAverageWeightOnBitWellBore] = useState<number>(prevAverageWeightOnBit);
  const [maximumWeightOnBitWellBore, setMaximumWeightOnBitWellBore] = useState<number>(prevMaximumWeightOnBit);
  const [averageTorqueWellBore, setAverageTorqueWellBore] = useState<number>(prevAverageTorque);
  const [maximumTorqueWellBore, setMaximumTorqueWellBore] = useState<number>(prevMaximumTorque);
  const [downStaticFrictionWellBore, setDownStaticFrictionWellBore] = useState<number>(prevDownStaticFriction);
  const [depthIntervalWellBore, setDepthIntervalWellBore] = useState<number>(prevDepthIntervalWellBore);

  const getWellIdFromStore = (): string | null => {
    const state = store.getState();
    return state.wellBore.wellId;
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newWellBore = {
      name: nameWelBore,
      bottom_hole_location: bottomLocationWellBore,
      wellbore_depth: depthWellBore,
      average_hook_load: averageHookLeadWellBore,
      riser_pressure: riserPressureWellBore,
      average_inlet_flow: averageInLetFlowWellBore,
      average_column_rotation_frequency: averageColumnRotationFrequencyWellBore,
      maximum_column_rotation_frequency: maximumColumnRotationFrequencyWellBore,
      average_weight_on_bit: averageWeightOnBitWellBore,
      maximum_weight_on_bit: maximumWeightOnBitWellBore,
      average_torque: averageTorqueWellBore,
      maximum_torque: maximumTorqueWellBore,
      down_static_friction: downStaticFrictionWellBore,
      depth_interval: depthIntervalWellBore
    };

    try {
      if (type === 'post') {
        wellId = getWellIdFromStore();
        await instance.post(`/api/v1/wellbores/?wellId=${wellId}`, newWellBore);
        toast.success('Новая ствол скважины был добавлен');
        navigate('/');
      } else if (type === 'put' && id) {
        await instance.put(`/api/v1/wellbores/${id}`, newWellBore);
        toast.success('Ствол скважины был обновлен');
        navigate('/');
      }
    } catch (error) {
      toast.error('Ошибка при добавлении/обновлении ствола скважины');
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">{type=="post" ? "Создать ствол скважины" : "Обновить ствол скважины"}</h2>
        <Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="col-span-1">
            {/* Name of WellBore */}
            <div className="input-wrapper">
              <label htmlFor="nameWellBore">Имя ствола скважины</label>
              <input
                id="nameWellBore"
                type="text"
                name="nameWellBore"
                placeholder={type === 'put' ? prevName : "Введите имя ствола скважины"}
                value={nameWelBore}
                onChange={(e) => setNameWellBore(e.target.value)}
                required
              />
            </div>

            {/* Bottom Location of WellBore */}
            <div className="input-wrapper">
              <label htmlFor="bottomLocationWellBore">
                Местоположение дна ствола скважины
              </label>
              <input
                id="bottomLocationWellBore"
                type="text"
                name="bottomLocationWellBore"
                placeholder={type === 'put' ? prevBottomLocation : "Введите местоположение дна ствола скважины"}
                value={bottomLocationWellBore}
                onChange={(e) => setBottomLocationWellBore(e.target.value)}
                required
              />
            </div>
            {/* WellBore Depth */}
            <div className="input-wrapper">
              <label htmlFor="depthWellBore">Глубина ствола скважины</label>
              <input id="depthWellBore" type="number" name="depthWellBore" value={depthWellBore === 0 ? '' : depthWellBore} placeholder="Введите глубину ствола скважины" onChange={(e) => setDepthWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))} required/>
            </div>

            {/* Average Hook Lead */}
            <div className="input-wrapper">
              <label htmlFor="averageHookLeadWellBore">Среднее натяжение крюка</label>
              <input
                id="averageHookLeadWellBore"
                type="number"
                name="averageHookLeadWellBore"
                value={averageHookLeadWellBore === 0 ? '' : averageHookLeadWellBore}
                placeholder="Введите среднее натяжение крюка"
                onChange={(e) => setAverageHookLeadWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Riser Pressure */}
            <div className="input-wrapper">
              <label htmlFor="riserPressureWellBore">Давление в колонне</label>
              <input
                id="riserPressureWellBore"
                type="number"
                name="riserPressureWellBore"
                value={riserPressureWellBore === 0 ? '' : riserPressureWellBore}
                placeholder="Введите давление в колонне"
                onChange={(e) => setRiserPressureWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Average Inlet Flow */}
            <div className="input-wrapper">
              <label htmlFor="averageInLetFlowWellBore">Средний входной поток</label>
              <input
                id="averageInLetFlowWellBore"
                type="number"
                name="averageInLetFlowWellBore"
                value={averageInLetFlowWellBore === 0 ? '' : averageInLetFlowWellBore}
                placeholder="Введите средний входной поток"
                onChange={(e) => setAverageInLetFlow(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>
            {/* Average Column Rotation Frequency */}
            <div className="input-wrapper">
              <label htmlFor="averageColumnRotationFrequencyWellBore">Средняя частота вращения колонны</label>
              <input
                id="averageColumnRotationFrequencyWellBore"
                type="number"
                name="averageColumnRotationFrequencyWellBore"
                value={averageColumnRotationFrequencyWellBore === 0 ? '' : averageColumnRotationFrequencyWellBore}
                placeholder="Введите среднюю частоту вращения колонны"
                onChange={(e) => setAverageColumnRotationFrequencyWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            </div>
            {/* Right Column */}
            <div className="col-span-1">

            {/* Maximum Column Rotation Frequency */}
            <div className="input-wrapper">
              <label htmlFor="maximumColumnRotationFrequencyWellBore">Максимальная частота вращения колонны</label>
              <input
                id="maximumColumnRotationFrequencyWellBore"
                type="number"
                name="maximumColumnRotationFrequencyWellBore"
                value={maximumColumnRotationFrequencyWellBore === 0 ? '' : maximumColumnRotationFrequencyWellBore}
                placeholder="Введите максимальную частоту вращения колонны"
                onChange={(e) => setMaximumColumnRotationFrequencyWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Average Weight On Bit */}
            <div className="input-wrapper">
              <label htmlFor="averageWeightOnBitWellBore">Средняя нагрузка на долото</label>
              <input
                id="averageWeightOnBitWellBore"
                type="number"
                name="averageWeightOnBitWellBore"
                value={averageWeightOnBitWellBore === 0 ? '' : averageWeightOnBitWellBore}
                placeholder="Введите среднюю нагрузку на долото"
                onChange={(e) => setAverageWeightOnBitWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Maximum Weight On Bit */}
            <div className="input-wrapper">
              <label htmlFor="maximumWeightOnBitWellBore">Максимальная нагрузка на долото</label>
              <input
                id="maximumWeightOnBitWellBore"
                type="number"
                name="maximumWeightOnBitWellBore"
                value={maximumWeightOnBitWellBore === 0 ? '' : maximumWeightOnBitWellBore}
                placeholder="Введите максимальную нагрузку на долото"
                onChange={(e) => setMaximumWeightOnBitWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Average Torque */}
            <div className="input-wrapper">
              <label htmlFor="averageTorqueWellBore">Средний крутящий момент</label>
              <input
                id="averageTorqueWellBore"
                type="number"
                name="averageTorqueWellBore"
                value={averageTorqueWellBore === 0 ? '' : averageTorqueWellBore}
                placeholder="Введите средний крутящий момент"
                onChange={(e) => setAverageTorqueWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Maximum Torque */}
            <div className="input-wrapper">
              <label htmlFor="maximumTorqueWellBore">Максимальный крутящий момент</label>
              <input
                id="maximumTorqueWellBore"
                type="number"
                name="maximumTorqueWellBore"
                value={maximumTorqueWellBore === 0 ? '' : maximumTorqueWellBore}
                placeholder="Введите максимальный крутящий момент"
                onChange={(e) => setMaximumTorqueWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Down Static Friction */}
            <div className="input-wrapper">
              <label htmlFor="downStaticFrictionWellBore">Нижнее статическое трение</label>
              <input
                id="downStaticFrictionWellBore"
                type="number"
                name="downStaticFrictionWellBore"
                value={downStaticFrictionWellBore === 0 ? '' : downStaticFrictionWellBore}
                placeholder="Введите нижнее статическое трение"
                onChange={(e) => setDownStaticFrictionWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>

            {/* Depth Interval */}
            <div className="input-wrapper">
              <label htmlFor="depthIntervalWellBore">Интервал глубины</label>
              <input
                id="depthIntervalWellBore"
                type="number"
                name="depthIntervalWellBore"
                value={depthIntervalWellBore === 0 ? '' : depthIntervalWellBore}
                placeholder="Введите интервал глубины"
                onChange={(e) => setDepthIntervalWellBore(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="col-span-2 flex flex-col items-center justify-center mt-3 mx-6">
            <button type="submit" className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base">
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
            { type === 'put' && (<button type='button' className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base" onClick={() => {
              if(setIsEdit) {setIsEdit(false);
            }
            }}>Закрыть</button>)}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateWellBore;