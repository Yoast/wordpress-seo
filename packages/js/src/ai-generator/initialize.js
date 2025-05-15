import { Fill } from "@wordpress/components";
import { select } from "@wordpress/data";
import { useCallback, useRef } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { Modal, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ModalContent } from "./components/modal-content";
import { registerStore } from "./store";
import { PRODUCT_SUBSCRIPTIONS_NAME } from "./store/product-subscriptions";
import { ADMIN_URL_NAME, HAS_AI_GENERATOR_CONSENT_NAME } from "../shared-admin/store";
import { get } from "lodash";

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
	const postType = get( window, "wpseoPremiumAiGenerator.postType", "" );
	const contentType = get( window, "wpseoPremiumAiGenerator.contentType", "" );
	const isWooSeoUpsell = wpSelect( "yoast-seo/editor" ).getIsWooSeoUpsell() ||
		wpSelect( "yoast-seo/editor" ).getIsWooSeoUpsellTerm();

	if ( IGNORED_POST_TYPES.includes( postType ) || isWooSeoUpsell ) {
		return buttons;
	}

	const previewType = getPreviewType( fieldId );

	if ( ! previewType ) {
		// Unknown preview type.
		return buttons;
	}

	const isRtl = get( window, "wpseoScriptData.metabox.isRtl", false );
	buttons.push(
		<Fill name={ `yoast.replacementVariableEditor.additionalButtons.${ fieldId }` }>
			<Root context={ { isRtl } }>
				<TypeProvider value={ { editType, previewType, postType, contentType } }>
					<App onUseAi={ updateInteractedWithFeature } />
				</TypeProvider>
			</Root>
		</Fill>,
	);

	return buttons;
};


const STORE = "yoast-seo/editor";

/**
 * Initializes the AI Generator upsell.
 *
 * @returns {void}
 */
const initializeAiGenerator = () => {
	addFilter(
		"yoast.replacementVariableEditor.additionalButtons",
		"yoast/yoast-seo-premium/AiGenerator",
		filterReplacementVariableEditorButtons,
	);

	registerStore( {
		[ ADMIN_URL_NAME ]: get( window, "wpseoPremiumAiGenerator.adminUrl", "" ),
		[ HAS_AI_GENERATOR_CONSENT_NAME ]: get( window, "wpseoPremiumAiGenerator.hasConsent", false ) === "1",
		[ PRODUCT_SUBSCRIPTIONS_NAME ]: get( window, "wpseoPremiumAiGenerator.productSubscriptions", {} ),
	} );
};

export default initializeAiGenerator;
