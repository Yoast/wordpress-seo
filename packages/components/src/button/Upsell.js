import React from "react";
import PropTypes from "prop-types";
import Button, { buttonDefaultProps, buttonPropTypes } from "./Button";

/**
 * An Upsell button.
 *
 * @param {Object} props The props object.
 *
 * @returns {ReactElement} An Upsell button component.
 */
export const UpsellButton = ( props ) => {
	return <Button
		className="yoast-button yoast-button--buy"
		{ ...props }
	>
		{ props.children }
		{ props.caret && <span className="yoast-button--buy__caret" /> }
	</Button>;
};

UpsellButton.propTypes = {
	...buttonPropTypes,
	onClick: PropTypes.func.isRequired,
	caret: PropTypes.bool,
};

UpsellButton.defaultProps = {
	...buttonDefaultProps,
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
	return <Button
		className="yoast-button yoast-button--buy"
		isLink={ true }
		{ ...props }
	>
		{ props.children }
		{ props.caret && <span className="yoast-button--buy__caret" /> }
	</Button>;
};

UpsellLink.propTypes = {
	...buttonPropTypes,
	href: PropTypes.string.isRequired,
	caret: PropTypes.bool,
};

UpsellLink.defaultProps = {
	...buttonDefaultProps,
	caret: false,
};
