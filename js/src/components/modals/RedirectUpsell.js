import React from "react";
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { getRtlStyle, utils, YoastModal } from "yoast-components";
import YoastSeoIcon from "yoast-components/composites/basic/YoastSeoIcon";
import Icon from "yoast-components/composites/Plugin/Shared/components/Icon";

import UpsellBox from "../UpsellBox";

const { makeOutboundLink } = utils;
const PremiumLandingPageLink = makeOutboundLink();

const StyledContainer = styled.div`
	min-width: 600px;

	@media screen and ( max-width: 680px ) {
		min-width: 0;
		width: 86vw;
	}
`;

const StyledIcon = styled( Icon )`
	float: ${ getRtlStyle( "right", "left" ) };
	margin: ${ getRtlStyle( "0 0 16px 16px", "0 16px 16px 0" ) };

	&& {
		width: 150px;
		height: 150px;

		@media screen and ( max-width: 680px ) {
			width: 80px;
			height: 80px;
		}
	}
`;

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
			modalIsOpen: false,
		};

		this.openModal  = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );

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
			modalIsOpen: true,
		} );
	}

	/**
	 * Sets the modal is open state to false.
	 *
	 * @returns {void}
	 */
	closeModal() {
		this.setState( {
			modalIsOpen: false,
		} );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		if ( this.state.modalIsOpen === false ) {
			return null;
		}

		const heading = sprintf(
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

		const modalAriaLabel = sprintf(
			/* translators: %s expands to 'Yoast SEO Premium'. */
			__( "Get %s", "wordpress-seo" ),
			"Yoast SEO Premium"
		);

		return (
			<YoastModal
				isOpen={ this.state.modalIsOpen }
				onClose={ this.closeModal }
				modalAriaLabel={ modalAriaLabel }
				appElement={ document.querySelector( "#wpwrap" ) }
				heading={ heading }
			>
				<StyledContainer>
					<StyledIcon icon={ YoastSeoIcon } />
					<h2>{ title }</h2>
					<UpsellBox
						infoParagraphs={ [ intro, callToAction ] }

						upsellButtonText={
							sprintf(
								/* translators: %s expands to 'Yoast SEO Premium'. */
								__( "Get %s", "wordpress-seo" ),
								"Yoast SEO Premium"
							)
						}
						upsellButton={ {
							href: this.props.buyLink,
							className: "yoast-button-upsell",
							rel: null,
						} }
						upsellButtonLabel={ __( "1 year free updates and upgrades included!", "wordpress-seo" ) }
					/>
				</StyledContainer>
			</YoastModal>
		);
	}
}

RedirectUpsell.propTypes = {
	buyLink: PropTypes.string.isRequired,
};

export default RedirectUpsell;
