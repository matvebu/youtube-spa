import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, type AuthSchemaType } from '../schema/schema';
import { Button } from '../../../components/ui/button';
import { TextInputField } from './fields/TextInputField';
import { NumericInputField } from './fields/NumericInputField';
import { Form } from '../../../components/ui/form';

const RegisterForm = () => {
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      gender: 'female',
      age: 13,
    },
  });

  const onSubmit = async (data: AuthSchemaType) => {
    console.log(data);
  };

  return (
    <div className='w-[550px] mx-auto'>
      <Form {...form}>
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
      </Form>
    </div>
  );
};

export default RegisterForm;
