import { Fill } from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { ADMIN_URL_NAME, HAS_AI_GENERATOR_CONSENT_NAME } from "../shared-admin/store";
import { App, TypeProvider } from "./components";
import { POST_TYPE, PREVIEW_TYPE } from "./constants";
import { registerStore } from "./store";
import { PRODUCT_SUBSCRIPTIONS_NAME } from "./store/product-subscriptions";

let hasInteractedWithFeature = false;
/**
 * Used to keep track of whether the user interacted with this feature.
 * @returns {void}
 */
const updateInteractedWithFeature = () => {
	if ( hasInteractedWithFeature ) {
		return;
	}
	hasInteractedWithFeature = true;
};

// Ignore these post types. Attachments will require a different prompt.
const IGNORED_POST_TYPES = [ POST_TYPE.attachment ];

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
	const postType = get( window, "wpseoAiGenerator.postType", "" );
	if ( IGNORED_POST_TYPES.includes( postType ) ) {
		return buttons;
	}

	const previewType = getPreviewType( fieldId );
	if ( ! previewType ) {
		// Unknown preview type.
		return buttons;
	}

	const rootContext = {
		isRtl: get( window, "wpseoScriptData.metabox.isRtl", false ),
	};
	const typeContext = {
		editType,
		previewType,
		postType,
		contentType: get( window, "wpseoAiGenerator.contentType", "" ),
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
		[ ADMIN_URL_NAME ]: get( window, "wpseoAiGenerator.adminUrl", "" ),
		[ HAS_AI_GENERATOR_CONSENT_NAME ]: get( window, "wpseoAiGenerator.hasConsent", false ) === "1",
		[ PRODUCT_SUBSCRIPTIONS_NAME ]: get( window, "wpseoAiGenerator.productSubscriptions", {} ),
	} );

	addFilter(
		"yoast.replacementVariableEditor.additionalButtons",
		"yoast/yoast-seo/AiGenerator",
		filterReplacementVariableEditorButtons
	);
};

export default initializeAiGenerator;
