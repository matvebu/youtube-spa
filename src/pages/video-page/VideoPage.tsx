import { useParams } from 'react-router-dom';

export function VideoPage() {
  const { videoId } = useParams<{ videoId: string }>();

  return (
    <div className='flex justify-center items-center'>
      <iframe
        width='560'
        height='315'
        src={`https://www.youtube.com/embed/${videoId}`}
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </div>
  );
}
