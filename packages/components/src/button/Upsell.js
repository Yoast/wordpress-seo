import React from "react";
import PropTypes from "prop-types";
import Button, { sharedButtonPropTypes, sharedButtonDefaultProps } from "./Button";

/**
 * An Upsell button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} An Upsell button component.
 */
export const UpsellButton = ( props ) => {
	const { caret, children, ...restProps } = props;
	return <Button
		className="yoast-button yoast-button--buy"
		{ ...restProps }
	>
		{ children }
		{ caret && <span className="yoast-button--buy__caret" /> }
	</Button>;
};

UpsellButton.propTypes = {
	...sharedButtonPropTypes,
	onClick: PropTypes.func.isRequired,
	caret: PropTypes.bool,
};

UpsellButton.defaultProps = {
	...sharedButtonDefaultProps,
	caret: false,
};

/**
 * An Upsell link.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} An Upsell link component.
 */
export const UpsellLink = ( props ) => {
	const { caret, children, ...restProps } = props;
	return <Button
		className="yoast-button yoast-button--buy"
		isLink={ true }
		{ ...restProps }
	>
		{ children }
		{ caret && <span className="yoast-button--buy__caret" /> }
	</Button>;
};

UpsellLink.propTypes = {
	...sharedButtonPropTypes,
	href: PropTypes.string.isRequired,
	caret: PropTypes.bool,
};

UpsellLink.defaultProps = {
	...sharedButtonDefaultProps,
	caret: false,
};
