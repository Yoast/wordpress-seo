import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Content from "./content";
import Header from "./header";

/**
 * @param {React.ReactNode} [as="div"] What component to render as.
 * @param {string} [className=""] Optional extra className.
 * @param {React.ReactNode} children The content.
 * @returns {React.ReactElement} The element.
 */
const Paper = forwardRef( ( { as: Component = "div", className = "", children }, ref ) => (
	<Component
		ref={ ref }
		className={ classNames( "yst-paper", className ) }
	>
		{ children }
	</Component>
) );

Paper.displayName = "Paper";
Paper.propTypes = {
	as: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};
Paper.defaultProps = {
	as: "div",
	className: "",
};

Paper.Header = Header;
Paper.Header.displayName = "Paper.Header";

Paper.Content = Content;
Paper.Content.displayName = "Paper.Content";

export default Paper;
