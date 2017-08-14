import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Returns the Icon component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Icon component.
 */
export const Icon = ( props ) => {
	const IconComponent = styled( props.icon )`
		width: ${ props.iconSize };
		height: ${ props.iconSize };
		fill: ${ props.iconColor };
	`;

	return <IconComponent aria-hidden="true" />;
};

Icon.propTypes = {
	icon: PropTypes.func.isRequired,
	iconColor: PropTypes.string.isRequired,
	iconSize: PropTypes.string,
};

Icon.defaultProps = {
	iconSize: "16px",
};
