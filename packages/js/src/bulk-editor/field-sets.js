import { __ } from "@wordpress/i18n";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL } from "./constants";

/**
 * The data for one content item shown in the bulk editor table.
 *
 * The editable fields map to Yoast post meta (prefix `_yoast_wpseo_`): `seoTitle` → `title`,
 * `metaDescription` → `metadesc`, `socialTitle` → `opengraph-title`, `socialDescription` →
 * `opengraph-description`.
 *
 * @typedef {Object} BulkEditorRow
 * @property {number} id                The post ID.
 * @property {string} title             The post title.
 * @property {string} status            The post status (e.g. "publish", "draft", "pending", "future" as WordPress terms).
 * @property {string} editLink          URL to edit the post in WordPress.
 * @property {string} focusKeyphrase    The Yoast focus keyphrase.
 * @property {string} seoTitle          The SEO title.
 * @property {string} metaDescription   The meta description.
 * @property {string} socialTitle       The social title.
 * @property {string} socialDescription The social description.
 */

/**
 * One editable column within a field set.
 *
 * @typedef {Object} FieldSetField
 * @property {string} key   The {@link BulkEditorRow} property this column edits.
 * @property {string} label The column header label.
 * @property {string} param The request parameter name the save endpoint expects for this field.
 */

/**
 * A tab's set of editable fields (which columns the table shows and edits).
 *
 * @typedef {Object} FieldSet
 * @property {string}          id       The field set identifier.
 * @property {string}          label    The tab label.
 * @property {string}          endpoint The data-provider endpoint key that saves this field.
 * @property {FieldSetField[]} fields   The editable columns, in display order.
 */

/**
 * Builds the field sets for the two bulk editor tabs.
 *
 * Returns a factory (not a constant) so labels are translated at call time rather than at module load.
 *
 * @returns {Object<string, FieldSet>} The field sets, keyed by id.
 */
export const getFieldSets = () => ( {
	[ FIELD_SET_SEARCH ]: {
		id: FIELD_SET_SEARCH,
		label: __( "Search appearance", "wordpress-seo" ),
		endpoint: "update_search",
		fields: [
			{ key: "seoTitle", label: __( "SEO title", "wordpress-seo" ), param: "seo_title" },
			{ key: "metaDescription", label: __( "Meta description", "wordpress-seo" ), param: "meta_description" },
		],
	},
	[ FIELD_SET_SOCIAL ]: {
		id: FIELD_SET_SOCIAL,
		label: __( "Social appearance", "wordpress-seo" ),
		endpoint: "update_social",
		fields: [
			{ key: "socialTitle", label: __( "Social title", "wordpress-seo" ), param: "social_title" },
			{ key: "socialDescription", label: __( "Social description", "wordpress-seo" ), param: "social_description" },
		],
	},
} );
