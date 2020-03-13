import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

// Import the required CSS.
import "./field-group.css";

export const FieldGroupLabelIcon = ( { htmlFor, label, helpLink, children } ) => {
	return (
		<div className="yoast-field-group">
			<label htmlFor={ htmlFor } className="yoast-field-group__title">{ label }</label>
			<a className="yoast-field-group__help" target="_blank" href={ helpLink }>
				<span className="yoast-field-group__help-icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" role="img" aria-hidden="true"
					     focusable="false"><path
						d="M12 6A6 6 0 110 6a6 6 0 0112 0zM6.2 2C4.8 2 4 2.5 3.3 3.5l.1.4.8.7.4-.1c.5-.5.8-.9 1.4-.9.5 0 1.1.4 1.1.8s-.3.6-.7.9C5.8 5.6 5 6 5 7c0 .2.2.4.3.4h1.4L7 7c0-.8 2-.8 2-2.6C9 3 7.5 2 6.2 2zM6 8a1.1 1.1 0 100 2.2A1.1 1.1 0 006 8z" /></svg>
				</span>
				<span className="screen-reader-text">{ __( "Tell what this link does.", "yoast-components" ) }</span>
				<span className="screen-reader-text">{ __( "(Opens in a new browser tab)", "yoast-components" ) }</span>
			</a>
			{ children }
		</div>
	);
};

FieldGroupLabelIcon.propTypes = {
	label: PropTypes.string.isRequired,
	htmlFor: PropTypes.string.isRequired,
	helpLink: PropTypes.string,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

FieldGroupLabelIcon.defaultProps = {
	helpLink: "https://yoast.com",
	children: [],
};

export const FieldGroupLabelIconDescription = ( { htmlFor, label, helpLink, description, children } ) => {
	return (
		<div className="yoast-field-group">
			<label htmlFor={ htmlFor } className="yoast-field-group__title">{ label }</label>
			<a className="yoast-field-group__help" target="_blank" href={ helpLink }>
			<span className="yoast-field-group__help-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" role="img" aria-hidden="true"
				     focusable="false"><path
					d="M12 6A6 6 0 110 6a6 6 0 0112 0zM6.2 2C4.8 2 4 2.5 3.3 3.5l.1.4.8.7.4-.1c.5-.5.8-.9 1.4-.9.5 0 1.1.4 1.1.8s-.3.6-.7.9C5.8 5.6 5 6 5 7c0 .2.2.4.3.4h1.4L7 7c0-.8 2-.8 2-2.6C9 3 7.5 2 6.2 2zM6 8a1.1 1.1 0 100 2.2A1.1 1.1 0 006 8z" /></svg>
			</span>
				<span className="screen-reader-text">{ __( "Tell what this link does.", "yoast-components" ) }</span>
				<span className="screen-reader-text">{ __( "(Opens in a new browser tab)", "yoast-components" ) }</span>
			</a>
			<p className="description" id="yoast_unique_description_id">{ description }</p>
			{ children }
		</div>
	);
};

FieldGroupLabelIconDescription.propTypes = {
	label: PropTypes.string.isRequired,
	htmlFor: PropTypes.string.isRequired,
	helpLink: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

FieldGroupLabelIcon.defaultProps = {
	helpLink: "https://yoast.com",
	description: "",
	children: [],
};
