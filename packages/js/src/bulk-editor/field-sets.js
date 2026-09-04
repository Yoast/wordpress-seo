import { __ } from "@wordpress/i18n";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, FOCUS_KEYPHRASE_KEY } from "./constants";

/**
 * The data for one content item shown in the bulk editor table.
 *
 * The editable fields map to Yoast post meta (prefix `_yoast_wpseo_`): `seoTitle` → `title`,
 * `metaDescription` → `metadesc`, `socialTitle` → `opengraph-title`, `socialDescription` →
 * `opengraph-description`.
 *
 * @typedef {Object} BulkEditorItem
 * @property {number} id                The post ID.
 * @property {string} title             The post title.
 * @property {string} status            The post status (e.g. "publish", "draft", "pending", "future" as WordPress terms).
 * @property {string} editLink          URL to edit the post in WordPress.
 * @property {string} focusKeyphrase    The Yoast focus keyphrase.
 * @property {string} seoTitle          The SEO title.
 * @property {string} metaDescription   The meta description.
 * @property {string} socialTitle       The social title.
 * @property {string} socialDescription The social description.
 * @property {boolean} editable         Whether the current user may edit the post; locked rows hide their SEO data.
 */

/**
 * One editable column within a field set.
 *
 * @typedef {Object} FieldSetField
 * @property {string}  key        The {@link BulkEditorItem} property this column edits.
 * @property {string}  label      The column header label.
 * @property {string}  param      The request parameter name the save endpoint expects for this field.
 * @property {string}  width      The column width.
 * @property {string}  [type]     "title" or "description" for replacement-variable fields; absent for plain text fields.
 * @property {string}  [endpoint] A data-provider endpoint key that saves this field, overriding the field set's
 *                                default endpoint.
 * @property {boolean} [readOnly] Whether the column is shown but cannot be opened for editing.
 */

/**
 * A tab's set of editable fields (which columns the table shows and edits).
 *
 * @typedef {Object} FieldSet
 * @property {string}          id       The field set identifier.
 * @property {string}          label    The tab label.
 * @property {string}          endpoint The default data-provider endpoint for saving this set's fields; a field may override it.
 * @property {FieldSetField[]} fields   The editable columns, in display order.
 */

/**
 * Builds the field sets for the two bulk editor tabs.
 *
 * Returns a factory (not a constant) so labels are translated at call time rather than at module load.
 *
 * @param {Object}  [props]                             The props.
 * @param {boolean} [props.isKeywordAnalysisActive=true] Whether the SEO analysis is enabled.
 *
 * @returns {Object<string, FieldSet>} The field sets, keyed by id.
 */
export const getFieldSets = ( { isKeywordAnalysisActive = true } = {} ) => {
	const focusKeyphrase = {
		key: FOCUS_KEYPHRASE_KEY,
		label: __( "Focus keyphrase", "wordpress-seo" ),
		param: "focus_keyphrase",
		width: "sm:yst-w-[19%]",
		// The column keeps showing the keyphrase, but with the SEO analysis off there is nothing to edit it
		// against, so it never opens for editing. The post editor hides its field entirely; this diverges on purpose.
		readOnly: ! isKeywordAnalysisActive,
	};

	return {
		[ FIELD_SET_SEARCH ]: {
			id: FIELD_SET_SEARCH,
			label: __( "Search appearance", "wordpress-seo" ),
			endpoint: "update_search",
			fields: [
				focusKeyphrase,
				{ key: "seoTitle", label: __( "SEO title", "wordpress-seo" ), param: "seo_title", width: "sm:yst-w-[19%]", type: "title" },
				{ key: "metaDescription", label: __( "Meta description", "wordpress-seo" ), param: "meta_description", width: "sm:yst-w-[33%]", type: "description" },
			],
		},
		[ FIELD_SET_SOCIAL ]: {
			id: FIELD_SET_SOCIAL,
			label: __( "Social appearance", "wordpress-seo" ),
			endpoint: "update_social",
			fields: [
				focusKeyphrase,
				{ key: "socialTitle", label: __( "Social title", "wordpress-seo" ), param: "social_title", width: "sm:yst-w-[19%]", type: "title" },
				{ key: "socialDescription", label: __( "Social description", "wordpress-seo" ), param: "social_description", width: "sm:yst-w-[33%]", type: "description" },
			],
		},
	};
};
