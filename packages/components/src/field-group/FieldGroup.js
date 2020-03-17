import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

// Import the required CSS.
import "./field-group.css";

/**
 * FieldGroup component that can be used to wrap our form elements in.
 *
 * @param {string} htmlFor ID to which HTML element the label belongs.
 * @param {string} label Text displayed as label.
 * @param {string} linkTo Location to which the icon links.
 * @param {string} linkText Screen-reader text that is added to the link.
 * @param {string} description Optional: a description where the input element is used for.
 * @param {array} children Children that are rendered in the FieldGroup.
 *
 * @returns {React.Component} A div with a label, icon and optional description that renders all children.
 */
const FieldGroup = ( { htmlFor, label, linkTo, linkText, description, children } ) => {
	return (
		<div className="yoast-field-group">
			<label htmlFor={ htmlFor } className="yoast-field-group__title">{ label }</label>
			<a
				className="yoast-field-group__help"
				target="_blank"
				href={ linkTo }
				rel="noopener noreferrer"
			>
				<span className="yoast-field-group__help-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" role="img" aria-hidden="true"
						focusable="false"
					>
						<path
							// eslint-disable-next-line max-len
							d="M12 6A6 6 0 110 6a6 6 0 0112 0zM6.2 2C4.8 2 4 2.5 3.3 3.5l.1.4.8.7.4-.1c.5-.5.8-.9 1.4-.9.5 0 1.1.4 1.1.8s-.3.6-.7.9C5.8 5.6 5 6 5 7c0 .2.2.4.3.4h1.4L7 7c0-.8 2-.8 2-2.6C9 3 7.5 2 6.2 2zM6 8a1.1 1.1 0 100 2.2A1.1 1.1 0 006 8z"
						/>
					</svg>
				</span>
				<span className="screen-reader-text">{ __( linkText, "yoast-components" ) }</span>
				<span className="screen-reader-text">{ __( "(Opens in a new browser tab)", "yoast-components" ) }</span>
			</a>
			{ description !== ""  && <p className="description" id="yoast_unique_description_id">{ description }</p> }
			{ children }
		</div>
	);
};

/**
 * Export the Props for the FieldGroup so that we can easily use it in other places.
 */
export const FieldGroupProps = {
	label: PropTypes.string.isRequired,
	linkTo: PropTypes.string,
	linkText: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

/**
 * Export the DefaultProps for the FieldGroup so that we can easily use it in other places.
 */
export const FieldGroupDefaultProps = {
	linkTo: "https://yoast.com",
	linkText: "Tell me what this link does",
	description: "",
	children: [],
};

FieldGroup.propTypes = {
	htmlFor: PropTypes.string.isRequired,
	...FieldGroupProps,
};

FieldGroup.defaultProps = FieldGroupDefaultProps;

export default FieldGroup;
