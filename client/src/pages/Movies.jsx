import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { dummyShowsData } from '../assets/assets' // adjust path if different

const Movies = () => {
  const { shows, destinations } = useAppContext()

  console.log({destinations})

  // pick data: real → dummy → empty
  const moviesToShow =
    (destinations && destinations.length > 0 && destinations) ||
    (shows && shows.length > 0 && shows) ||
    dummyShowsData ||
    []

  // if still nothing, show empty state
  if (!moviesToShow || moviesToShow.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-center'>No movies available</h1>
      </div>
    )
  }

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom='50px' right='50px' />

      <h1 className='text-lg font-medium my-4'>Destinations</h1>

      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {moviesToShow.map(movie => (
          <MovieCard
            key={movie._id || movie.id}
            movie={movie}
          />
        ))}
      </div>
    </div>
  )
}

export default Movies
