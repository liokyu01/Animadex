import { CATEGORIES } from "../data/Constants";

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
  
  if (sortMode === "category")
    return sortByCategoryFamilyName(entries, selectedLanguage);

  return entries;
}

const categoryLabelMap = Object.fromEntries(
  CATEGORIES.map(cat => [cat.id, cat.label])
);

function sortByCategoryFamilyName(entries, selectedLanguage) {
  const locale = getSortingLocale(selectedLanguage);

  return [...entries].sort((a, b) => {
    const catA = categoryLabelMap[a.category] || "";
    const catB = categoryLabelMap[b.category] || "";

    // 1) Sort by category label
    const catCmp = catA.localeCompare(catB, "en");
    if (catCmp !== 0) return catCmp;

    // 2) Sort by family (Latin)
    const famA = a.family || "";
    const famB = b.family || "";
    const famCmp = famA.localeCompare(famB, "la"); 
    if (famCmp !== 0) return famCmp;

    // 3) Sort by species name in currently selected language
    const nameA = getEntryName(a, selectedLanguage) || "";
    const nameB = getEntryName(b, selectedLanguage) || "";
    return nameA.localeCompare(nameB, locale);
  });
}