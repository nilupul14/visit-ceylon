import logo from './logo.svg'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profile from './profile.png'
import visitCeylonLogo from './visitCeylonLogo.png'

export const assets = {
    logo,
    marvelLogo,
    googlePlay,
    appStore,
    screenImage,
    profile,
    visitCeylonLogo
}

export const dummyTrailers = [
    {
        image: "https://img.youtube.com/vi/sprotb7pjOE/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=sprotb7pjOE'
    },
    {
        image: "https://img.youtube.com/vi/8g9ccCkT-u0/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=8g9ccCkT-u0'
    },
    {
        image: "https://img.youtube.com/vi/7h4wud3HMZQ/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=7h4wud3HMZQ'
    },
    {
        image: "https://img.youtube.com/vi/TlypXY8OOIQ/maxresdefault.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=TlypXY8OOIQ'
    },
]

// const dummyCastsData = [
//     { "name": "Milla Jovovich", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg", },
//     { "name": "Dave Bautista", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg", },
//     { "name": "Arly Jover", "profile_path": "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg", },
//     { "name": "Amara Okereke", "profile_path": "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg", },
//     { "name": "Fraser James", "profile_path": "https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg", },
//     { "name": "Deirdre Mullins", "profile_path": "https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg", },
//     { "name": "Sebastian Stankiewicz", "profile_path": "https://image.tmdb.org/t/p/original/hLN0Ca09KwQOFLZLPIEzgTIbqqg.jpg", },
//     { "name": "Tue Lunding", "profile_path": "https://image.tmdb.org/t/p/original/qY4W0zfGBYzlCyCC0QDJS1Muoa0.jpg", },
//     { "name": "Jacek Dzisiewicz", "profile_path": "https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg", },
//     { "name": "Ian Hanmore", "profile_path": "https://image.tmdb.org/t/p/original/yhI4MK5atavKBD9wiJtaO1say1p.jpg", },
//     { "name": "Eveline Hall", "profile_path": "https://image.tmdb.org/t/p/original/uPq4xUPiJIMW5rXF9AT0GrRqgJY.jpg", },
//     { "name": "Kamila Klamut", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg", },
//     { "name": "Caoilinn Springall", "profile_path": "https://image.tmdb.org/t/p/original/uZNtbPHowlBYo74U1qlTaRlrdiY.jpg", },
//     { "name": "Jan Kowalewski", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg", },
//     { "name": "Pawel Wysocki", "profile_path": "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg", },
//     { "name": "Simon Lööf", "profile_path": "https://image.tmdb.org/t/p/original/cbZrB8crWlLEDjVUoak8Liak6s.jpg", },
//     { "name": "Tomasz Cymerman", "profile_path": "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg", }
// ]

