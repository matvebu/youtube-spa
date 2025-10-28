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
import { cn } from '../../../shared/lib/utils/cn';

const buttonClass =
  'group cursor-pointer rounded-none border-none bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:outline-none focus-visible:ring-0 shadow-none transition-none';

interface RequestModalProps {
  request: RequestFormType & { id?: string };
  title: 'Save request' | 'Update request';
  className?: string;
}

const RequestModal: React.FC<RequestModalProps> = ({ request, title, className }) => {
  console.log('modal here');
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

  const handleSave = (data: RequestFormType) => {
    dispatch(addRequest({ request: data, currentUser }));
    setIsSaved(true);
    toast.success('Request saved successfully!');
  };

  const handleEdit = (data: RequestFormType) => {
    if (title === 'Update request' && request.id) {
      dispatch(editRequest({ request: { id: request.id, ...data }, currentUser }));
      toast.success('Request updated successfully!');
    }
  };

  const handleRemoveFromFavorites = () => {
    if (existingRequest) {
      dispatch(removeRequest({ id: existingRequest.id, currentUser }));
      setIsSaved(false);
      toast.success('Request removed from favorites!');
    }
  };

  if (title === 'Save request' && isSaved) {
    return (
      <Button
        type='button'
        className={cn(buttonClass, className)}
        onClick={handleRemoveFromFavorites}
      >
        <Star className='text-yellow-500' />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={cn(buttonClass, className)}>
          {title === 'Save request' ? (
            <Star className='group-hover:text-yellow-500 dark:group-hover:text-yellow-500 transition-colors' />
          ) : (
            <Edit className='group-hover:text-yellow-500 dark:group-hover:text-yellow-500 transition-colors' />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-full flex flex-col gap-3 max-w-xs p-3'>
        <SheetHeader className='items-center'>
          <SheetTitle className='font-bold text-primary'>{title}</SheetTitle>
        </SheetHeader>
        <div className='flex items-center flex-col justify-center lg:p-8 gap-6'>
          <Form {...form}>
            <form
              className='grid gap-8 w-full max-w-sm min-w-0'
              onSubmit={form.handleSubmit(title === 'Save request' ? handleSave : handleEdit)}
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
              <SheetFooter className='flex flex-row gap-2 px-0'>
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
