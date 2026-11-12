import React from "react";
import styled from "styled-components";
import _omit from "lodash/omit";

/**
 * Returns the Icon component.
 *
 * @param {Object} props Component props.
 * @param {Function} props.icon The icon component to render.
 * @param {string} [props.width="16px"] The width of the icon.
 * @param {string} [props.height="16px"] The height of the icon.
 * @param {string} [props.color] The fill color of the icon.
 *
 * @returns {ReactElement} Icon component.
 */
const Icon = ( { width = "16px", height = "16px", ...props } ) => {
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

export default Icon;
