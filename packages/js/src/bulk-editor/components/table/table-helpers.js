import { __ } from "@wordpress/i18n";

/**
 * Maps a post status to a label, or "" for published (no label shown).
 *
 * @param {string} status The post status.
 *
 * @returns {string} The label, or "" when nothing should be shown.
 */
export const getStatusLabel = ( status ) => {
	switch ( status ) {
		case "draft":
			return __( "Draft", "wordpress-seo" );
		case "pending":
			return __( "Pending", "wordpress-seo" );
		case "future":
			return __( "Scheduled", "wordpress-seo" );
		default:
			return "";
	}
};

/**
 * The fixed columns (select + title + actions); the field set supplies the rest, including the focus keyphrase.
 *
 * @param {FieldSetField[]} fields The active field set's editable columns.
 *
 * @returns {number} The total number of columns, used for full-width rows (loading/empty).
 */
export const getColumnCount = ( fields ) => 3 + fields.length;

const EMPTY_ROW_EDIT = { openFields: [], draft: {}, savingFields: {} };

/**
 * Resolves what a row needs to render its editing UI: whether it is being edited, plus its open fields, draft
 * values and the map of fields currently saving. Falls back to empty values when the row has no edit in progress.
 *
 * @param {Object} [edit] The row's edit state ({ openFields, draft, savingFields }), or undefined when not editing.
 *
 * @returns {{isEditing: boolean, openFields: string[], draft: Object, savingFields: Object}} The row's editing state.
 */
export const getRowEditState = ( edit ) => ( {
	isEditing: Boolean( edit ),
	...( edit ?? EMPTY_ROW_EDIT ),
} );
