import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { Movie } from '@/app/entities/movie';
import localFont from 'next/font/local';
import '@/app/globals.css';
import { useRouter } from "next/navigation";

const anton = localFont({
  src: '../../app/fonts/Anton,Antonio/Anton/Anton-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-anton',
});

interface MovieCardProps {
  movie: Movie;
  theme: 'light' | 'dark';
  size?: 'default' | 'small';
}

const formatDate = (date: string) => {
  if (!date) return 'Date inconnue';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, theme, size = 'default' }) => {

  const router = useRouter();

  const cardStyles: { [key: string]: React.CSSProperties } = {
    default: {
      width: "300px",
      textAlign: "left",
      margin: "10px",
    },
    small: {
      width: "200px",
      textAlign: "left",
      margin: "5px",
    },
  };

  const textSizes = {
    default: {
      title: "text-xl",
      date: "text-sm",
      rating: "text-base",
    },
    small: {
      title: "text-lg",
      date: "text-xs",
      rating: "text-sm",
    },
  };

  const handleClick = () => {
    router.push(`/menu/movie/${movie.id}`);
  };

  return (
    <div
      className={`rounded-lg shadow-lg cursor-pointer ${
        theme === "light"
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-800 hover:shadow-lg transition-shadow duration-300"
      }`}
      style={cardStyles[size]}
      onClick={handleClick}
    >
      {movie.poster_path && (
        <Image
          src={movie.poster_path}
          alt={movie.title}
          width={150}
          height={200}
          className="rounded-t-lg w-full h-auto object-cover"
        />
      )}
      <div className="p-4">
        <h3 className={`${anton.className} ${textSizes[size].title}`}>{movie.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className={`${textSizes[size].date} text-gray-500`}>{formatDate(movie.release_date)}</p>
          <div className="flex items-center">
            <FaStar color="#8E8FC3" size={16} />
            <p className={`ml-2 font-semibold ${textSizes[size].rating}`}>
              {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;