export const dummyShowsData = [
    {
      _id: "324544",
      id: 324544,
      title: "Sigiriya Rock Fortress (Lion Rock)",
      description:
        "Ancient royal citadel built by King Kashyapa (5th century AD), famous for its dramatic rock summit, mirror wall, water gardens, and the world-famous Sigiriya frescoes. Located in Sri Lanka’s Cultural Triangle, it’s a UNESCO World Heritage Site and one of the must-visit viewpoints for sunrise/sunset.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761894972/linerock_bpb0j9.png",
      backdrop_path: "https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
      category: [
        { id: 1, name: "UNESCO Heritage" },
        { id: 2, name: "Historical" },
        { id: 3, name: "Viewpoint" },
      ],
      tagline: "Climb the Lion Rock and see the kingdom above the jungle.",
      vote_average: 6.4,
      vote_count: 15000,
      runtime: 102,
    },
    {
      _id: "1232546",
      id: 1232546,
      title: "Horton Plains & World's End",
      description:
        "Highland national park in Nuwara Eliya famous for the World’s End cliff (sheer drop ~870 m), Baker’s Falls, and cool misty weather. Ideal for early-morning hikes, nature lovers, and birdwatching. Best visited before 9 AM for clear views.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761897193/HortonPalins_jv2ea7.png",
      backdrop_path: "https://image.tmdb.org/t/p/original/icFWIk1KfkWLZnugZAJEDauNZ94.jpg",
      category: [
        { id: 4, name: "Nature" },
        { id: 5, name: "Hiking" },
        { id: 6, name: "Scenic" },
      ],
      tagline: "Walk above the clouds in Sri Lanka’s highlands.",
      vote_average: 6.405,
      vote_count: 18000,
      runtime: 103,
    },
    {
      _id: "668489",
      id: 668489,
      title: "Temple of the Tooth Relic (Sri Dalada Maligawa)",
      description:
        "The most sacred Buddhist temple in Kandy, housing the Tooth Relic of the Buddha. Features traditional Kandyan architecture, daily puja ceremonies, and the annual Esala Perahera. A key cultural and religious stop for any traveler.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895584/DaladaMaligawa_owkvs2.png",
      backdrop_path: "https://image.tmdb.org/t/p/original/65MVgDa6YjSdqzh7YOA04mYkioo.jpg",
      category: [
        { id: 7, name: "Religious" },
        { id: 1, name: "UNESCO Heritage" },
        { id: 8, name: "Cultural" },
      ],
      tagline: "Sri Lanka’s most sacred Buddhist shrine in the hill capital.",
      vote_average: 6.537,
      vote_count: 35960,
      runtime: 107,
    },
    {
      _id: "552524",
      id: 552524,
      title: "Yala National Park & Safari",
      description:
        "Sri Lanka’s most popular wildlife park, famous for one of the highest leopard densities in Asia. See elephants, sloth bears, crocodiles, deer, and lots of birds. Ideal for 4x4 jeep safaris at sunrise or sunset.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902341/YalaSafari_voqaht.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902341/YalaSafari_voqaht.png",
      category: [
        { id: 9, name: "Wildlife" },
        { id: 10, name: "Safari" },
        { id: 4, name: "Nature" },
      ],
      tagline: "Spot leopards and elephants in the wild.",
      vote_average: 7.117,
      vote_count: 27500,
      runtime: 108,
    },
    {
      _id: "950387",
      id: 950387,
      title: "Polonnaruwa Ancient City",
      description:
        "Medieval capital of Sri Lanka (11–13th century) with well-preserved ruins: Gal Vihara rock Buddha statues, Royal Palace, Parakrama Samudraya, and stupas. Best explored by bicycle. Another jewel in the Cultural Triangle.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901896/Polonnaruwa_k3rwkg.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901896/Polonnaruwa_k3rwkg.png",
      category: [
        { id: 1, name: "UNESCO Heritage" },
        { id: 2, name: "Historical" },
        { id: 11, name: "Archaeology" },
      ],
      tagline: "Cycle through Sri Lanka’s royal past.",
      vote_average: 6.516,
      vote_count: 15225,
      runtime: 101,
    },
    {
      _id: "575265",
      id: 575265,
      title: "Galle Fort & Dutch Museum",
      description:
        "Seaside Dutch-built fortress (17th century) on Sri Lanka’s south coast. Cobbled streets, colonial mansions, cafes, boutiques, ramparts, lighthouse, and museums. Perfect for sunset walks and photos.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901495/GallePort-BG_hxwb18.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901495/GallePort-BG_hxwb18.png",
      category: [
        { id: 12, name: "Coastal" },
        { id: 8, name: "Cultural" },
        { id: 2, name: "Historical" },
      ],
      tagline: "Colonial charm by the sea.",
      vote_average: 7.042,
      vote_count: 19885,
      runtime: 170,
    },
    {
      _id: "986056",
      id: 986056,
      title: "Dambulla Cave Temple",
      description:
        "Rock temple complex with 5 main caves covered in ancient Buddhist murals and over 150 statues. Often visited on the same day as Sigiriya. Offers panoramic views over the plains.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903282/DambullaCaveTemple_aumvey.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903282/DambullaCaveTemple_aumvey.png",
      category: [
        { id: 1, name: "UNESCO Heritage" },
        { id: 7, name: "Religious" },
        { id: 8, name: "Cultural" },
      ],
      tagline: "Ancient cave paintings and Buddha statues on a hilltop.",
      vote_average: 7.443,
      vote_count: 23569,
      runtime: 127,
    },
    {
      _id: "986056-a",
      id: 9860561,
      title: "Ambuluwawa Tower",
      description:
        "Unique multi-religious tower near Gampola, famous for the spiral stairway to the top and 360° views of Sri Lanka’s central hills. Great for photos, not for people afraid of heights 😅.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902937/AmbuluwawaTower_gdmsev.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902937/AmbuluwawaTower_gdmsev.png",
      category: [
        { id: 3, name: "Viewpoint" },
        { id: 4, name: "Nature" },
      ],
      tagline: "Climb the spiral tower above the hills.",
      vote_average: 7.443,
      vote_count: 23569,
      runtime: 127,
    },
    {
      _id: "986056-b",
      id: 9860562,
      title: "Coconut Tree Hill (Mirissa)",
      description:
        "Iconic red-soil cliff with rows of coconut trees overlooking the ocean in Mirissa. Super popular for sunrise/sunset photos, surfing nearby, and beach stays on the south coast.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761897191/CoconutTreeHills_julzmh.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761897191/CoconutTreeHills_julzmh.png",
      category: [
        { id: 12, name: "Coastal" },
        { id: 3, name: "Viewpoint" },
        { id: 13, name: "Instagram Spot" },
      ],
      tagline: "Most photographed coconut spot in Sri Lanka.",
      vote_average: 7.443,
      vote_count: 23569,
      runtime: 127,
    },
    {
      _id: "986056-c",
      id: 9860563,
      title: "Sinharaja Rainforest",
      description:
        "Primary lowland rainforest and UNESCO Biosphere Reserve with high endemism — ideal for nature walks, birding, and experiencing Sri Lanka’s tropical forest. Best with a local guide.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903125/SinharajaRainForest_mqp6ia.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903125/SinharajaRainForest_mqp6ia.png",
      category: [
        { id: 4, name: "Nature" },
        { id: 14, name: "Rainforest" },
        { id: 9, name: "Wildlife" },
      ],
      tagline: "Step into Sri Lanka’s last primary rainforest.",
      vote_average: 7.443,
      vote_count: 23569,
      runtime: 127,
    },
    {
      _id: "986056-d",
      id: 9860564,
      title: "Anuradhapura Sacred City",
      description:
        "Ancient capital and major Buddhist pilgrimage city with huge stupas (Ruwanwelisaya, Jetavanaramaya), sacred Bodhi tree, reservoirs, and monastic ruins. One of Sri Lanka’s most important heritage sites.",
      poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902201/Anuradhapura_q45l8y.png",
      backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902201/Anuradhapura_q45l8y.png",
      category: [
        { id: 1, name: "UNESCO Heritage" },
        { id: 7, name: "Religious" },
        { id: 2, name: "Historical" },
      ],
      tagline: "Explore Sri Lanka’s first great capital.",
      vote_average: 7.443,
      vote_count: 23569,
      runtime: 127,
    },
    {
        _id: "2001",
        id: 2001,
        title: "Pinnawala Elephant Orphanage",
        description:
          "One of Sri Lanka’s most visited animal-care attractions, home to rescued and orphaned elephants. Visitors can watch river bathing on the Ma Oya riverbank, bottle-feeding (at specific times), and learn about elephant conservation. Best visited in the morning when the herd goes to the river.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910590/Pinnawala_i35qwa.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910590/Pinnawala_i35qwa.png",
        category: [
          { id: 9, name: "Wildlife" },
          { id: 15, name: "Family Friendly" },
          { id: 8, name: "Cultural" },
        ],
        tagline: "Watch the gentle giants bathe by the river.",
        vote_average: 7.1,
        vote_count: 1240,
        runtime: 90,
      },
      {
        _id: "2002",
        id: 2002,
        title: "Wipattu National Park & Safari",
        description:
          "Signature jeep safari experience in Yala National Park, the most popular wildlife reserve in Sri Lanka. Known for high chances of spotting leopards, plus elephants, crocodiles, deer, sloth bear and rich birdlife. Ideal for sunrise or late-afternoon drives with an experienced tracker.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912600/WilpattuPark_vikolh.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912600/WilpattuPark_vikolh.png",
        category: [
          { id: 10, name: "Safari" },
          { id: 9, name: "Wildlife" },
          { id: 4, name: "Nature" },
        ],
        tagline: "Sri Lanka’s big-cat country.",
        vote_average: 7.6,
        vote_count: 2100,
        runtime: 120,
      },
      {
        _id: "2003",
        id: 2003,
        title: "Minneriya Elephant Gathering",
        description:
          "Seasonal wildlife spectacle (July–September) where hundreds of Asian elephants gather on the Minneriya tank bed to feed on fresh grass. One of the largest wild elephant gatherings in Asia. Ideal for evening safaris combined with Sigiriya/Polonnaruwa stays.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912606/MinneriyaPark_salvlo.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912606/MinneriyaPark_salvlo.png",
        category: [
          { id: 9, name: "Wildlife" },
          { id: 4, name: "Nature" },
          { id: 16, name: "Seasonal" },
        ],
        tagline: "Hundreds of elephants on one grassland.",
        vote_average: 7.8,
        vote_count: 980,
        runtime: 100,
      },
      {
        _id: "2004",
        id: 2004,
        title: "Colombo Lotus Tower (Nelum Kuluna)",
        description:
          "Sri Lanka’s tallest structure and a modern city landmark in Colombo. Offers 360° views of the skyline, Beira Lake and the port area. Features observation decks, lighting shows, dining and event spaces — great for sunset and night city shots.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912747/LotusTower_ycwjfk.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912747/LotusTower_ycwjfk.png",
        category: [
          { id: 17, name: "City" },
          { id: 3, name: "Viewpoint" },
          { id: 18, name: "Modern Landmark" },
        ],
        tagline: "Colombo from the sky.",
        vote_average: 7.2,
        vote_count: 760,
        runtime: 75,
      },
      {
        _id: "2005",
        id: 2005,
        title: "Pidurangala Rock",
        description:
          "A cheaper, quieter alternative to Sigiriya with one of the best sunrise views over the Lion Rock. Short but steep hike through a temple and boulders near the top. Perfect for photographers and travelers who want the Sigiriya view without the Sigiriya ticket.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895485/Pidurangala_mjm8ta.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895485/Pidurangala_mjm8ta.png",
        category: [
          { id: 5, name: "Hiking" },
          { id: 3, name: "Viewpoint" },
          { id: 4, name: "Nature" },
        ],
        tagline: "Face-to-face with Sigiriya at sunrise.",
        vote_average: 8.1,
        vote_count: 1540,
        runtime: 85,
      },
      {
        _id: "2006",
        id: 2006,
        title: "Ella Train & Nine Arch Bridge",
        description:
          "Iconic highlands shot near Ella where the blue train crosses a 1920s stone bridge surrounded by jungle tea country. Best times are scheduled train crossings in the morning or late afternoon. Often combined with Little Adam’s Peak and Ravana Falls.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895483/NineArchBridge_mtd7ef.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895483/NineArchBridge_mtd7ef.png",
        category: [
          { id: 4, name: "Nature" },
          { id: 19, name: "Railway" },
          { id: 13, name: "Instagram Spot" },
        ],
        tagline: "Sri Lanka’s most photogenic train crossing.",
        vote_average: 8.4,
        vote_count: 2300,
        runtime: 95,
      },
      {
        _id: "2007",
        id: 2007,
        title: "Nuwara Eliya Tea Fields",
        description:
          "Cool-climate hill town surrounded by rolling tea estates, colonial-era bungalows, and factories where you can watch tea plucking and processing. Great for soft hikes, photo walks, and tasting Ceylon tea straight from source.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910874/NuwaraeliyaTeaFields_lajwyd.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910874/NuwaraeliyaTeaFields_lajwyd.png",
        category: [
          { id: 20, name: "Tea Country" },
          { id: 4, name: "Nature" },
          { id: 6, name: "Scenic" },
        ],
        tagline: "Mist, tea, and colonial charm.",
        vote_average: 7.9,
        vote_count: 1400,
        runtime: 110,
      },
      {
        _id: "2008",
        id: 2008,
        title: "Pigeon Island Marine National Park - Trincomalee",
        description:
          "One of Sri Lanka’s best-known snorkeling spots, just off Nilaveli/Trincomalee. Famous for clear blue water, fringing coral reefs, reef fish, turtles and (sometimes) blacktip reef sharks in shallow water. Best visited in the east-coast season (May–September) with a licensed boat operator.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910985/PigeonIsland_evgonz.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910985/PigeonIsland_evgonz.png",
        category: [
          { id: 12, name: "Coastal" },
          { id: 21, name: "East Coast" },
          { id: 24, name: "Snorkeling" },
          { id: 15, name: "Family Friendly" },
        ],
        tagline: "Snorkel with reef fish off Nilaveli.",
        vote_average: 7.7,
        vote_count: 1040,
        runtime: 80,
      },
      {
        _id: "2009",
        id: 2009,
        title: "Arugam Bay Surf Point",
        description:
          "Sri Lanka’s surf capital on the east coast, famous for long right-hand point breaks (Main Point, Baby Point, Peanut Farm) and a laid-back beach vibe. Peak surf season is May–September. Also good for safaris to Kumana and lagoon trips.",
        poster_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761911625/Arugambay_lkkpzx.png",
        backdrop_path: "https://res.cloudinary.com/dirqkqwps/image/upload/v1761911625/Arugambay_lkkpzx.png",
        category: [
          { id: 22, name: "Surfing" },
          { id: 12, name: "Coastal" },
          { id: 21, name: "East Coast" },
        ],
        tagline: "Ride Sri Lanka’s east-coast waves.",
        vote_average: 8.0,
        vote_count: 1670,
        runtime: 120,
      },
  ]
  

