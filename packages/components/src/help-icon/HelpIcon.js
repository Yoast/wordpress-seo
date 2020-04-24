import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
// Import required CSS.
import "./help-icon.css";

/**
 * Props for the HelpIcon.
 */
export const helpIconProps = {
	linkTo: PropTypes.string,
	linkText: PropTypes.string,
};

/**
 * Default props for the HelpIcon.
 */
export const helpIconDefaultProps = {
	linkTo: "",
	linkText: "",
};

/**
 * Function for the HelpIcon component.
 *
 * @param {string} linkTo Location where the icon refers to.
 * @param {string} linkText Text for screenreaders that tells what the link does.
 *
 * @returns {React.Component} The HelpIcon.
 */
const HelpIcon = ( { linkTo, linkText } ) => (
	<a
		className="yoast-help"
		target="_blank"
		href={ linkTo }
		rel="noopener noreferrer"
	>
		<span className="yoast-help__icon">
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
);

HelpIcon.propTypes = helpIconProps;
HelpIcon.defaultProps = helpIconDefaultProps;

export default HelpIcon;
