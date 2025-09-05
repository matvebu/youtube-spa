import { Form, type FieldPath } from 'react-hook-form';
import type { AuthSchemaType } from '../../schema/schema';
import type { InputFieldPropsType } from './InputFieldPropsType';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';

export function TextInputField<TName extends FieldPath<AuthSchemaType>>({
  form,
  name,
  label,
  placeholder,
}: InputFieldPropsType<TName>) {
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className='space-y-1.5'>
            <FormLabel className='text-sm'>{label}</FormLabel>
            <FormControl className='mt-0 mb-0'>
              <Input {...field} placeholder={placeholder} className='w-full' />
            </FormControl>
            <FormMessage className='mt-0 text-xs leading-tight' />
          </FormItem>
        )}
      />
    </Form>
  );
}
