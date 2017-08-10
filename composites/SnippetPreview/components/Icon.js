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
		float: left;
		width: ${ props => props.iconSize }px;
		height: ${ props => props.iconSize }px;
		fill: ${ props => props.iconColor };
	`;

	return <IconComponent aria-hidden="true" iconSize={ props.iconSize } iconColor={ props.iconColor } />;
};

Icon.propTypes = {
	icon: PropTypes.func.isRequired,
	iconColor: PropTypes.string.isRequired,
	iconSize: PropTypes.number,
};

Icon.defaultProps = {
	iconSize: 16,
};
