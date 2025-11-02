import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Icons } from '../../../../shared/utils/icons';
import { useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { getErrorMessage } from '../../api/authBaseQuery';
import { toast } from 'sonner';
import { useLoginMutation } from '../../api/authApi';
import { type LoginSchemaType, LoginSchema } from '../../model/schema';

import { upsertUser } from '../../../../shared/store/userSlice';
import { useAppDispatch } from '../../../../shared/hooks/storeHooks';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isFetching }] = useLoginMutation();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const res = await login(data).unwrap();
      localStorage.setItem('TOKEN', res.token);
      dispatch(upsertUser(data.email));
      navigate('/main/search');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className='flex items-center flex-col justify-center lg:p-8 gap-6'>
      <Form {...form}>
        <form className='grid gap-4 w-full max-w-sm min-w-0' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>'Name</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='email' autoComplete='email' {...field} />
                </FormControl>
                <FormMessage className='text-xs leading-tight' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>Name</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className='hide-password-toggle pr-10'
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className='h-4 w-4' aria-hidden='true' />
                    ) : (
                      <EyeOffIcon className='h-4 w-4' aria-hidden='true' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                <FormMessage className='text-xs leading-tight' />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isFetching}>
            {isFetching && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </form>
      </Form>
      <Link
        to='/auth/signup'
        className='dark:text-white/50 text-foreground hover:text-muted-foreground dark:hover:text-white underline underline-offset-4'
      >
        Don't have an account?Register now!
      </Link>
    </div>
  );
};

export default LoginForm;
