import { createSlice } from "@reduxjs/toolkit";
import { useSelect } from "@wordpress/data";
import { useCallback, useReducer } from "@wordpress/element";
import { languageProcessing } from "yoastseo";
import {
	ASYNC_ACTION_STATUS,
	CONTENT_TYPE,
	EDIT_TYPE,
	FETCH_RESPONSE_STATUS,
	POST_TYPE,
	PREVIEW_TYPE,
	STORE_NAME_AI,
	STORE_NAME_EDITOR,
} from "../constants";
import { fetchSuggestions as pureFetchSuggestions, removesLocaleVariantSuffixes } from "../helpers";
import { useTypeContext } from "./use-type-context";

const slice = createSlice( {
	name: "suggestions",
	initialState: {
		// Loading status prevents jarring first render.
		status: ASYNC_ACTION_STATUS.loading,
		error: { code: 200, message: "" },
		entities: [],
		selected: "",
	},
	reducers: {
		setLoading: state => {
			state.status = ASYNC_ACTION_STATUS.loading;
		},
		setSuccess: ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.selected = payload[ 0 ];
			state.entities.push( ...payload );
		},
		setError: ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = payload;
		},
		setSelected: ( state, { payload } ) => {
			state.selected = payload;
		},
	},
} );

/**
 * Transforms a preview type to a platform.
 * @param {string} previewType The preview type. See PREVIEW_TYPE.
 * @returns {string} The platform.¬
 */
const transformPlatform = previewType => {
	switch ( previewType ) {
		case PREVIEW_TYPE.social:
			return "Facebook";
		case PREVIEW_TYPE.twitter:
			return "Twitter";
		default:
			return "Google";
	}
};

/**
 * Get product type as a prefix string or empty string if it's not a product.
 * @param {boolean} isWooCommerceActive The flag that indicate if it's woocommerce.
 * @param {string} postType The content being edited, either a title or a description. See EDIT_TYPE.
 * @returns {string} Product type prefix or empty string.
 */
const productPostTypePrefix = ( isWooCommerceActive, postType ) => {
	if ( isWooCommerceActive ) {
		switch ( postType ) {
			case POST_TYPE.product:
				return "product-";
			case POST_TYPE.productCategory:
			case POST_TYPE.productTag:
				return "product-taxonomy-";
		}
	}

	return "";
};

/**
 * Get suggestion type based on different parameter.
 * @param {string} editType The content being edited, either a title or a description. See EDIT_TYPE.
 * @param {boolean} isWooCommerceActive The flag that indicate if it's woocommerce.
 * @param {string} postType The post type. See POST_TYPE.
 * @param {string} contentType The content type. See CONTENT_TYPE.
 * @returns {string} The suggestion type.
 */
const getSuggestionType = ( editType, isWooCommerceActive, postType, contentType ) => {
	const editTypeStr = editType === EDIT_TYPE.description ? "meta-description" : "seo-title";
	let typeStr = productPostTypePrefix( isWooCommerceActive, postType );
	if ( ! ( typeStr && isWooCommerceActive ) && contentType === CONTENT_TYPE.term ) {
		typeStr = "taxonomy-";
	}

	return `${ typeStr }${ editTypeStr }`;
};

/**
 * @returns {Object} The suggestions' state and actions.
 */
export const useSuggestions = () => {
	const [ state, dispatch ] = useReducer( slice.reducer, slice.getInitialState() );
	const { editType, previewType, postType, contentType } = useTypeContext();
	const promptContent = useSelect( select => select( STORE_NAME_AI ).selectPromptContent(), [] );
	const { contentLocale, focusKeyphrase, isWooCommerceActive, isGutenberg, isElementor } = useSelect( select => ( {
		contentLocale: select( STORE_NAME_EDITOR ).getContentLocale(),
		focusKeyphrase: select( STORE_NAME_EDITOR ).getFocusKeyphrase(),
		isWooCommerceActive: select( STORE_NAME_EDITOR ).getIsWooCommerceActive(),
		isGutenberg: select( STORE_NAME_EDITOR ).getIsBlockEditor(),
		isElementor: select( STORE_NAME_EDITOR ).getIsElementorEditor(),
	} ), [] );

	let keyphrase = languageProcessing.helpers.processExactMatchRequest( focusKeyphrase ).keyphrase;

	// Prevent sending a very long keyphrase.
	if ( keyphrase.length > 191 ) {
		keyphrase = keyphrase.slice( 0, 191 );
	}

	// Sets the current editor. Check for isElementor first, as isGutenberg will be true there as well.
	let editor;
	if ( isElementor ) {
		editor = "elementor";
	} else if ( isGutenberg ) {
		editor = "gutenberg";
	} else {
		editor = "classic";
	}

	// Set the type of suggestions to fetch.
	const type = getSuggestionType( editType, isWooCommerceActive, postType, contentType );

	const fetchSuggestions = useCallback( async( canAbort = true ) => {
		dispatch( slice.actions.setLoading() );
		const { status, payload } = await pureFetchSuggestions( {
			endpoint: "yoast/v1/ai_generator/get_suggestions/",
			canAbort,
			data: {
				type: type,
				// eslint-disable-next-line camelcase
				prompt_content: promptContent,
				// eslint-disable-next-line camelcase
				focus_keyphrase: keyphrase,
				platform: transformPlatform( previewType ),
				language: removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" ),
				editor: editor,
			},
		} );
		switch ( status ) {
			case FETCH_RESPONSE_STATUS.abort:
				break;
			case FETCH_RESPONSE_STATUS.error:
				dispatch( slice.actions.setError( payload ) );
				break;
			case FETCH_RESPONSE_STATUS.success:
				dispatch( slice.actions.setSuccess( payload ) );
				break;
		}
		return status;
	}, [ dispatch ] );
	const setSelectedSuggestion = useCallback( suggestion => dispatch( slice.actions.setSelected( suggestion ) ), [ dispatch ] );

	return { suggestions: state, fetchSuggestions, setSelectedSuggestion };
};
