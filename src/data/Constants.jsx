

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

import flagW from "../assets/flags/world.png";
import flagUK from "../assets/flags/uk.png";
import flagFR from "../assets/flags/fr.png";
import flagJP from "../assets/flags/jp.png"; 

export const CATEGORIES = [
  { id: "bird", label: "Bird", icon: birdIcon, color: "#436b85ff" },
  { id: "mammal", label: "Mammal", icon: mammalIcon, color: "#9e2424ff" },
  { id: "reptile", label: "Reptile", icon: reptileIcon, color: "#1d7970ff" },
  { id: "amphibian", label: "Amphibian", icon: amphibianIcon, color: "#569153ff" },
  { id: "insect", label: "Insect", icon: insectIcon, color: "#798727ff" },
  { id: "fish", label: "Fish", icon: fishIcon, color: "#113c80ff" },
  { id: "other", label: "Other", icon: otherIcon, color: "#9e9e9eff" },
];

export const CAPTURE_LEVELS = [
  { id: "observation", label: "observation", icon: observationIcon },
  { id: "photo", label: "photo", icon: photoIcon },
  { id: "tracks", label: "tracks", icon: tracksIcon },
];

export const COUNTRIES = [
  { id: "japan", label: "Japan", flagIcon: "../assets/flags/jp.png"},
  { id: "singapore", label: "Singapore", flagIcon: "../assets/flags/sg.png"},
];

export const NAMING_OPTION = [
  { id: "latin", label: "Scientific name", flagIcon:flagW},
  { id: "english", label: "English", flagIcon: flagUK},
  { id: "french", label: "French", flagIcon: flagFR},
  { id: "japanese", label: "Local", flagIcon: flagJP},
];

export const STORAGE_KEY = "visual_pokedex_entries_v1";

export const iconHeight = 20;
export const iconWidth = 20;

