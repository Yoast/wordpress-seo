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
export const Icon = ( props ) => {
	const IconComponent = styled( props.icon )`
		width: ${ props.size };
		height: ${ props.size };
		fill: ${ props.color };
		flex: none;
	`;

	// Remove the props that are no longer needed
	const newProps = _omit( props, [ "icon", "size", "color" ] );

	return <IconComponent role="img" aria-hidden="true" focusable="false" { ...newProps } />;
};

Icon.propTypes = {
	icon: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
	size: PropTypes.string,
};

Icon.defaultProps = {
	size: "16px",
};

// Safari doesn't expose the ARIA role set on SVG element to browsers.
export const IconWithAriaLabel = ( props ) => {
	return <span role="img" aria-label={ props.ariaLabel }>
		<Icon
			icon={ props.icon }
			color={ props.color }
			size={ props.size }
			role="presentation"
		/>
	</span>;
};

IconWithAriaLabel.propTypes = {
	icon: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
	size: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
};
