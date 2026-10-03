/* global elementor */
/**
 * @returns {number} The post ID in the Yoast form.
 */
export const getFormPostId = () => parseInt( document.getElementById( "post_ID" )?.value, 10 );

/**
 * @param {number} id The ID to check.
 *
 * @returns {boolean} True if the given ID is the form' post ID.
 */
export const isFormId = ( id ) => getFormPostId() === id;

/**
 * @returns {boolean} True if the form ID is equal to the current document ID.
 */
export const isFormIdEqualToDocumentId = () => isFormId( elementor.documents.getCurrent()?.id );
