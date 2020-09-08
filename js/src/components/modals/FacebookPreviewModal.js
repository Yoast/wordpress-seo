/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import SettingsModal from "../../containers/SettingsModal";
import FacebookEditor from "../../containers/FacebookEditor";

/**
 * The Facebook Preview Modal.
 *
 * @returns {React.Component} The Facebook Preview Modal.
 */
const FacebookPreviewModal = () => {
	return (
		<SettingsModal
			title={ __( "Facebook preview", "wordpress-seo" ) }
		>
			<FacebookEditor location="modal" />
		</SettingsModal>
	);
};

export default FacebookPreviewModal;
