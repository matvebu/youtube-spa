import { type FieldPath } from 'react-hook-form';
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

export function NumericInputField<TName extends FieldPath<AuthSchemaType>>({
  form,
  name,
  label,
}: InputFieldPropsType<TName>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1.5'>
          <FormLabel className='text-sm'>{label}</FormLabel>
          <FormControl className='mt-0 mb-0'>
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
          <FormMessage className='mt-0 text-xs leading-tight' />
        </FormItem>
      )}
    />
  );
}
