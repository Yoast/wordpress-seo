// External dependencies.
import { useState } from "@wordpress/element";
import PropTypes from "prop-types";
import { Button, Modal } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";

// Internal dependencies.
const ButtonPlacement = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 8px;
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
			<Button
				onClick={ closeModal }
				id="close-addon-installation-dialog"
			>
				{ __( "Cancel", "wordpress-seo" ) }
			</Button>
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
				id="continue-addon-installation-dialog"
			>
				{ __( "Install and activate addons", "wordpress-seo" ) }
			</Button>
		);
	}

	const heading = sprintf(
		/* translators: %s expands to Yoast */
		__( "%s addon installation", "wordpress-seo" ),
		"Yoast"
	);

	let installationTitle = __( "the following addons", "wordpress-seo" );
	let list;

	if ( props.addons.length === 1 ) {
		installationTitle = props.addons[ 0 ];
	}

	// Create a list of addons if there are more than one.
	if ( props.addons.length !== 1 ) {
		list = <ul className="ul-disc">
			{
				props.addons.map( ( addon, index ) => <li key={ "addon-" + index }>{ addon }</li> )
			}
		</ul>;
	}

	return (
		<Modal
			appElement={ document.getElementById( "wpseo-app-element" ) }
			onClose={ closeModal }
			isOpen={ modalIsOpen }
			heading={ heading }
			modalAriaLabel={ __( "Addon installation", "wordpress-seo" ) }
		>
			<p>
				{ sprintf(
					/* translators: %s expands to Yoast SEO Premium */
					__( "Please confirm below that you would like to install %s on this site.", "wordpress-seo" ),
					installationTitle
				) }
			</p>
			{ list }
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
