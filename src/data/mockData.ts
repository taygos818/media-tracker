import { Media } from '../types/media';

export const mockData: Media[] = [
  {
    id: '1',
    title: 'The Crown',
    type: 'tv',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
    poster: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2016,
    rating: 8.7,
    runtime: 58,
    genres: ['Drama', 'Biography', 'History'],
    platform: 'Netflix',
    trending: true,
    progress: 75,
    lastWatched: '2024-01-15T20:30:00Z',
    tagline: 'Power has a price',
    media_cast: [
      { name: 'Claire Foy', character: 'Queen Elizabeth II' },
      { name: 'Matt Smith', character: 'Prince Philip' },
      { name: 'Vanessa Kirby', character: 'Princess Margaret' }
    ],
    watchHistory: [
      {
        watchedAt: '2024-01-15T20:30:00Z',
        season: 5,
        episode: 3,
        episodeTitle: 'Mou Mou',
        progress: 100
      },
      {
        watchedAt: '2024-01-14T19:15:00Z',
        season: 5,
        episode: 2,
        episodeTitle: 'The System',
        progress: 100
      }
    ]
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    type: 'movie',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2024,
    rating: 9.2,
    runtime: 166,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    platform: 'HBO Max',
    trending: true,
    lastWatched: '2024-01-14T21:00:00Z',
    tagline: 'Long live the fighters',
    media_cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { name: 'Zendaya', character: 'Chani' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica' }
    ],
    watchHistory: [
      {
        watchedAt: '2024-01-14T21:00:00Z',
        progress: 100
      }
    ]
  },
  {
    id: '3',
    title: 'House of the Dragon',
    type: 'tv',
    description: 'The Targaryen civil war, known as the Dance of the Dragons, unfolds in this prequel to Game of Thrones.',
    poster: 'https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2022,
    rating: 8.8,
    runtime: 64,
    genres: ['Fantasy', 'Drama', 'Action'],
    platform: 'HBO Max',
    progress: 45,
    lastWatched: '2024-01-13T22:30:00Z',
    tagline: 'Dreams didn\'t make us kings. Dragons did.',
    media_cast: [
      { name: 'Paddy Considine', character: 'King Viserys I Targaryen' },
      { name: 'Emma D\'Arcy', character: 'Princess Rhaenyra Targaryen' },
      { name: 'Matt Smith', character: 'Prince Daemon Targaryen' }
    ]
  },
  {
    id: '4',
    title: 'Spider-Man: Into the Spider-Verse',
    type: 'movie',
    description: 'Teen Miles Morales becomes Spider-Man and must join forces with other Spider-People from different dimensions.',
    poster: 'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2018,
    rating: 9.0,
    runtime: 117,
    genres: ['Animation', 'Action', 'Adventure'],
    platform: 'Plex',
    trending: true,
    lastWatched: '2024-01-12T19:45:00Z',
    tagline: 'More than one wears the mask'
  },
  {
    id: '5',
    title: 'Stranger Things',
    type: 'tv',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
    poster: 'https://images.pexels.com/photos/4009708/pexels-photo-4009708.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2016,
    rating: 8.7,
    runtime: 51,
    genres: ['Drama', 'Fantasy', 'Horror'],
    platform: 'Netflix',
    progress: 90,
    trending: true,
    lastWatched: '2024-01-10T20:15:00Z',
    tagline: 'Friends don\'t lie'
  },
  {
    id: '6',
    title: 'The Batman',
    type: 'movie',
    description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
    poster: 'https://images.pexels.com/photos/8111019/pexels-photo-8111019.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2022,
    rating: 8.2,
    runtime: 176,
    genres: ['Action', 'Crime', 'Drama'],
    platform: 'HBO Max',
    lastWatched: '2024-01-09T21:30:00Z',
    tagline: 'Unmask the truth'
  },
  {
    id: '7',
    title: 'The Mandalorian',
    type: 'tv',
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    poster: 'https://images.pexels.com/photos/8111120/pexels-photo-8111120.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2019,
    rating: 8.8,
    runtime: 40,
    genres: ['Action', 'Adventure', 'Fantasy'],
    platform: 'Disney+',
    progress: 65,
    trending: true,
    lastWatched: '2024-01-08T19:00:00Z',
    tagline: 'This is the Way'
  },
  {
    id: '8',
    title: 'Oppenheimer',
    type: 'movie',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster: 'https://images.pexels.com/photos/8111454/pexels-photo-8111454.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2023,
    rating: 8.9,
    runtime: 180,
    genres: ['Biography', 'Drama', 'History'],
    platform: 'Amazon Prime',
    lastWatched: '2024-01-07T20:45:00Z',
    tagline: 'The world forever changes'
  },
  {
    id: '9',
    title: 'Wednesday',
    type: 'tv',
    description: 'Wednesday Addams is sent to Nevermore Academy, where she attempts to master her psychic powers and solve a supernatural mystery.',
    poster: 'https://images.pexels.com/photos/4009429/pexels-photo-4009429.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2022,
    rating: 8.1,
    runtime: 50,
    genres: ['Comedy', 'Crime', 'Family'],
    platform: 'Netflix',
    progress: 30,
    trending: true,
    lastWatched: '2024-01-06T21:15:00Z',
    tagline: 'Smart, sarcastic and a little dead inside'
  },
  {
    id: '10',
    title: 'Avatar: The Way of Water',
    type: 'movie',
    description: 'Jake Sully and Ney\'tiri have formed a family and are doing everything to stay together. However, they must leave their home.',
    poster: 'https://images.pexels.com/photos/8111238/pexels-photo-8111238.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2022,
    rating: 7.8,
    runtime: 192,
    genres: ['Action', 'Adventure', 'Drama'],
    platform: 'Disney+',
    lastWatched: '2024-01-05T18:30:00Z',
    tagline: 'Return to Pandora'
  },
  {
    id: '11',
    title: 'The Last of Us',
    type: 'tv',
    description: 'Twenty years after modern civilization has been destroyed, Joel must smuggle Ellie out of an oppressive quarantine zone.',
    poster: 'https://images.pexels.com/photos/8111389/pexels-photo-8111389.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2023,
    rating: 9.1,
    runtime: 60,
    genres: ['Action', 'Adventure', 'Drama'],
    platform: 'HBO Max',
    progress: 85,
    trending: true,
    lastWatched: '2024-01-04T20:00:00Z',
    tagline: 'When you\'re lost in the darkness, look for the light'
  },
  {
    id: '12',
    title: 'Top Gun: Maverick',
    type: 'movie',
    description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a detachment of graduates for a specialized mission.',
    poster: 'https://images.pexels.com/photos/8111345/pexels-photo-8111345.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    year: 2022,
    rating: 8.7,
    runtime: 131,
    genres: ['Action', 'Drama'],
    platform: 'Amazon Prime',
    trending: true,
    lastWatched: '2024-01-03T19:30:00Z',
    tagline: 'Feel the need... The need for speed'
  }
];