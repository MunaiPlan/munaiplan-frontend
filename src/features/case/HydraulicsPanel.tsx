import { Alert, EmptyState, KeyValue, Loading, Panel } from '../../ui';
import { useCaseReference } from './useCaseReference';

/** Hydraulics: MunaiPlan has no hydraulics model yet, so show WellPlan's own results when imported. */
export const HydraulicsPanel = ({ caseId }: { caseId: string }) => {
  const { loading, report } = useCaseReference(caseId);
  if (loading) return <Loading />;
  const entries = Object.entries(report?.hydraulics ?? {});
  const fluid = report?.fluid;
  return (
    <div className="space-y-5">
      <Alert tone="info" title="Модуль гидравлики MunaiPlan в разработке">
        Расчёт гидравлики пока не реализован. Для кейсов, импортированных из WellPlan, ниже показаны результаты самого WellPlan — только для справки.
      </Alert>
      {entries.length === 0 && !fluid ? (
        <EmptyState title="Нет данных гидравлики" description="Импортируйте отчёт WellPlan с разделом «Гидравлика», чтобы увидеть эталонные значения." />
      ) : (
        <>
          {fluid && (
            <Panel title="Буровой раствор (WellPlan)">
              <KeyValue columns={3} items={[
                { label: 'Раствор', value: fluid.name },
                { label: 'Плотность', value: fluid.density, unit: 'кг/м³' },
                { label: 'Пласт. вязкость', value: fluid.plastic_viscosity, unit: 'сП' },
                { label: 'ДНС', value: fluid.yield_point, unit: 'lbf/100ft²' },
              ]} />
            </Panel>
          )}
          {entries.length > 0 && (
            <Panel title="Параметры долота и насоса (WellPlan)">
              <KeyValue items={entries.map(([label, value]) => ({ label, value }))} />
            </Panel>
          )}
        </>
      )}
    </div>
  );
};
