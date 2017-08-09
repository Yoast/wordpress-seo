import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import * as Icons from "../../../style-guide/svg";

/**
 * Returns an icon.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Icon.
 */
export const Icon = ( props ) => {
	const IconComponent = styled( Icons[ props.icon ] )`
		float: left;
		width: ${ props => props.size }px;
		height: ${ props => props.size }px;
		fill: ${ props => props.color };
	`;
	return <IconComponent { ...props } />;
};

Icon.propTypes = {
	icon: PropTypes.string,
	color: PropTypes.string,
	size: PropTypes.number,
};

Icon.defaultProps = {
	size: 16,
	color: "#555",
	icon: "edit",
};
