// /* global wpseoPluginInstallationL10n */

// External dependencies.
import { useState } from "@wordpress/element";
import PropTypes from "prop-types";
import { Modal, Button } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";

// Internal dependencies.

const CloseButton = styled.a`
	float: right;
	cursor: pointer;
`;

const ButtonPlacement = styled.div`
	display: flex;
	align-items: right;
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
	function closeModal() {
		setIsOpen( false );
	}

	/**
	 * Starts the installation flow.
	 *
	 * @returns {void}
	 */
	function startInstallation() {
		window.location.href = "admin.php?page=wpseo_licenses&action=install&nonce=" + props.nonce;
	}

	/**
	 * Renders the close button.
	 *
	 * @returns {React.Element} The close button.
	 */
	function renderCloseButton() {
		return (
			<CloseButton
				onClick={ closeModal }
			>
				{ __( "Close this modal", "wordpress-seo" ) }
			</CloseButton>
		);
	}

	/**
	 * Renders the install button.
	 *
	 * @returns {React.Element} The install button.
	 */
	function renderInstallButton() {
		return (
			<Button
				onClick={ startInstallation }
			>
				{ __( "Install and activate addons", "wordpress-seo" ) }
			</Button>
		);
	}

	return (
		<Modal
			appElement={ document.getElementById( "wpseo-app-element" ) }
			onClose={ closeModal }
			isOpen={ modalIsOpen }
			closeIconButton={ __( "Close", "wordpress-seo" ) }
		>
			<h2>
				{ sprintf(
					/* translators: %s expands to Yoast */
					__( "%s addon installation", "wordpress-seo" ),
					"Yoast",
				) }
			</h2>
			<p>
				{ sprintf(
					/* translators: %s expands to Yoast SEO Premium */
					__( "Please confirm below that you would like to install %s on this site", "wordpress-seo" ),
					props.addons.join( ", " ),
				) }
			</p>
			<ButtonPlacement>
				{ renderCloseButton() }
				{ renderInstallButton() }
			</ButtonPlacement>
		</Modal>
	);
};

AddonInstallation.propTypes = {
	nonce: PropTypes.string.isRequired,
	addons: PropTypes.array,
};

AddonInstallation.defaultProps = {
	addons: [],
};

export default AddonInstallation;
