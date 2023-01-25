/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import { A11yNotice } from "./tests/A11yNotice";

/**
 * Makes an anchor component into an outbound link that opens in a new tab.
 *
 * @param {ReactElement} Component The anchor component to be wrapped.
 *
 * @returns {ReactElement} The OutboundLink component.
 */
export const makeOutboundLink = ( Component = "a" ) => {
	/**
	 * OutboundLink component.
	 */
	class OutboundLink extends React.Component {
		/**
		 * Constructs the OutboundLink component.
		 *
		 * @param {Object} props The props for the snippet preview example.
		 */
		constructor( props ) {
			super( props );
			this.isYoastLink = this.isYoastLink.bind( this );
		}

		/**
		 * Determines if a certain URL points to Yoast.
		 *
		 * @param {string} url The URL to test.
		 * @returns {boolean} Whether or not the URL points to Yoast.
		 */
		isYoastLink( url ) {
			return /yoast\.com|yoast\.test|yoa\.st/.test( url );
		}

		/**
		 * Renders the component.
		 *
		 * @returns {ReactElement} The rendered component.
		 */
		render() {
			if ( ! this.props.href ) {
				return null;
			}

			const isYoastLink = this.isYoastLink( this.props.href );
			/*
			 * Set the target="_blank" and rel attributes. When a link doesn't point
			 * to Yoast, we want just a "noopener" rel attribute value.
			 * Instead, when a link does point to Yoast, we use the rel prop which
			 * is null by default so it doesn't render. This way, it can be
			 * overridden setting the prop, if necessary.
			 */
			const newProps = Object.assign(
				{},
				this.props,
				{
					target: "_blank",
					rel: isYoastLink ? this.props.rel : "noopener",
				}
			);
			// Use React.createElement instead of JSX because it can accept a string as a component parameter.
			return React.createElement(
				Component,
				newProps,
				this.props.children,
				React.createElement(
					A11yNotice,
					null,
					__( "(Opens in a new browser tab)", "wordpress-seo" )
				)
			);
		}
	}

	OutboundLink.propTypes = {
		children: PropTypes.oneOfType( [
			PropTypes.node,
		] ),
		href: PropTypes.string,
		rel: PropTypes.string,
	};

	OutboundLink.defaultProps = {
		children: null,
		href: null,
		rel: null,
	};

	return OutboundLink;
};
