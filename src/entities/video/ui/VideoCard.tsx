import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';
import { viewsFormatHelper } from '../../../shared/utils/viewsFormatHelper';
import type { Video, ViewsCountResponse } from '../model/types';
type ListOrientation = 'list' | 'grid';

interface CardProps {
  video: Video;
  orientation: ListOrientation;
  cardClickHandler: (videoId: string) => void;
  viewsData: ViewsCountResponse;
}
const VideoCard: React.FC<CardProps> = ({ video, orientation, cardClickHandler, viewsData }) => {
  return (
    <Card
      key={video.id.videoId}
      onClick={() => cardClickHandler(video.id.videoId)}
      className={`cursor-pointer py-0 ${
        orientation === 'list' ? 'w-[80%] flex flex-row h-[120px]' : 'lgx1:w-[280px]'
      }`}
    >
      <div
        className={`block relative h-full after:content-[""] after:absolute after:inset-0 after:rounded-[14px] after:bg-transparent after:pointer-events-none after:transition-colors hover:after:bg-[rgba(62,170,102,0.2)] ${
          orientation === 'list' ? 'flex flex-row w-full' : ''
        }`}
      >
        <CardContent className={orientation === 'list' ? 'px-0 w-[210px] flex-shrink-0' : 'px-0'}>
          <AspectRatio ratio={16 / 9}>
            <picture>
              <source media='(min-width: 650px)' srcSet={video.snippet.thumbnails.medium.url} />
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
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
            {video.snippet.title}
          </CardTitle>
          <CardDescription>{video.snippet.channelTitle}</CardDescription>
          {viewsData &&
            viewsData.items.map((view) => {
              if (view.id === video.id.videoId)
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
};

export default VideoCard;
