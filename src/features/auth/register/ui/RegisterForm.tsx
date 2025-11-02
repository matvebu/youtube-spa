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
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { useRegisterMutation } from '../../api/authApi';
import { getErrorMessage } from '../../api/authBaseQuery';
import { toast } from 'sonner';
import { AuthSchema, type AuthSchemaType } from '../../model/schema';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [register, { isLoading: isFetching }] = useRegisterMutation();

  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      gender: 'male',
      age: 18,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: AuthSchemaType) => {
    try {
      await register(data).unwrap();
      navigate('/signin');
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
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>'Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='username' className='w-full' />
                </FormControl>
                <FormMessage className='text-xs leading-tight' />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='age'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>Age</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    inputMode='numeric'
                    min={18}
                    step={1}
                    className='w-full'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.currentTarget.value;
                      field.onChange(v === '' ? undefined : e.currentTarget.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage className='text-xs leading-tight' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel className='sr-only'>Gender</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue='male' className='flex'>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value='male' />
                      </FormControl>
                      <FormLabel className='font-normal'>Male</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value='female' />
                      </FormControl>
                      <FormLabel className='font-normal'>female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isFetching}>
            {isFetching && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign Up
          </Button>
        </form>
      </Form>
      <Link
        to='/signin'
        className='dark:text-white/50 text-foreground hover:text-muted-foreground dark:hover:text-white underline underline-offset-4'
      >
        Already have an account?
      </Link>
    </div>
  );
};

export default RegisterForm;