export const dummyDateTimeData = {
    "2025-07-24": [
        { "time": "2025-07-24T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd1" },
        { "time": "2025-07-24T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd2" },
        { "time": "2025-07-24T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd3" }
    ],
    "2025-07-25": [
        { "time": "2025-07-25T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd4" },
        { "time": "2025-07-25T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd5" },
        { "time": "2025-07-25T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd6" }
    ],
    "2025-07-26": [
        { "time": "2025-07-26T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd7" },
        { "time": "2025-07-26T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd8" },
        { "time": "2025-07-26T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd9" }
    ],
    "2025-07-27": [
        { "time": "2025-07-27T01:00:00.000Z", "showId": "68395b407f6329be2bb45bda" },
        { "time": "2025-07-27T03:00:00.000Z", "showId": "68395b407f6329be2bb45bdb" },
        { "time": "2025-07-27T05:00:00.000Z", "showId": "68395b407f6329be2bb45bdc" }
    ]
}

export const dummyDashboardData = {
    "totalBookings": 14,
    "totalRevenue": 1517,
    "totalUser": 5,
    "activeShows": [
        {
            "_id": "68352363e96d99513e4221a4",
            "movie": dummyShowsData[0],
            "showDateTime": "2025-06-30T02:30:00.000Z",
            "showPrice": 59,
            "occupiedSeats": {
                "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "B1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "C1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
            },
        },
        {
            "_id": "6835238fe96d99513e4221a8",
            "movie": dummyShowsData[1],
            "showDateTime": "2025-06-30T15:30:00.000Z",
            "showPrice": 81,
            "occupiedSeats": {},
        },
        {
            "_id": "6835238fe96d99513e4221a9",
            "movie": dummyShowsData[2],
            "showDateTime": "2025-06-30T03:30:00.000Z",
            "showPrice": 81,
            "occupiedSeats": {},
        },
        {
            "_id": "6835238fe96d99513e4221aa",
            "movie": dummyShowsData[3],
            "showDateTime": "2025-07-15T16:30:00.000Z",
            "showPrice": 81,
            "occupiedSeats": {
                "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "A2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "A3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "A4": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
            },
        },
        {
            "_id": "683682072b5989c29fc6dc0d",
            "movie": dummyShowsData[4],
            "showDateTime": "2025-06-05T15:30:00.000Z",
            "showPrice": 49,
            "occupiedSeats": {
                "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "A2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "A3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "B1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "B2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
                "B3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
            },
            "__v": 0
        },
        {
            "_id": "68380044686d454f2116b39a",
            "movie": dummyShowsData[5],
            "showDateTime": "2025-06-20T16:00:00.000Z",
            "showPrice": 79,
            "occupiedSeats": {
                "A1": "user_2xl7eCSUHddibk5lRxfOtw9RMwX",
                "A2": "user_2xl7eCSUHddibk5lRxfOtw9RMwX"
            }
        }
    ]
}

export const dummyBookingData = [
    {
        "_id": "68396334fb83252d82e17295",
        "user": { "name": "GreatStack", },
        "show": {
            _id: "68352363e96d99513e4221a4",
            movie: dummyShowsData[0],
            showDateTime: "2025-06-30T02:30:00.000Z",
            showPrice: 59,
        },
        "amount": 98,
        "bookedSeats": ["D1", "D2"],
        "isPaid": false,
    },
    {
        "_id": "68396334fb83252d82e17295",
        "user": { "name": "GreatStack", },
        "show": {
            _id: "68352363e96d99513e4221a4",
            movie: dummyShowsData[0],
            showDateTime: "2025-06-30T02:30:00.000Z",
            showPrice: 59,
        },
        "amount": 49,
        "bookedSeats": ["A1"],
        "isPaid": true,
    },
    {
        "_id": "68396334fb83252d82e17295",
        "user": { "name": "GreatStack", },
        "show": {
            _id: "68352363e96d99513e4221a4",
            movie: dummyShowsData[0],
            showDateTime: "2025-06-30T02:30:00.000Z",
            showPrice: 59,
        },
        "amount": 147,
        "bookedSeats": ["A1", "A2","A3"],
        "isPaid": true,
    },
]
