import { FC, useState } from 'react';
import { HelpLink } from '../../components/HelpLink';
import { Tabs } from '../../ui';
import { DepthChart } from './DepthChart';
import { families } from './families';
import WellPlanComparison from './WellPlanComparison';

const views = [...families.map((f) => ({ key: f.endpoint as string, label: f.title })), { key: 'wellplan', label: 'Сравнение с отчётом' }];

/** Torque & Drag: one tab per model family plus the WellPlan comparison. */
const TorqueDragPanel: FC<{ caseId: string }> = ({ caseId }) => {
  const [active, setActive] = useState<string>(views[0].key);
  const family = families.find((f) => f.endpoint === active);
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs items={views} value={active} onChange={setActive} variant="pills" label="Результаты Torque & Drag" className="min-w-0" />
        {family
          ? <HelpLink to="depth-charts" topic="как читать графики Torque & Drag" />
          : <HelpLink to="comparison" topic="сравнение с отчётом" />}
      </div>
      {family ? <DepthChart key={family.endpoint} family={family} caseId={caseId} /> : <WellPlanComparison caseId={caseId} />}
    </div>
  );
};

export default TorqueDragPanel;
