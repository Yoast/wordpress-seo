/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import { A11yNotice } from "../composites/Plugin/Shared/components/A11yNotice";

/**
 * Makes an anchor component into an outbound link that opens in a new tab.
 *
 * @param {ReactElement} Component The anchor component to be wrapped.
 *
 * @returns {ReactElement} The OutboundLink component.
 */
export const makeOutboundLink = ( Component = "a" ) => {
	class OutboundLink extends React.Component {
		render() {
			const newProps = Object.assign(
				{
					target: "_blank",
					rel: "noopener noreferrer",
				},
				this.props
			);
			// Use React.createElement instead of JSX because it can accept a string as a component parameter.
			return React.createElement(
				Component,
				newProps,
				this.props.children,
				React.createElement(
					A11yNotice,
					null,
					__( "(Opens in a new browser tab)", "yoast-components" ),
				)
			);
		}
	}

	OutboundLink.propTypes = {
		children: PropTypes.oneOfType( [
			PropTypes.node,
		] ),
	};

	return OutboundLink;
};
