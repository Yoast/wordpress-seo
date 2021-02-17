import React from "react";
import PropTypes from "prop-types";

// Import the required CSS.
import "./field-group.css";
import HelpIcon, { helpIconDefaultProps, helpIconProps } from "../help-icon/HelpIcon";

/**
 * FieldGroup component that can be used to wrap our form elements in.
 *
 * @param {string} htmlFor ID to which HTML element the label belongs.
 * @param {string} label Text displayed as label.
 * @param {string} linkTo Location to which the icon links.
 * @param {string} linkText Screen-reader text that is added to the link.
 * @param {string} description Optional: a description where the input element is used for.
 * @param {array} children Children that are rendered in the FieldGroup.
 * @param {string} wrapperClassName Optional: A classname for the FieldGroup's outer div. Default is "yoast-field-group".
 * @param {string} titleClassName Optional: A classname for the FieldGroup's title div. Default is "yoast-field-group__title".
 *
 * @returns {React.Component} A div with a label, icon and optional description that renders all children.
 */
const FieldGroup = ( { htmlFor, label, linkTo, linkText, description, children, wrapperClassName, titleClassName } ) => {
	const titleComponent = htmlFor
		? <label htmlFor={ htmlFor }>{ label }</label>
		: <b>{ label }</b>;
	return (
		<div className={ wrapperClassName }>
			<div className={ titleClassName }>
				{ titleComponent }
				{ linkTo !== "" && <HelpIcon
					linkTo={ linkTo }
					linkText={ linkText }
				/> }
			</div>
			{ description !== "" && <p className="field-group-description">{ description }</p> }
			{ children }
		</div>
	);
};

/**
 * Export the Props for the FieldGroup so that we can easily use it in other places.
 */
export const FieldGroupProps = {
	label: PropTypes.string.isRequired,
	description: PropTypes.string,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	wrapperClassName: PropTypes.string,
	titleClassName: PropTypes.string,
	htmlFor: PropTypes.string,
	...helpIconProps,
};

/**
 * Export the DefaultProps for the FieldGroup so that we can easily use it in other places.
 */
export const FieldGroupDefaultProps = {
	description: "",
	children: [],
	wrapperClassName: "yoast-field-group",
	titleClassName: "yoast-field-group__title",
	htmlFor: "",
	...helpIconDefaultProps,
};

FieldGroup.propTypes = FieldGroupProps;

FieldGroup.defaultProps = FieldGroupDefaultProps;

export default FieldGroup;
