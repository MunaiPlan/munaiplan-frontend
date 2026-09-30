import { FiBriefcase, FiMap, FiGrid, FiCrosshair, FiGitCommit, FiLayers, FiTrendingDown, FiFileText } from 'react-icons/fi';
import type { Kind } from './hierarchy';

const icons: Record<Kind, typeof FiBriefcase> = {
  company: FiBriefcase, field: FiMap, site: FiGrid, well: FiCrosshair,
  wellbore: FiGitCommit, design: FiLayers, trajectory: FiTrendingDown, case: FiFileText,
};

export const KindIcon = ({ kind, className }: { kind: Kind; className?: string }) => {
  const Icon = icons[kind];
  return <Icon aria-hidden="true" className={className} />;
};
