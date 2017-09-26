import React from "react";
import PropTypes from "prop-types";

/**
 * Makes an anchor component into an outbound link that opens in a new tab.
 *
 * @param {ReactElement} Component The anchor component to be wrapped.
 *
 * @returns {OutboundLink} The OutboundLink component.
 */
export const makeOutboundLink = ( Component = "a" ) => {
	class OutboundLink extends React.Component {
		render() {
			const newProps = Object.assign(
				{},
				this.props,
				{
					target: "_blank",
					rel: "noopener noreferrer",
				}
			);
			// Using React.createElement because it can accept a string as a component parameter
			return React.createElement(
				Component,
				newProps,
				this.props.children,
				React.createElement(
					"span",
					null,
					"(This link opens in a new tab)"
				)
			);
		}
	}
	OutboundLink.propTypes = {
		children: PropTypes.oneOfType(
			PropTypes.string,
			PropTypes.node
		),
	};
	return OutboundLink;
};
