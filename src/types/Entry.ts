
export interface LocationEntry {
  country: string;
  region: string;
  subRegion: string;
}

export interface Entry {
      id: string,
      image: string,
      latin: string,
      english: string,
      french: string,
      japanese: string,
      category: string,
      locations: LocationEntry[],
      capture: string,
      date: string,
      notes: string,
      infoLink: string
}