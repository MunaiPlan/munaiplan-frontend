import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiChevronRight, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  adminService, apiErrorMessage,
  type Account, type AccountInput, type OrganizationInput, type OrganizationSummary,
} from '../services/admin.service';
import { Alert, Badge, Button, cn, EmptyState, Loading, PageHeader, Panel, SelectField, TextField } from '../ui';

const MIN_PASSWORD = 12;
const required = 'Заполните это поле';
const passwordRules = { required, minLength: { value: MIN_PASSWORD, message: `Минимум ${MIN_PASSWORD} символов` } };
const emailRules = { required, pattern: { value: /^\S+@\S+\.\S+$/, message: 'Некорректный email' } };

type NewOrganizationForm = { organization: OrganizationInput; user: AccountInput };

const CreateOrganizationForm: FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewOrganizationForm>({
    defaultValues: { user: { role: 'user' } as AccountInput },
  });
  const submit = async (values: NewOrganizationForm) => {
    try {
      await adminService.createOrganization(values.organization, values.user);
      toast.success(`Организация «${values.organization.name}» создана`);
      reset();
      onCreated();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Не удалось создать организацию'));
    }
  };
  return (
    <Panel title="Новая организация" description="Организация создаётся вместе с первой учётной записью.">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Название" error={errors.organization?.name?.message} {...register('organization.name', { required })} />
          <TextField label="Email организации" type="email" error={errors.organization?.email?.message} {...register('organization.email', emailRules)} />
          <TextField label="Телефон" {...register('organization.phone')} />
          <TextField label="Адрес" {...register('organization.address')} />
        </div>
        <p className="border-t border-ink-200 pt-4 text-2xs font-medium uppercase tracking-wider text-ink-500">Первый пользователь</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Имя" error={errors.user?.name?.message} {...register('user.name', { required })} />
          <TextField label="Фамилия" error={errors.user?.surname?.message} {...register('user.surname', { required })} />
          <TextField label="Email для входа" type="email" autoComplete="off" error={errors.user?.email?.message} {...register('user.email', emailRules)} />
          <TextField label="Пароль" type="password" autoComplete="new-password" hint={`Не короче ${MIN_PASSWORD} символов`}
            error={errors.user?.password?.message} {...register('user.password', passwordRules)} />
        </div>
        <div className="flex justify-end"><Button type="submit" variant="primary" loading={isSubmitting}>Создать организацию</Button></div>
      </form>
    </Panel>
  );
};

const OrganizationUsers: FC<{ organization: OrganizationSummary; onChanged: () => void }> = ({ organization, onChanged }) => {
  const [users, setUsers] = useState<Account[] | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AccountInput>({ defaultValues: { role: 'user' } });

  const load = useCallback(() => {
    adminService.listUsers(organization.id).then(setUsers)
      .catch((error) => toast.error(apiErrorMessage(error, 'Не удалось загрузить пользователей')));
  }, [organization.id]);
  useEffect(load, [load]);

  const submit = async (values: AccountInput) => {
    try {
      await adminService.createUser(organization.id, values);
      toast.success(`Пользователь ${values.email} добавлен`);
      reset({ role: 'user' } as AccountInput);
      load();
      onChanged();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Не удалось добавить пользователя'));
    }
  };

  return (
    <div className="space-y-4 border-t border-ink-200 bg-ink-50 px-4 py-4">
      {users === null ? <Loading /> : (
        <ul className="divide-y divide-ink-200 rounded-md border border-ink-200 bg-paper">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="truncate">{u.name} {u.surname} <span className="text-ink-500">{u.email}</span></span>
              <Badge tone={u.role === 'admin' ? 'solid' : 'default'}>{u.role === 'admin' ? 'Администратор' : 'Пользователь'}</Badge>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit(submit)} noValidate className="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_1fr_1.3fr_1fr_0.9fr_auto]">
        <TextField label="Имя" error={errors.name?.message} {...register('name', { required })} />
        <TextField label="Фамилия" error={errors.surname?.message} {...register('surname', { required })} />
        <TextField label="Email" type="email" autoComplete="off" error={errors.email?.message} {...register('email', emailRules)} />
        <TextField label="Пароль" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password', passwordRules)} />
        <SelectField label="Роль" {...register('role')}>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </SelectField>
        <Button type="submit" variant="primary" loading={isSubmitting} icon={<FiUserPlus />} className="md:mt-5">Добавить</Button>
      </form>
    </div>
  );
};

/** Tenant and account provisioning for administrators (B2B: no public registration). */
const AdminPage: FC = () => {
  const { user, loading } = useCurrentUser();
  const [organizations, setOrganizations] = useState<OrganizationSummary[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  const load = useCallback(() => {
    adminService.listOrganizations().then(setOrganizations)
      .catch((error) => toast.error(apiErrorMessage(error, 'Не удалось загрузить организации')));
  }, []);
  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (loading) return <Loading />;
  if (!isAdmin) return <div className="p-6"><Alert tone="warning" title="Доступ только для администраторов" /></div>;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">
      <PageHeader eyebrow="Система" title="Администрирование" meta="Организации и учётные записи. Пользователи видят только данные своей организации." />
      <CreateOrganizationForm onCreated={load} />
      <Panel title="Организации" description={organizations ? `${organizations.length} шт.` : undefined} bodyClassName="p-0">
        {organizations === null ? <Loading /> : organizations.length === 0 ? <div className="p-4"><EmptyState title="Организаций пока нет" /></div> : (
          <ul className="divide-y divide-ink-200">
            {organizations.map((org) => {
              const open = expanded === org.id;
              return (
                <li key={org.id}>
                  <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : org.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-ink-50">
                    <FiChevronRight aria-hidden="true" className={cn('h-4 w-4 text-ink-500 transition-transform', open && 'rotate-90')} />
                    <span className="flex-1 truncate"><span className="font-medium">{org.name}</span> <span className="text-sm text-ink-500">{org.email}</span></span>
                    <span className="text-xs text-ink-500">{org.user_count} польз.</span>
                  </button>
                  {open && <OrganizationUsers organization={org} onChanged={load} />}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
};

export default AdminPage;
