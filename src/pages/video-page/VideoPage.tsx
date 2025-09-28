import { useParams } from 'react-router-dom';

function VideoPage() {
  const { videoId } = useParams<{ videoId: string }>();

  return (
    <div className='flex justify-center items-center h-full p-6'>
      <div className='border rounded-2xl overflow-hidden shadow-lg'>
        <iframe
          width='560'
          height='315'
          src={`https://www.youtube.com/embed/${videoId}`}
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='rounded-2xl'
        />
      </div>
    </div>
  );
}

export default VideoPage;
