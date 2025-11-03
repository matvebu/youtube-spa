import {
  getCurrentUserRequests,
  removeRequest,
  type RequestType,
} from '../../../entities/request/model/requestsSlice';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '../../../components/ui/table';
import { lazy, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/storeHooks';
import { getCurrentUser } from '../../../shared/store/userSlice';
import { setCurrentSearch } from '../../video-search/model/store/currentSearchSlice';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';

const EditRequestModal = lazy(() => import('../../../entities/request/model/ui/Modal'));

const RequestsList = () => {
  const currentUser = useAppSelector((state) => getCurrentUser(state));

  const requests = useAppSelector((state) => getCurrentUserRequests(state, currentUser));

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const clickRequestHandler = (request: RequestType) => {
    dispatch(setCurrentSearch(request));
    navigate('/main/search', { state: { request } });
  };

  const handleRemoveFromFavorites = (request: RequestType) => {
    dispatch(removeRequest({ id: request.id, currentUser }));
    toast.success('Request removed from favorites!');
  };
  return (
    <Table className='w-full flex flex-col max-w-3xl mx-auto pt-8 smx1:px-0 px-4'>
      <TableCaption className='sr-only'>Favorites requests</TableCaption>
      <TableBody className='w-full flex flex-col space-y-1'>
        {requests.map((request) => (
          <TableRow
            key={request.search}
            className='w-full flex justify-between bg-accent cursor-pointer pl-5 border-0 pt-1.5'
          >
            <TableCell
              className='cursor-pointer flex-1 align-baseline'
              onClick={() => clickRequestHandler(request)}
            >
              {request.title}
            </TableCell>
            <TableCell className='text-center shrink-0'>
              <Suspense>
                <EditRequestModal
                  currentUser={currentUser}
                  request={request}
                  title='Update request'
                  requestFromFavorites={request}
                />
                <Button
                  onClick={() => handleRemoveFromFavorites(request)}
                  className='group cursor-pointer rounded-none border-none bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:outline-none focus-visible:ring-0 shadow-none transition-none'
                >
                  <X className='group-hover:text-yellow-500 dark:group-hover:text-yellow-500  text-black dark:text-white transition-colors' />
                </Button>
              </Suspense>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsList;
