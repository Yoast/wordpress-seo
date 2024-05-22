import { get } from "lodash";
import initEditorStore from "../../initializers/editor-store";
import { DEFAULT_METADATA_NAME, defaultMetadataReducer, defaultMetadataSelectors, getInitialDefaultMetadataState } from "./default-metadata";
import { primaryTermActions, primaryTermSelectors } from "./primary-term";

/**
 * Initializes the Yoast SEO editor store for the WooCommerce editor.
 * @returns {Object} The store.
 */
export const initializeStore = () => initEditorStore( {
	reducers: {
		[ DEFAULT_METADATA_NAME ]: defaultMetadataReducer,
	},
	actions: primaryTermActions,
	selectors: {
		...defaultMetadataSelectors,
		...primaryTermSelectors,
	},
	initialState: {
		[ DEFAULT_METADATA_NAME ]: get( window, "wpseoScriptData.defaultMetadata", getInitialDefaultMetadataState() ),
	},
} );
