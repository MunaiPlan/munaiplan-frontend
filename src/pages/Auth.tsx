import { FC } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../services/auth.service';
import { saveUserLocally } from '../api/axios.api';
import { Alert, Button, TextField } from '../ui';

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type SignInFields = z.infer<typeof schema>;

const authErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'Возникла ошибка с входом в аккаунт';
  }
  return 'Возникла ошибка с входом в аккаунт';
};

const Auth: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignInFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (credentials: SignInFields) => {
    try {
      const session = await authService.login(credentials);
      saveUserLocally(session);
      dispatch(login(session));
      toast.success('Вы успешно вошли в аккаунт');
      navigate('/');
    } catch (error: unknown) {
      const message = authErrorMessage(error);
      setError('root', { message });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-paper text-ink lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-sm bg-paper font-mono text-xs font-bold text-ink">M</span>
          <span className="text-lg font-semibold tracking-tight">MunaiPlan</span>
        </div>
        {/* A stylised well path: vertical, build, horizontal. */}
        <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute right-0 top-24 w-[60%] opacity-20">
          <path d="M60 0 V120 Q60 220 170 240 H400" fill="none" stroke="currentColor" strokeWidth="2" />
          {[40, 80, 120, 170, 210, 250, 300, 350].map((x, i) => <circle key={i} cx={i < 3 ? 60 : x} cy={i < 3 ? x : i === 3 ? 205 : 238} r="3" fill="currentColor" />)}
        </svg>
        <div className="relative max-w-sm">
          <p className="text-3xl font-semibold leading-tight tracking-tight">Планирование бурения: Torque &amp; Drag и гидравлика.</p>
          <p className="mt-3 text-sm text-paper/60">Импорт инженерных отчётов, расчёт нагрузок и сравнение с эталоном — в одном рабочем пространстве.</p>
        </div>
        <p className="relative text-2xs text-paper/40">Прогнозы ML-модели не валидированы для инженерных решений.</p>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-sm bg-ink font-mono text-2xs font-bold text-paper">M</span>
            <span className="font-semibold">MunaiPlan</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Вход</h1>
          <p className="mt-1 text-sm text-ink-500">Войдите с учётной записью, выданной администратором.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField label="Email" type="email" autoComplete="email" placeholder="name@company.kz" error={errors.email?.message} {...register('email')} />
            <TextField label="Пароль" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
            {errors.root && <Alert tone="error">{errors.root.message}</Alert>}
            <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">Войти</Button>
          </form>
          <p className="mt-6 text-xs text-ink-500">Регистрация недоступна. Для доступа обратитесь к администратору вашей организации.</p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
