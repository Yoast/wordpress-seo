// /* global wpseoPluginInstallationL10n */

// External dependencies.
import { useState } from "@wordpress/element";
import { Modal } from "@yoast/components";
import { __ } from "@wordpress/i18n";
import styled from "styled-components";

// Internal dependencies.

const CloseButton = styled.a`
	float: right;
	cursor: pointer;
`;

/**
 * Plugin installation modal.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Element} The Addon installation modal.
 */
const AddonInstallation = props => {
	const [ modalIsOpen, setIsOpen ] = useState( true );

	/**
	 * Closes the modal when no installation is in progress.
	 *
	 * @returns {void}
	 */
	const closeModal = () => {
		setIsOpen( false );
	};

	/**
	 * Render the close button.
	 *
	 * @returns {React.Element} The close button.
	 */
	const renderCloseButton = () => {
		return (
			<CloseButton
				onClick={ closeModal }
			>
				{ __( "Close this modal", "wordpress-seo" ) }
			</CloseButton>
		);
	};

	return (
		<div>
			<Modal
				appElement={ document.getElementById( "wpseo-app-element" ) }
				onClose={ closeModal }
				isOpen={ modalIsOpen }
				closeIconButton={ __( "Close", "wordpress-seo" ) }
			>
				{ renderCloseButton() }
			</Modal>
		</div>
	);
};

AddonInstallation.propTypes = {
};

export default AddonInstallation;
