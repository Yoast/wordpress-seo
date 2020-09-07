/* External dependencies */
import { __ } from "@wordpress/i18n";
import SettingsModal from "./SettingsModal";

/* Internal dependencies */
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
			postTypeName="post"
		>
			<TwitterEditor location="modal" />
		</SettingsModal>
	);
};

export default TwitterPreviewModal;
