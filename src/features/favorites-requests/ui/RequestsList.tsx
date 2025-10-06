import { useSelector } from 'react-redux';
import { getCurrentUserRequests, type RequestType } from '../model/store/requestsSlice';
import { useNavigate } from 'react-router-dom';
import RequestModal from './RequestModal';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '../../../components/ui/table';

const RequestsList = () => {
  const requests = useSelector(getCurrentUserRequests);
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
              <RequestModal request={request} title='Update request' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsList;
