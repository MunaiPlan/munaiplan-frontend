import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api';
import type { CurrentUser } from '../services/admin.service';
import { cn } from '../ui';

type Health = 'ok' | 'down' | 'unknown';

/** Polls /api/v1/status: API reachability and model readiness. */
const useServiceStatus = () => {
  const [status, setStatus] = useState<{ api: Health; model: Health }>({ api: 'unknown', model: 'unknown' });
  useEffect(() => {
    let cancelled = false;
    const check = () => instance.get<{ api: string; model: string }>('/api/v1/status')
      .then(({ data }) => { if (!cancelled) setStatus({ api: 'ok', model: data.model === 'ready' ? 'ok' : 'down' }); })
      .catch(() => { if (!cancelled) setStatus({ api: 'down', model: 'unknown' }); });
    check();
    const timer = window.setInterval(check, 30_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);
  return status;
};

const Dot = ({ health, label, detail }: { health: Health; label: string; detail: string }) => (
  <span className="flex items-center gap-1.5" title={detail}>
    <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full',
      health === 'ok' ? 'bg-paper' : health === 'down' ? 'border border-paper bg-transparent' : 'bg-ink-500')} />
    {label}
  </span>
);

export const StatusBar = ({ user }: { user: CurrentUser | null }) => {
  const { api, model } = useServiceStatus();
  return (
    <footer className="flex h-6 shrink-0 items-center justify-between gap-4 bg-ink px-3 text-2xs text-paper/80" aria-label="Строка состояния">
      <div className="flex items-center gap-4">
        <Dot health={api} label={api === 'down' ? 'API недоступен' : 'API'} detail="Сервер приложения" />
        <Dot health={model} label={model === 'ok' ? 'Модель готова' : model === 'down' ? 'Модель недоступна' : 'Модель'}
          detail="Сервис прогнозов Torque & Drag" />
        <span className="hidden sm:inline">Прогнозы не валидированы</span>
      </div>
      <div className="flex items-center gap-3 truncate">
        {user && <span className="truncate">{user.email}{user.role === 'admin' ? ' · администратор' : ''}</span>}
        <span className="font-mono">MunaiPlan</span>
      </div>
    </footer>
  );
};
