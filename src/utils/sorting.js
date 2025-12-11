export function getSortingLocale(selectedLanguage) {
  switch (selectedLanguage) {
    case "french":  return "fr";
    case "english": return "en";
    case "local":   return "ja";
    case "latin":   return "la";
    default:        return "en";
  }
}

export function getEntryName(entry, selectedLanguage) {
  switch (selectedLanguage) {
    case "french":  return entry.french;
    case "english": return entry.english;
    case "local":   return entry.japanese;
    case "latin":   return entry.latin;
    default:        return entry.english;
  }
}

function sortEntriesByName(entries, selectedLanguage, order = "name-asc") {
  const locale = getSortingLocale(selectedLanguage);

  return [...entries].sort((a, b) => {
    const nameA = getEntryName(a, selectedLanguage) || "";
    const nameB = getEntryName(b, selectedLanguage) || "";

    return order === "name-asc"
      ? nameA.localeCompare(nameB, locale)
      : nameB.localeCompare(nameA, locale);
  });
}

function sortEntriesByDate(entries, mode = "date-new") {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (mode === "date-new") 
      return dateB - dateA; // newest first

    if (mode === "date-old")
      return dateA - dateB; // oldest first

    return 0;
  });
}

export function sortEntries(entries, selectedLanguage, sortMode) {

  if (sortMode === "name-asc" || sortMode === "name-desc")
    return sortEntriesByName(entries, selectedLanguage, sortMode);

  if (sortMode === "date-new" || sortMode === "date-old")
    return sortEntriesByDate(entries, sortMode);

  return entries;
}