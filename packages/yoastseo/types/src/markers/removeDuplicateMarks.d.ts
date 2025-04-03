export default removeDuplicateMarks;
/**
 * Removes duplicate marks from an array.
 * If the marks object have position information, however,
 * we don't want to remove the duplicated objects with the same original strings.
 *
 * @param {Array} marks The marks to remove duplications from.
 *
 * @returns {Array} A list of de-duplicated marks.
 */
declare function removeDuplicateMarks(marks: any[]): any[];
