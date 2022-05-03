export { default as authorFirstName } from "./authorFirstName";
export { default as authorLastName } from "./authorLastName";
export { default as currentDate } from "./currentDate";
export { default as currentDay } from "./currentDay";
export { default as currentMonth } from "./currentMonth";
export { default as category } from "./category";
export { default as categoryTitle } from "./categoryTitle";
export { default as currentYear } from "./currentYear";
export { default as date } from "./date";
export { default as excerpt } from "./excerpt";
export { default as focusKeyphrase } from "./focusKeyphrase";
export { default as id } from "./id";
export { default as modified } from "./modified";
export { default as name } from "./name";
export { default as page } from "./page";
export { default as pageNumber } from "./pageNumber";
export { default as pageTotal } from "./pageTotal";
export { default as permalink } from "./permalink";
export { default as postContent } from "./postContent";
export { default as postDay } from "./postDay";
export { default as postMonth } from "./postMonth";
export { default as postYear } from "./postYear";
export { default as postTypeNamePlural } from "./postTypeNamePlural";
export { default as postTypeNameSingular } from "./postTypeNameSingular";
export { default as primaryCategory } from "./primaryCategory";
export { default as searchPhrase } from "./searchPhrase";
export { default as separator } from "./separator";
export { default as siteDescription } from "./siteDescription";
export { default as siteName } from "./siteName";
export { default as tag } from "./tag";
export { default as term404 } from "./term404";
export { default as termDescription } from "./termDescription";
export { default as termHierarchy } from "./termHierarchy";
export { default as termTitle } from "./termTitle";
export { default as title } from "./title";
export { default as userDescription } from "./userDescription";

/*
 * Exports all the general replacement variables.
 *
 * A replacement variable should be an Object with:
 * @param {string} name             The name as used in PHP. Communicated to JS via the reommended replacement variables.
 * @param {string} label            The user-friendly name.
 * @param {string} placeholder      The string that will be replaced.
 * @param {string[]} aliases        Aliases for this replacement variable.
 * @param {function} getReplacement Function that return the replacement value.
 * @param {RegExp} regexp           The regular expression that matches the placeholder.
 */
