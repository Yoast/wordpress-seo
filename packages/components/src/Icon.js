import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _omit from "lodash/omit";

/**
 * Returns the Icon component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Icon component.
 */
const Icon = ( props ) => {
	const { width = "16px", height = "16px" } = props;
	const IconComponent = styled( props.icon )`
		width: ${ width };
		height: ${ height };
		${ props.color ? `fill: ${ props.color };` : "" }
		flex: 0 0 auto;
	`;

	// Remove the props that are no longer needed.
	const newProps = _omit( props, [ "icon", "width", "height", "color" ] );

	return <IconComponent role="img" aria-hidden="true" focusable="false" { ...newProps } />;
};

Icon.propTypes = {
	icon: PropTypes.func.isRequired,
	width: PropTypes.string,
	height: PropTypes.string,
	color: PropTypes.string,
};

export default Icon;
