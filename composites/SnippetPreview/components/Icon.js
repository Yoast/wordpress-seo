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
		width: ${ props => props.size }px;
		height: ${ props => props.size }px;
		fill: ${ props => props.color };
	`;
	return <IconComponent aria-hidden="true" { ...props } />;
};

Icon.propTypes = {
	icon: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
	size: PropTypes.number,
};

Icon.defaultProps = {
	size: 16,
};
