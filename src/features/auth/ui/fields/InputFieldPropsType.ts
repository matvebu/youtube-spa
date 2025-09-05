import type { FieldPath, UseFormReturn } from 'react-hook-form';
import type { AuthSchemaType } from '../../schema/schema';

export type InputFieldPropsType<TName extends FieldPath<AuthSchemaType>> = {
  form: UseFormReturn<AuthSchemaType>;
  name: TName;
  label: string;
  placeholder?: string;
};
