/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import SettingsModal from "../../containers/SettingsModal";
import TwitterEditor from "../../containers/TwitterEditor";

/**
 * The Twitter Preview Modal.
 *
 * @returns {React.Component} The Twitter Preview Modal.
 */
const TwitterPreviewModal = () => {
	return (
		<SettingsModal
			title={ __( "Twitter preview", "wordpress-seo" ) }
		>
			<TwitterEditor location="modal" />
		</SettingsModal>
	);
};

export default TwitterPreviewModal;
