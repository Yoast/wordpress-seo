import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { YoastModal } from "yoast-components";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";

import UpsellBox from "../UpsellBox";
import { ModalContainer, ModalIcon } from "./Container";

/**
 * Returns the UpsellBox component.
 *
 * @returns {ReactElement} The UpsellBox component.
 */
class RedirectUpsell extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isModalOpen: false,
		};

		this.openModal  = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );
	}

	/**
	 * When the compononent did mount.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		jQuery( ".wpseo-open-gsc-redirect-modal" ).click(
			/**
			 * Onclick event.
			 *
			 * @param {Event} event The event.
			 *
			 * @returns {void}
			 */
			( event ) => {
				event.preventDefault();

				this.openModal();
			}
		);
	}

	/**
	 * Sets the modal is open state to true.
	 *
	 * @returns {void}
	 */
	openModal() {
		this.setState( {
			isModalOpen: true,
		} );
	}

	/**
	 * Sets the modal is open state to false.
	 *
	 * @returns {void}
	 */
	closeModal() {
		this.setState( {
			isModalOpen: false,
		} );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		if ( this.state.isModalOpen === false ) {
			return null;
		}

		const upsellText = sprintf(
			/* translators: %s expands to 'Yoast SEO Premium'. */
			__( "Get %s", "wordpress-seo" ),
			"Yoast SEO Premium"
		);

		const title = sprintf(
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( "Creating redirects is a %s feature", "wordpress-seo" ),
			"Yoast SEO Premium"
		);

		const intro = sprintf(
			/* Translators: %1$s: expands to 'Yoast SEO Premium'. */
			__( "To be able to create a redirect and fix this issue, you need %1$s. ", "wordpress-seo" ),
			"Yoast SEO Premium"
		);

		const callToAction =  sprintf(
			/* Translators: %1$s: yoast.com. */
			__( "You can buy the plugin, including one year of support and updates, on %1$s.", "wordpress-seo" ),
			"yoast.com"
		);

		return (
			<YoastModal
				isOpen={ this.state.isModalOpen }
				onClose={ this.closeModal }
				modalAriaLabel={ upsellText }
				appElement={ document.querySelector( "#wpwrap" ) }
				heading={ upsellText }
			>
				<ModalContainer>
					<ModalIcon icon={ YoastSeoIcon } />
					<h2>{ title }</h2>
					<UpsellBox
						infoParagraphs={ [ intro, callToAction ] }

						upsellButtonText={ upsellText }
						upsellButton={ {
							href: this.props.buyLink,
							className: "yoast-button-upsell",
							rel: null,
						} }
						upsellButtonLabel={ __( "1 year free updates and upgrades included!", "wordpress-seo" ) }
					/>
				</ModalContainer>
			</YoastModal>
		);
	}
}

RedirectUpsell.propTypes = {
	buyLink: PropTypes.string.isRequired,
};

export default RedirectUpsell;
