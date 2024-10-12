import {FC, useState} from 'react'
import { toast } from 'react-toastify'
import { store } from '../../../store/store'
import instance from '../../../api/axios.api'
import { Form, useNavigate } from 'react-router-dom'
import { z } from 'zod'


interface IHoleForm {
  type: "put" | "post";
  id?: string;
  prevMdTop: number;
  prevMdBase: number;
  prevLength: number;
  prevShoeMd: number;
  prevOD: number;
  prevVD: number;
  prevCaisinInternalDiameter: number;
  prevDriftInternalDiameter: number;
  prevEffectiveHoleDiameter: number;
  prevWeight: number;
  prevGrade: string;
  prevMinYieldStrength: number;
  prevBurstRating: number;
  prevCollapseRating: number;
  prevFrictionFactorCaising: number;
  prevLinearCapacityCaising: number;
  prevDescriptionCaising: number;
  prevManufacturerCaising: number;
  prevModelCaising: number;
  prevOpenHoleMDTop: number;
  prevOpenHoleMDBase: number; 
  prevOpenHoleLength: number;
  prevOpenHoleInternalDiameter: number;
  prevEffectiveDiameter: number;
  prevFrictionFactorOpenHole: number;
  prevLinearCapacityOpenHole: number;
  prevVolumeExcess: number;
  prevDescriptionOpenHole: string;
  prevTrippingInCasing: number;
  prevTrippingOutCasing: number;
  prevRotatingOnBottomCasing: number;
  prevSlideDrillingCasing: number;
  prevBackReamingCasing: number;
  prevRotatingOffBottomCasing: number;
  prevTrippingInOpenHole: number;
  prevTrippingOutOpenHole: number;
  prevRotatingOnBottomOpenHole: number;
  prevSlideDrillingOpenHole: number;
  prevBackReamingOpenHole: number;
  prevRotatingOffBottomOpenHole: number;
  caseId: string;
  setIsEdit?: (edit: boolean) => void;
  onSuccess?: () => void
}


