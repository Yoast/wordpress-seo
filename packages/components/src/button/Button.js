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
	// Split children and className from all other props.
	const {
		children,
		className,
		...restProps
	} = props;

	if ( props.isLink ) {
		// Split link specific props from all additional props.
		const {
			href,
			...linkProps
		} = restProps;

		return <a
			href={ href }
			className={ className }
			{ ...linkProps }
		>
			{ children }
		</a>;
	}

	// Split button specific props from all additional props.
	const {
		onClick,
		...buttonProps
	} = restProps;

	return <button
		onClick={ onClick }
		className={ className }
		{ ...buttonProps }
	>
		{ children }
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
