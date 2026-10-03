/* global elementor, wpseoAdminL10n */
import { dispatch, select } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Updates the save warning message.
 *
 * @param {boolean} hasUnsavedSeoChanges If there are unsaved SEO changes.
 *
 * @returns {void}
 */
export const updateSaveAsDraftWarning = ( hasUnsavedSeoChanges ) => {
	let message = "";

	if ( hasUnsavedSeoChanges ) {
		message = sprintf(
			/* translators: %1$s translates to the Post Label in singular form */
			__(
				"Unfortunately we cannot save changes to your SEO settings while you are working on a draft of an already-published %1$s. If you want to save your SEO changes, make sure to click 'Update', or wait to make your SEO changes until you are ready to update the %1$s.",
				"wordpress-seo"
			),
			wpseoAdminL10n.postTypeNameSingular.toLowerCase()
		);
	}

	// Don't show the warning for drafts.
	if ( elementor.settings.page.model.get( "post_status" ) === "draft" ) {
		message = "";
	}

	if ( select( "yoast-seo/editor" ).getWarningMessage() !== message ) {
		dispatch( "yoast-seo/editor" ).setWarningMessage( message );
	}
};
