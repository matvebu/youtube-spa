import { useSelector } from 'react-redux';
import { getCurrentUserRequests, type RequestType } from '../model/store/requestsSlice';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '../../../components/ui/table';
import { lazy, Suspense } from 'react';
import type { RootState } from '../../../app/providers/store/store';
import { getCurrentUser } from '../../auth/model/store/userSlice';

const RequestModal = lazy(() => import('./RequestModal'));

const RequestsList = () => {
  const currentUser = useSelector((state: RootState) => getCurrentUser(state));
  const requests = useSelector((state: RootState) => getCurrentUserRequests(state)(currentUser));
  const navigate = useNavigate();

  const clickRequestHandler = (request: RequestType) => {
    navigate(`/main/search`, { state: { request } });
  };
  return (
    <Table className='w-full flex flex-col justify-center'>
      <TableCaption>Favorites requests</TableCaption>
      <TableBody className='w-full flex flex-col justify-center'>
        {requests.map((request) => (
          <TableRow key={request.search} className='w-full flex flex-col justify-between'>
            <TableCell className='cursor-pointer' onClick={() => clickRequestHandler(request)}>
              {request.title}
            </TableCell>
            <TableCell className='text-center'>
              <Suspense fallback={<div>Loading...</div>}>
                <RequestModal request={request} title='Update request' />
              </Suspense>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsList;
