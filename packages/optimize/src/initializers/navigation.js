import { __, sprintf } from "@wordpress/i18n";
import { DocumentIcon } from "@heroicons/react/outline";
import { merge, reduce } from "lodash";

import ContentListPage from "../components/pages/content-list";

export const defaultNavigation = {};

/**
 * @param {Object} contentTypes Object of content types.
 * @returns {Object} Content types navigation object.
 */
const createContentTypesNavigation = ( contentTypes ) => reduce(
	contentTypes,
	( contentTypesNavigation, contentType, key ) => ( {
		...contentTypesNavigation,
		[ key ]: {
			key: contentType.slug,
			target: contentType.slug,
			label: contentType.label,
			icon: contentType.icon || DocumentIcon,
			priority: contentType.priority || 10,
			isDefaultOpen: true,
			children: [ {
				key: contentType.slug,
				target: contentType.slug,
				// translators: %1$s is replaced by the content type label (plural)
				label: sprintf( __( "All %1$s", "admin-ui" ), contentType.label ),
				priority: 10,
				component: ContentListPage,
				props: { contentType },
			} ],
		},
	} ),
	{},
);

/**
 * Sets the basic navigation on the window.
 *
 * @param {Object} options Options object.
 * @param {Object} options.navigation The navigation passed from the options.
 *
 * @returns {Object} The merged initial navigation.
 */
export default function initializeNavigation( { navigation, contentTypes } ) {
	const contentTypesNavigation = createContentTypesNavigation( contentTypes );
	// Merge the custom navigation with our initial navigations to produce the final navigation.
	return merge( {}, defaultNavigation, contentTypesNavigation, navigation );
}
