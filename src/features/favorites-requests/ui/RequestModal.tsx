import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../../components/ui/sheet';
import { Button } from '../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../../components/ui/input';
import { Star, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { RequestFormSchema, type RequestFormType } from '../model/schema';
import {
  removeRequest,
  addRequest,
  editRequest,
  getRequestBySearch,
} from '../model/store/requestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/providers/store/store';
import { getCurrentUser } from '../../auth/model/store/userSlice';

interface RequestModalProps {
  request: RequestFormType & { id?: string };
  title: 'Save request' | 'Update request';
}

const RequestModal = ({ request, title }: RequestModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => getCurrentUser(state));
  const existingRequest = useSelector((state: RootState) =>
    getRequestBySearch(state)(currentUser, request.search)
  );
  const isRequestSaved = Boolean(existingRequest);
  const [isSaved, setIsSaved] = useState(isRequestSaved);

  useEffect(() => {
    setIsSaved(isRequestSaved);
  }, [isRequestSaved]);

  const form = useForm<RequestFormType>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      search: request.search,
      title: request.title || '',
      maxResults: request.maxResults || 25,
      order: request.order || 'relevance',
    },
  });

  useEffect(() => {
    form.reset({
      search: request.search,
      title: request.title || '',
      maxResults: request.maxResults || 25,
      order: request.order || 'relevance',
    });
  }, [request, form]);

  const onSaveSubmit = (data: RequestFormType) => {
    console.log('onSaveSubmit', data);
    try {
      dispatch(addRequest({ request: data, currentUser }));
      setIsSaved(true);
      toast.success('Request saved successfully!');
    } catch {
      toast.error('Failed to save request');
    }
  };

  const onEditSubmit = (data: RequestFormType) => {
    try {
      if (title === 'Update request' && request.id) {
        dispatch(editRequest({ request: { id: request.id, ...data }, currentUser }));
        toast.success('Request updated successfully!');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Request already exists') {
        toast.error('Request already exists');
      } else {
        toast.error('Failed to update request');
      }
    }
  };

  const handleRemoveFromFavorites = () => {
    try {
      console.log('request.id', existingRequest?.id);
      if (existingRequest) {
        dispatch(removeRequest({ id: existingRequest.id, currentUser }));
        setIsSaved(false);
        toast.success('Request removed from favorites!');
      }
    } catch {
      toast.error('Failed to remove request');
    }
  };

  if (title === 'Save request' && isSaved) {
    return (
      <Button
        type='button'
        variant='ghost'
        className='rounded-none border-x-0 border-y border-border bg-input/30 hover:bg-input/30 focus:bg-input/30 active:bg-input/30 dark:bg-input/30 dark:hover:bg-input/30 dark:focus:bg-input/30 dark:active:bg-input/30 focus-visible:outline-none focus-visible:ring-0 shadow-none transition-none'
        onClick={handleRemoveFromFavorites}
      >
        <Star className='text-yellow-500' />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className='rounded-none border-x-0 border-y border-border bg-input/30 hover:bg-input/30 focus:bg-input/30 active:bg-input/30 dark:bg-input/30 dark:hover:bg-input/30 dark:focus:bg-input/30 dark:active:bg-input/30 focus-visible:outline-none focus-visible:ring-0 shadow-none transition-none'
        >
          {title === 'Save request' ? <Star /> : <Edit />}
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full flex flex-col gap-3 max-w-xs p-3'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className='flex items-center flex-col justify-center lg:p-8 gap-6'>
          <Form {...form}>
            <form
              className='grid gap-4 w-full max-w-sm min-w-0'
              onSubmit={form.handleSubmit(title === 'Save request' ? onSaveSubmit : onEditSubmit)}
            >
              <FormField
                control={form.control}
                name='search'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request name</FormLabel>
                    <FormControl>
                      <Input {...field} className='w-full' readOnly={title === 'Save request'} />
                    </FormControl>
                    <FormMessage className='text-xs leading-tight' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='title' autoComplete='title' {...field} />
                    </FormControl>
                    <FormMessage className='text-xs leading-tight' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxResults'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Results</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <div className='flex gap-4'>
                          <input
                            type='range'
                            min={0}
                            max={50}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className='w-3/4 bg-primary'
                          />
                          <Input
                            type='number'
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className='w-1/4'
                            inputMode='numeric'
                            min={0}
                            max={50}
                          />
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage className='text-xs leading-tight' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordered by</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Ordered by' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Ordered by</SelectLabel>
                          <SelectItem value='relevance'>Relevance</SelectItem>
                          <SelectItem value='date'>Date</SelectItem>
                          <SelectItem value='rating'>Rating</SelectItem>
                          <SelectItem value='title'>Title</SelectItem>
                          <SelectItem value='videoCount'>Video count</SelectItem>
                          <SelectItem value='viewCount'>View count</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-xs leading-tight' />
                  </FormItem>
                )}
              />
              <SheetFooter className='flex flex-row gap-2'>
                <Button className='w-1/2 active:scale-95' type='submit'>
                  {title === 'Save request' ? 'Save' : 'Update'}
                </Button>
                <SheetClose asChild>
                  <Button variant='outline' className='w-1/2'>
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RequestModal;
