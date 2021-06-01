import { get } from "lodash";

/** Returns true if the modalKey is in openedModal, false otherwise.
 *
 * @param {Object} state The state.
 * @param {Object} modalKey The key for the modal to check opened state for.
 *
 * @returns {Boolean} Whether or not the modal is open.
 */
export const getIsModalOpen = ( state, modalKey ) => get( state, "editorModals.openedModal", "" ) === modalKey;
