/**
 * Gets the part of the html that we want to apply the marking to.
 *
 * @param {array}   marks  The array of mark objects.
 * @param {string}  html   The html of the page where we want to apply the marking to.
 *
 * @returns {{selectedHTML: *[], fieldsToMark: *}} The selected part of the html we want to apply the marking to.
 */
export function getFieldsToMark(marks: array, html: string): {
    selectedHTML: any[];
    fieldsToMark: any;
};
