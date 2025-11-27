

import birdIcon from "../assets/icons/bird.png";
import mammalIcon from "../assets/icons/mammal.png";
import reptileIcon from "../assets/icons/reptile.png";
import amphibianIcon from "../assets/icons/amphibian.png";
import insectIcon from "../assets/icons/insect.png";
import fishIcon from "../assets/icons/fish.png";
import otherIcon from "../assets/icons/other.png";


import observationIcon from "../assets/icons/observation.png";
import photoIcon from "../assets/icons/photo.png";
import tracksIcon from "../assets/icons/tracks.png";


export const CATEGORIES = [
  { id: "bird", label: "Bird", icon: birdIcon },
  { id: "mammal", label: "Mammal", icon: mammalIcon },
  { id: "reptile", label: "Reptile", icon: reptileIcon },
  { id: "amphibian", label: "Amphibian", icon: amphibianIcon },
  { id: "insect", label: "Insect", icon: insectIcon },
  { id: "fish", label: "Fish", icon: fishIcon },
  { id: "other", label: "Other", icon: otherIcon },
];

export const CAPTURE_LEVELS = [
  { id: 1, label: "observation", icon: observationIcon },
  { id: 2, label: "photo", icon: photoIcon },
  { id: 3, label: "tracks", icon: tracksIcon },
];

export const STORAGE_KEY = "visual_pokedex_entries_v1";

export const iconHeight = 20;
export const iconWidth = 20;