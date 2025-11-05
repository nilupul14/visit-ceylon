import React from "react";
import VisitCeylonMap from "../components/VisitCeylonMap";

const ExploreMap = () => {

  const locationData = [
    {
      _id: "324544",
      title: "Sigiriya Rock Fortress (Lion Rock)",
      tagline: "Climb the Lion Rock and see the kingdom above the jungle.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761894972/linerock_bpb0j9.png",
      price: 15,
      lat: 7.957,
      lng: 80.7603
    },
    {
      _id: "1232546",
      title: "Horton Plains & World's End",
      tagline: "Walk above the clouds in Sri Lanka’s highlands.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761897193/HortonPalins_jv2ea7.png",
      price: 10,
      lat: 6.8021,
      lng: 80.8022
    },
    {
      _id: "986056-d",
      title: "Anuradhapura Sacred City",
      tagline: "Explore Sri Lanka’s first great capital.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902201/Anuradhapura_q45l8y.png",
      price: 12,
      lat: 8.3114,
      lng: 80.4037
    },
    {
      _id: "2001",
      title: "Pinnawala Elephant Orphanage",
      tagline: "Watch the gentle giants bathe by the river.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910590/Pinnawala_i35qwa.png",
      price: 5,
      lat: 7.3017,
      lng: 80.383
    },
    {
      _id: "2002",
      title: "Wipattu National Park & Safari",
      tagline: "Sri Lanka’s big-cat country.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912600/WilpattuPark_vikolh.png",
      price: 20,
      lat: 8.4887,
      lng: 80.0255
    },
    {
      _id: "2003",
      title: "Minneriya Elephant Gathering",
      tagline: "Hundreds of elephants on one grassland.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912606/MinneriyaPark_salvlo.png",
      price: 10,
      lat: 8.0353,
      lng: 80.8203
    },
    {
      _id: "2004",
      title: "Colombo Lotus Tower (Nelum Kuluna)",
      tagline: "Colombo from the sky.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761912747/LotusTower_ycwjfk.png",
      price: 15,
      lat: 6.9273,
      lng: 79.861
    },
    {
      _id: "2005",
      title: "Pidurangala Rock",
      tagline: "Face-to-face with Sigiriya at sunrise.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895485/Pidurangala_mjm8ta.png",
      price: 10,
      lat: 7.962,
      lng: 80.744
    },
    {
      _id: "2006",
      title: "Ella Train & Nine Arch Bridge",
      tagline: "Sri Lanka’s most photogenic train crossing.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895483/NineArchBridge_mtd7ef.png",
      price: 24,
      lat: 6.867,
      lng: 81.0596
    },
    {
      _id: "2007",
      title: "Nuwara Eliya Tea Fields",
      tagline: "Mist, tea, and colonial charm.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910874/NuwaraeliyaTeaFields_lajwyd.png",
      price: 13,
      lat: 6.9497,
      lng: 80.7891
    },
    {
      _id: "2008",
      title: "Pigeon Island Marine National Park - Trincomalee",
      tagline: "Snorkel with reef fish off Nilaveli.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761910985/PigeonIsland_evgonz.png",
      price: 10,
      lat: 8.7213,
      lng: 81.1888
    },
    {
      _id: "2009",
      title: "Arugam Bay Surf Point",
      tagline: "Ride Sri Lanka’s east-coast waves.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761911625/Arugambay_lkkpzx.png",
      price: 10,
      lat: 6.839,
      lng: 81.833
    },
    {
      _id: "668489",
      title: "Temple of the Tooth Relic (Sri Dalada Maligawa)",
      tagline: "Sri Lanka’s most sacred Buddhist shrine in the hill capital.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761895584/DaladaMaligawa_owkvs2.png",
      price: 10,
      lat: 7.2936,
      lng: 80.6413
    },
    {
      _id: "552524",
      title: "Yala National Park & Safari",
      tagline: "Spot leopards and elephants in the wild.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902341/YalaSafari_voqaht.png",
      price: 10,
      lat: 6.3619,
      lng: 81.52
    },
    {
      _id: "950387",
      title: "Polonnaruwa Ancient City",
      tagline: "Cycle through Sri Lanka’s royal past.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901896/Polonnaruwa_k3rwkg.png",
      price: 10,
      lat: 7.9396,
      lng: 81.0003
    },
    {
      _id: "575265",
      title: "Galle Fort & Dutch Museum",
      tagline: "Colonial charm by the sea.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761901495/GallePort-BG_hxwb18.png",
      price: 10,
      lat: 6.0269,
      lng: 80.217
    },
    {
      _id: "986056",
      title: "Dambulla Cave Temple",
      tagline: "Ancient cave paintings and Buddha statues on a hilltop.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903282/DambullaCaveTemple_aumvey.png",
      price: 10,
      lat: 7.8554,
      lng: 80.649
    },
    {
      _id: "986056-a",
      title: "Ambuluwawa Tower",
      tagline: "Climb the spiral tower above the hills.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761902937/AmbuluwawaTower_gdmsev.png",
      price: 10,
      lat: 7.164,
      lng: 80.5626
    },
    {
      _id: "986056-b",
      title: "Coconut Tree Hill (Mirissa)",
      tagline: "Most photographed coconut spot in Sri Lanka.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761897191/CoconutTreeHills_julzmh.png",
      price: 10,
      lat: 5.9396,
      lng: 80.4594
    },
    {
      _id: "986056-c",
      title: "Sinharaja Rainforest",
      tagline: "Step into Sri Lanka’s last primary rainforest.",
      poster_path:
        "https://res.cloudinary.com/dirqkqwps/image/upload/v1761903125/SinharajaRainForest_mqp6ia.png",
      price: 10,
      lat: 6.4214,
      lng: 80.4589
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-2xl font-bold mb-4">Explore Sri Lanka</h1>
      {!locationData.length ? (
        <p className="text-gray-500">⏳ Fetching map locations...</p>
      ) : (
        <VisitCeylonMap destinations={locationData} height="560px" />
      )}
    </div>
  );
};

export default ExploreMap;
