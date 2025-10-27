import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useLazyGetViewsCountQuery, useSearchQuery } from '../api/videoApi';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import { AspectRatio } from '../../../components/ui/aspect-ratio';
import { Skeleton } from '../../../components/ui/skeleton';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { viewsFormatHelper } from '../../../shared/utils/viewsFormatHelper';
import { List, LayoutGrid, Search } from 'lucide-react';
import { SearchInputSchema } from '../model/schema';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';
import RequestModal from '../../favorites-requests/ui/RequestModal';
import type { AppDispatch, RootState } from '../../../app/providers/store/store';
import { useSelector } from 'react-redux';
import { setCurrentSearch } from '../model/store/currentSearchSlice';
import { skipToken } from '@reduxjs/toolkit/query';

function VideoFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [orientation, setOrientation] = useState('grid');

  const currentSearch = useSelector((state: RootState) => state.currentSearch.request);
  const [searchTerm, setSearchTerm] = useState(() => {
    return location.state?.request?.search || currentSearch?.search || '';
  });

  const [searchRequest, setSearchRequest] = useState(() => {
    return location.state?.request || currentSearch || null;
  });

  const { data, isLoading } = useSearchQuery(searchRequest ?? skipToken);
  const [triggerViewsCount, { data: viewsData, isLoading: isViewsLoading }] =
    useLazyGetViewsCountQuery();

  console.log(data);

  useEffect(() => {
    if (data?.videos) {
      const ids = Object.values(data.videos.ids);
      triggerViewsCount(ids);
    }
  }, [data, triggerViewsCount]);

  const handleSearch = () => {
    const result = SearchInputSchema.safeParse({ search: searchTerm });
    if (!result.success) {
      toast.error('Invalid search query');
      return;
    }
    dispatch(setCurrentSearch(result.data));
    setSearchRequest({ search: result.data.search });
  };

  const cardClickHandler = (videoId: string) => {
    navigate(`/main/video/${videoId}`);
  };
  console.log(data?.videos);
  console.log(isLoading && isViewsLoading);
  return (
    <div
      className={`flex flex-col w-full items-center gap-4 px-8 h-full py-6 overflow-hidden  ${
        isLoading || isViewsLoading
          ? ''
          : data?.videos !== undefined
            ? 'justify-start h-full overflow-y-auto scrollbar-hidden'
            : 'justify-center'
      }`}
    >
      <div className='flex w-full items-center'>
        <form
          className='flex flex-1 group focus-within:ring-[3px] focus-within:ring-primary focus-within:border-primary rounded-4xl border transition-all '
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            className='focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none focus-visible:border-transparent placeholder:text-base placeholder:leading-4 rounded-r-none placeholder:text-[#30384C]/40 dark:placeholder:text-[#d0d8e8]/60 w-full pl-5 rounded-l-4xl bg-input/30 dark:bg-input/30 border-r-0'
            type='text'
            placeholder='search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type='submit'
            variant='outline'
            className='rounded-r-4xl rounded-l-none hover:bg-primary/30 dark:hover:bg-primary/30 active:bg-primary  dark:active:bg-primary active:border-primary active:ring-[3px] active:ring-primary'
          >
            <Search />
          </Button>
        </form>
        <RequestModal request={{ search: searchTerm, title: '' }} title='Save request' />
      </div>
      {searchTerm && (
        <div className='flex justify-between w-full'>
          <p>
            Results for the query <span className='font-bold'>"{searchTerm}"</span>:{' '}
            <span className='text-muted-foreground'>{data?.totalResults || 0}</span>
          </p>
          <ToggleGroup
            type='single'
            value={orientation}
            className='flex gap-2'
            onValueChange={(value) => {
              if (value) setOrientation(value);
            }}
          >
            <ToggleGroupItem
              value='list'
              className='cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
            >
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem
              value='grid'
              className='cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
            >
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <div
        className={`grid gap-6 w-full max-w-7xl ${
          orientation === 'list'
            ? 'grid-cols-1 place-items-center'
            : 'grid-cols-1 sm:grid-cols-2 smx1:grid-cols-3 lgx1:grid-cols-4'
        }`}
      >
        {data && viewsData
          ? Object.values(data.videos.entities).map((el) => {
              return (
                <Card
                  key={el.id.videoId}
                  onClick={() => cardClickHandler(el.id.videoId)}
                  className={`cursor-pointer py-0 ${
                    orientation === 'list' ? 'w-[80%] flex flex-row h-[120px]' : 'lgx1:w-[280px]'
                  }`}
                >
                  <div
                    className={`block relative h-full after:content-[""] after:absolute after:inset-0 after:rounded-[14px] after:bg-transparent after:pointer-events-none after:transition-colors hover:after:bg-[rgba(62,170,102,0.2)] ${
                      orientation === 'list' ? 'flex flex-row w-full' : ''
                    }`}
                  >
                    <CardContent
                      className={orientation === 'list' ? 'px-0 w-[210px] flex-shrink-0' : 'px-0'}
                    >
                      <AspectRatio ratio={16 / 9}>
                        <picture>
                          <source
                            media='(min-width: 650px)'
                            srcSet={el.snippet.thumbnails.medium.url}
                          />
                          <img
                            src={el.snippet.thumbnails.high.url}
                            alt={el.snippet.title}
                            className={`object-cover w-full h-full ${
                              orientation === 'list' ? 'rounded-l-[14px]' : 'rounded-t-[14px]'
                            }`}
                            onError={(e) => {
                              e.currentTarget.src = '/assets/fallback.jpg';
                            }}
                          />
                        </picture>
                      </AspectRatio>
                    </CardContent>
                    <CardFooter
                      className={`items-start px-3 pt-3 ${
                        orientation === 'list' ? 'flex-1 flex-col justify-center' : 'flex-col'
                      }`}
                    >
                      <CardTitle className='line-clamp-2 overflow-hidden text-ellipsis text-left mb-2'>
                        {el.snippet.title}
                      </CardTitle>
                      <CardDescription>{el.snippet.channelTitle}</CardDescription>
                      {viewsData &&
                        viewsData.items.map((view) => {
                          if (view.id === el.id.videoId)
                            return (
                              <CardDescription key={view.id} className='mb-2'>
                                {viewsFormatHelper(view.statistics.viewCount)} views
                              </CardDescription>
                            );
                        })}
                    </CardFooter>
                  </div>
                </Card>
              );
            })
          : isLoading || isViewsLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className='w-[280px] h-[280px] rounded-xl border py-6 shadow-sm'
                />
              ))
            : null}
      </div>
    </div>
  );
}

export default VideoFeed;
