import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  useLazyGetViewsCountQuery,
  useLazySearchQuery,
  type SearchServerError,
} from '../api/videoApi';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import { AspectRatio } from '../../../components/ui/aspect-ratio';
import { Skeleton } from '../../../components/ui/skeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { viewsFormatHelper } from '../../../shared/utils/viewsFormatHelper';
import { List } from 'lucide-react';
import { LayoutGrid } from 'lucide-react';
import { Search } from 'lucide-react';
import { SearchInputSchema } from '../schema/schema';
import { Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';

export function VideoFeed() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || localStorage.getItem('CURRENT_SEARCH') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const [triggerSearch, { data, isLoading }] = useLazySearchQuery();
  const [triggerViewCount, { data: viewsData, isLoading: isViewsLoading }] =
    useLazyGetViewsCountQuery();

  useEffect(() => {
    const handleViewCount = async (ids: string[]) => {
      try {
        await triggerViewCount(ids).unwrap();
      } catch (error) {
        if (error) {
          const message = (error as SearchServerError).error.message;
          toast.error('An error occurred while loading the video view count ' + message);
        }
      }
    };
    if (data?.videos) {
      const ids = Object.values(data.videos.ids);
      handleViewCount(ids);
    }
  }, [data, triggerViewCount]);

  useEffect(() => {
    localStorage.setItem('CURRENT_SEARCH', searchTerm);
    setSearchParams(searchTerm ? { q: searchTerm } : {});
  }, [searchTerm, setSearchParams]);

  const handleSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = SearchInputSchema.safeParse({ search: query });
      if (!result.success) {
        toast.error('Invalid search query');
        return;
      }

      setSearchTerm(result.data.search);
    },
    [query]
  );

  useEffect(() => {
    const handleSearchTrigger = async (searchTerm: string) => {
      try {
        await triggerSearch({ search: searchTerm }).unwrap();
      } catch (error) {
        if (error) {
          const message = (error as SearchServerError).error.message;
          toast.error('An error occurred while loading the video: ' + message);
        }
      }
    };
    if (!searchTerm) return;
    if (searchTerm) {
      handleSearchTrigger(searchTerm);
    }
  }, [searchTerm, triggerSearch]);

  const cardClickHandler = (videoId: string) => {
    navigate(`/main/video/${videoId}`);
  };

  return (
    <div
      className={`flex flex-col w-full items-center gap-4 px-5 ${
        data?.videos?.ids.length
          ? 'justify-start py-6 h-full overflow-y-auto'
          : 'justify-center h-full'
      }`}
    >
      <form
        className='flex w-full max-w-[800px] group focus-within:ring-[3px] focus-within:ring-primary focus-within:border-primary rounded-4xl border transition-all '
        onSubmit={handleSearch}
      >
        <Input
          className='focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none focus-visible:border-transparent placeholder:text-base placeholder:leading-4 rounded-r-none  placeholder:text-[#30384C]/40 dark:placeholder:text-[#d0d8e8]/60 w-full pl-5 rounded-l-4xl bg-input/30 dark:bg-input/30 border-r-0'
          type='text'
          placeholder='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type='button'
          variant='ghost'
          className='
    rounded-none border-x-0 border-y border-border
    bg-input/30
    hover:bg-input/30 focus:bg-input/30 active:bg-input/30
    dark:bg-input/30 dark:hover:bg-input/30 dark:focus:bg-input/30 dark:active:bg-input/30
    focus-visible:outline-none focus-visible:ring-0
    shadow-none transition-none
  '
        >
          <Star />
        </Button>
        <Button
          type='submit'
          variant='outline'
          className='rounded-r-4xl rounded-l-none hover:bg-primary/30 dark:hover:bg-primary/30 active:bg-primary  dark:active:bg-primary active:border-primary active:ring-[3px] active:ring-primary'
        >
          <Search />
        </Button>
      </form>
      {searchTerm && (
        <div className='flex justify-between w-full'>
          <p>
            Results for the query <span className='font-bold'>"{searchTerm}"</span>:{' '}
            <span className='text-muted-foreground'>{data?.totalResults || 0}</span>
          </p>
          <RadioGroup defaultValue='list' className='flex gap-2'>
            <RadioGroupItem
              value='list'
              id='list'
              className='className="
    cursor-pointer
    inline-flex items-center justify-center
    w-8 h-8 rounded
    text-muted-foreground
    data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
            >
              <List />
            </RadioGroupItem>
            <RadioGroupItem value='grid' id='grid' className='cursor-pointer'>
              <LayoutGrid />
            </RadioGroupItem>
          </RadioGroup>
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 smx1:grid-cols-3 lgx1:grid-cols-4 gap-6 w-full max-w-7xl'>
        {data && viewsData
          ? Object.values(data.videos.entities).map((el) => {
              return (
                <Card
                  key={el.id.videoId}
                  onClick={() => cardClickHandler(el.id.videoId)}
                  className='cursor-pointer smx1:w-[280px] py-0'
                >
                  <div className='block relative after:content-[""] after:absolute after:inset-0 after:rounded-[14px] after:bg-transparent after:pointer-events-none after:transition-colors hover:after:bg-[rgba(62,170,102,0.2)]'>
                    <CardContent className='px-0'>
                      <AspectRatio ratio={16 / 9}>
                        <picture>
                          <source
                            media='(min-width: 1024px)'
                            srcSet={el.snippet.thumbnails.high.url}
                          />
                          <source
                            media='(min-width: 640px)'
                            srcSet={el.snippet.thumbnails.medium.url}
                          />
                          <img
                            src={el.snippet.thumbnails.default.url}
                            alt={el.snippet.title}
                            className='rounded-t-[14px] object-cover w-full h-full'
                            onError={(e) => {
                              e.currentTarget.src = '/assets/fallback.jpg';
                            }}
                          />
                        </picture>
                      </AspectRatio>
                    </CardContent>
                    <CardFooter className='flex-col items-start px-3 pt-3'>
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
          : isLoading && isViewsLoading
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