const CreateHole: FC<IHoleForm> = ({type, id, prevRotatingOffBottomCasing, prevBackReamingCasing, prevBackReamingOpenHole, prevBurstRating, prevCaisinInternalDiameter, prevCollapseRating, prevDescriptionCaising, prevDescriptionOpenHole, prevDriftInternalDiameter, prevEffectiveDiameter, prevEffectiveHoleDiameter, prevFrictionFactorCaising, prevFrictionFactorOpenHole, prevGrade, prevLength, prevLinearCapacityCaising, prevLinearCapacityOpenHole, prevManufacturerCaising, prevMdBase, prevMdTop, prevMinYieldStrength, prevModelCaising, prevOD, prevOpenHoleInternalDiameter, prevOpenHoleLength, prevOpenHoleMDBase, prevOpenHoleMDTop, prevRotatingOffBottomOpenHole, prevRotatingOnBottomCasing, prevRotatingOnBottomOpenHole, prevSlideDrillingCasing, prevSlideDrillingOpenHole, prevTrippingInCasing, prevTrippingInOpenHole, prevTrippingOutCasing, prevTrippingOutOpenHole, prevVD, prevVolumeExcess, prevWeight, prevShoeMd, setIsEdit, onSuccess, caseId}) => {
  const navigate = useNavigate()


  const [mdTopHole, setMdTopHole] = useState(prevMdTop);
  const [mdBaseHole, setMdBaseHole] = useState(prevMdBase);
  const [lengthHole, setLengthHole] = useState(prevLength);
  const [shoeMdHole, setShoeMDHole] = useState(prevShoeMd);
  const [odHole, setODHole] = useState(prevOD);
  const [vdHole, setVDHole] = useState(prevVD);
  const [caisinInternalDiameterHole, setCaisinInternalDiameterHole] = useState(prevCaisinInternalDiameter);
  const [driftInternalDiameterHole, setDriftInternalDiameterHole] = useState(prevDriftInternalDiameter);
  const [effectiveHoleDiameterHole, setEffectiveHoleDiameterHole] = useState(prevEffectiveHoleDiameter);
  const [weightHole, setWeightHole] = useState(prevWeight);
  const [gradeHole, setGradeHole] = useState(prevGrade);
  const [minYieldStrengthHole, setMinYieldStrengthHole] = useState(prevMinYieldStrength);
  const [burstRatingHole, setBurstRatingHole] = useState(prevBurstRating);
  const [collapseRatingHole, setCollapseRatingHole] = useState(prevCollapseRating);
  const [frictionFactorCaisingHole, setFrictionFactorCaisingHole] = useState(prevFrictionFactorCaising);
  const [linearCapacityCaisingHole, setLinearCapacityCaisingHole] = useState(prevLinearCapacityCaising);
  const [descriptionCaisingHole, setDescriptionCaisingHole] = useState(prevDescriptionCaising);
  const [manufacturerCaisingHole, setManufacturerCaisingHole] = useState(prevManufacturerCaising);
  const [modelCaisingHole, setModelCaisingHole] = useState(prevModelCaising);
  const [openHoleMDTopHole, setOpenHoleMDTopHole] = useState(prevOpenHoleMDTop);
  const [openHoleMDBaseHole, setOpenHoleMDBaseHole] = useState(prevOpenHoleMDBase);
  const [openHoleLengthHole, setOpenHoleLengthHole] = useState(prevOpenHoleLength);
  const [openHoleInternalDiameterHole, setOpenHoleInternalDiameterHole] = useState(prevOpenHoleInternalDiameter);
  const [effectiveDiameterHole, setEffectiveDiameterHole] = useState(prevEffectiveDiameter);
  const [frictionFactorOpenHoleHole, setFrictionFactorOpenHoleHole] = useState(prevFrictionFactorOpenHole);
  const [linearCapacityOpenHoleHole, setLinearCapacityOpenHoleHole] = useState(prevLinearCapacityOpenHole);
  const [volumeExcessHole, setVolumeExcessHole] = useState(prevVolumeExcess);
  const [descriptionOpenHoleHole, setDescriptionOpenHoleHole] = useState(prevDescriptionOpenHole);
  const [trippingInCasingHole, setTrippingInCasingHole] = useState(prevTrippingInCasing);
  const [trippingOutCasingHole, setTrippingOutCasingHole] = useState(prevTrippingOutCasing);
  const [rotatingOnBottomCasingHole, setRotatingOnBottomCasingHole] = useState(prevRotatingOnBottomCasing);
  const [slideDrillingCasingHole, setSlideDrillingCasingHole] = useState(prevSlideDrillingCasing);
  const [backReamingCasingHole, setBackReamingCasingHole] = useState(prevBackReamingCasing);
  const [rotatingOffBottomCasingHole, setRotatingOffBottomCasingHole] = useState(prevRotatingOffBottomCasing);
  const [trippingInOpenHoleHole, setTrippingInOpenHoleHole] = useState(prevTrippingInOpenHole);
  const [trippingOutOpenHoleHole, setTrippingOutOpenHoleHole] = useState(prevTrippingOutOpenHole);
  const [rotatingOnBottomOpenHoleHole, setRotatingOnBottomOpenHoleHole] = useState(prevRotatingOnBottomOpenHole);
  const [slideDrillingOpenHoleHole, setSlideDrillingOpenHoleHole] = useState(prevSlideDrillingOpenHole);
  const [backReamingOpenHoleHole, setBackReamingOpenHoleHole] = useState(prevBackReamingOpenHole);
  const [rotatingOffBottomOpenHoleHole, setRotatingOffBottomOpenHoleHole] = useState(prevRotatingOffBottomOpenHole);


  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newHole = {
      case_id: caseId,
      md_top: mdTopHole,
      md_base: mdBaseHole,
      length: lengthHole,
      shoe_md: shoeMdHole,
      od: odHole,
      vd: vdHole,
      caising_internal_diameter: caisinInternalDiameterHole,
      drift_internal_diameter: driftInternalDiameterHole,
      effective_hole_diameter: effectiveHoleDiameterHole,
      weight: weightHole,
      grade: gradeHole,
      min_yield_strength: minYieldStrengthHole,
      burst_rating: burstRatingHole,
      collapse_rating: collapseRatingHole,
      friction_factor_casing: frictionFactorCaisingHole,
      linear_capacity_casing: linearCapacityCaisingHole,
      description_casing: descriptionCaisingHole,
      manufacturer_casing: manufacturerCaisingHole,
      model_casing: modelCaisingHole,
      open_hole_md_top: openHoleMDTopHole,
      open_hole_md_base: openHoleMDBaseHole,
      open_hole_length: openHoleLengthHole,
      open_hole_internal_diameter: openHoleInternalDiameterHole,
      effective_diameter: effectiveDiameterHole,
      friction_factor_open_hole: frictionFactorOpenHoleHole,
      linear_capacity_open_hole: linearCapacityOpenHoleHole,
      volume_excess: volumeExcessHole,
      description_open_hole: descriptionOpenHoleHole,
      tripping_in_casing: trippingInCasingHole,
      tripping_out_casing: trippingOutCasingHole,
      rotating_on_bottom_casing: rotatingOnBottomCasingHole,
      slide_drilling_casing: slideDrillingCasingHole,
      back_reaming_casing: backReamingCasingHole,
      rotating_off_bottom_casing: rotatingOffBottomCasingHole,
      tripping_in_open_hole: trippingInOpenHoleHole,
      tripping_out_open_hole: trippingOutOpenHoleHole,
      rotating_on_bottom_open_hole: rotatingOnBottomOpenHoleHole,
      slide_drilling_open_hole: slideDrillingOpenHoleHole,
      back_reaming_open_hole: backReamingOpenHoleHole,
      rotating_off_bottom_open_hole: rotatingOffBottomOpenHoleHole,
    };
    if (type == 'post') {
      try {
        await instance.post(`/api/v1/holes?caseId=${caseId}`, newHole);
        toast.success("Новый ствол был добавлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при добавлении ствола");
        console.error(error);
      }
    }
    if (type == 'put' && id) {
      try {
        await instance.put(`/api/v1/holes/${id}`, newHole);
        toast.success("Ствол был обновлен");
        navigate("/");
      } catch (error) {
        toast.error("Ошибка при обновлении ствола");
        console.error(error);
      }

    }
  }

  return (
    <div className="w-screen flex flex-col justify-center items-center">  
      <div className="w-3/4 max-w-md justify-center items-center rounded-lg p-5 m-5 border-2 font-roboto">
        <h2 className="text-xl font-medium mb-4 justify-start flex font-roboto">
          {type === "post" ? "Создать новый раствор" : "Обновить этот раствор"}
        </h2>
        
        {/* Form starts here */}
        <Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="col-span-1">
            {/* Add form inputs for the left column here */}
            {/* MD */}
            <div className="input-wrapper">
              <label htmlFor="mdTop">Верхняя Глубина</label>
              <input
                id="mdTop"
                type="text"
                value={mdTopHole}
                placeholder={type == "put" ? mdTopHole.toString() : "Введите верхнюю глубину"}
                onChange={(e) => setMdTopHole(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
  
          {/* Right Column */}
          <div className="col-span-1">
            {/* Add form inputs for the right column here */}
          </div>
  
          {/* Submit button */}
          <div className="col-span-2 flex flex-col items-center justify-center mt-3 mx-6">
            <button
              type="submit"
              className="w-full mb-2 bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
            >
              {type === 'put' ? 'Обновить' : 'Создать'}
            </button>
  
            {/* Conditionally render close button when type is 'put' */}
            {type === 'put' && (
              <button
                type="button"
                className="w-full bg-black text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline h-11 text-base"
                onClick={() => setIsEdit && setIsEdit(false)}
              >
                Закрыть
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateHole;
