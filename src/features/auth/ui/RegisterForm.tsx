import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, type AuthSchemaType } from '../schema/schema';
import { Button } from '../../../components/ui/button';
import { TextInputField } from './fields/TextInputField';
import { NumericInputField } from './fields/NumericInputField';

const RegisterForm = () => {
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: AuthSchemaType) => {
    console.log(data);
  };

  return (
    <div className='w-[550px] mx-auto'>
      <form className='grid gap-4 w-full max-w-md min-w-0' onSubmit={form.handleSubmit(onSubmit)}>
        <TextInputField form={form} name='username' placeholder='username' label='Name' />
        <TextInputField form={form} name='email' placeholder='email' label='E-mail' />
        <TextInputField form={form} name='password' placeholder='password' label='Password' />
        <TextInputField form={form} name='gender' placeholder='gender' label='Gender' />
        <NumericInputField form={form} name='age' placeholder='age' label='Age' />
        <Button className='mt-2 w-25' type='submit'>
          register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
