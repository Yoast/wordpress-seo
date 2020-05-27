import React from "react";
import PropTypes from "prop-types";
import "./buttons.css";

export const sharedButtonPropTypes = {
	isLink: PropTypes.bool,
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
};

export const sharedButtonDefaultProps = {
	isLink: false,
	children: null,
};

/**
 * Creates a button component.
 *
 * @param {Object} props The props
 *
 * @returns {ReactElemen} The Button component.
 */
const Button = ( props ) => {
	if ( props.isLink ) {
		return <a
			href={ props.href }
			className={ props.className }
		>
			{ props.children }
		</a>;
	}


	return <button
		onClick={ props.onClick }
		className={ props.className }
	>
		{ props.children }
	</button>;
};

Button.propTypes = {
	...sharedButtonPropTypes,
	className: PropTypes.string,
};

Button.defaultProps = {
	...sharedButtonDefaultProps,
	className: "yoast-button",
};

export default Button;
