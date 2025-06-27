import { Fill } from "@wordpress/components";
import { select } from "@wordpress/data";
import { addAction, addFilter } from "@wordpress/hooks";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { HAS_AI_GENERATOR_CONSENT_NAME } from "../shared-admin/store";
import { App, TypeProvider } from "./components";
import { POST_TYPE, PREVIEW_TYPE, STORE_NAME_EDITOR } from "./constants";
import { filterFocusKeyphraseErrors, initializePromptContent, updateInteractedWithFeature } from "./initialize/index";
import { registerStore } from "./store";
import { PRODUCT_SUBSCRIPTIONS_NAME } from "./store/product-subscriptions";
import { USAGE_COUNT_NAME } from "./store/usage-count";
import { FREE_SPARKS_NAME } from "./store/free-sparks";
import domReady from "@wordpress/dom-ready";

/**
 * Get the preview type from the field ID.
 *
 * @param {string} fieldId The field ID.
 * @returns {string} The preview type.
 */
function getPreviewType( fieldId ) {
	if ( fieldId.startsWith( "yoast-google-preview" ) ) {
		return PREVIEW_TYPE.google;
	} else if ( fieldId.startsWith( "social" ) ) {
		return PREVIEW_TYPE.social;
	} else if ( fieldId.startsWith( "x-" ) ) {
		return PREVIEW_TYPE.twitter;
	}
}

/**
 * Adds the use AI button, if applicable.
 *
 * @param {JSX.node[]} buttons The current buttons.
 * @param {string} fieldId The replacement variable editor's field ID.
 * @param {string} type The edit type: title or description.
 *
 * @returns {JSX.node[]} The buttons.
 */
const filterReplacementVariableEditorButtons = ( buttons, { fieldId, type: editType } ) => {
	const postType = select( STORE_NAME_EDITOR ).getPostType();

	const previewType = getPreviewType( fieldId );
	if ( ! previewType ) {
		// Unknown preview type.
		return buttons;
	}

	const rootContext = {
		isRtl: select( STORE_NAME_EDITOR ).getPreference( "isRtl" ),
	};
	const typeContext = {
		editType,
		previewType,
		postType,
		contentType: select( STORE_NAME_EDITOR ).getIsTerm() ? "term" : "post",
	};

	buttons.push(
		<Fill name={ `yoast.replacementVariableEditor.additionalButtons.${ fieldId }` }>
			<Root context={ rootContext }>
				<TypeProvider value={ typeContext }>
					<App onUseAi={ updateInteractedWithFeature } />
				</TypeProvider>
			</Root>
		</Fill>
	);

	return buttons;
};

/**
 * Initializes the AI Generator.
 *
 * @returns {void}
 */
const initializeAiGenerator = () => {
	registerStore( {
		[ HAS_AI_GENERATOR_CONSENT_NAME ]: {
			hasConsent: get( window, "wpseoAiGenerator.hasConsent", false ) === "1",
			endpoint: "yoast/v1/ai_generator/consent",
		},
		[ USAGE_COUNT_NAME ]: {
			endpoint: "yoast/v1/ai_generator/get_usage",
		},
		[ PRODUCT_SUBSCRIPTIONS_NAME ]: get( window, "wpseoAiGenerator.productSubscriptions", {} ),
		[ FREE_SPARKS_NAME ]: {
			isFreeSparksActive: get( window, "wpseoAiGenerator.isFreeSparks", false ) === "1",
			endpoint: "yoast/v1/ai/free_sparks",
		},
	} );

	window.jQuery( window ).on( "YoastSEO:ready", () => {
		initializePromptContent();
	} );

	addFilter(
		"yoast.replacementVariableEditor.additionalButtons",
		"yoast/yoast-seo/AiGenerator",
		filterReplacementVariableEditorButtons
	);

	addFilter( "yoast.focusKeyphrase.errors", "yoast/yoast-seo/AiGenerator", filterFocusKeyphraseErrors );

	addAction( "yoast.elementor.loaded", "yoast/yoast-seo/AiGenerator", initializePromptContent );
};

domReady( () => {
	if ( ! window.wpseoScriptData.postType ) {
		return;
	}

	initializeAiGenerator();
} );
