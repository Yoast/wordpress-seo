/* External dependencies */
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { isArray } from "lodash";

/**
 * Styled SVG Component.
 *
 * @param {Object} props The component's props.
 *
 * @returns {React.Element} StyledSvg component.
 */
export const StyledSvg = styled.svg`
	width: ${ props => props.size };
	height: ${ props => props.size };
	flex: none;
`;

/**
 * Returns the SvgIconSet component.
 *
 * @param {object} props Component props.
 *
 * @returns {React.Element} SvgIconSet component.
 */
class SvgIconSet extends React.Component {
	/**
	 * Renders an SVG icon.
	 *
	 * @returns {React.Element|null} The rendered SVG icon.
	 */
	render() {
		const { iconSet, icon, className, color, size } = this.props;
		const iconName = iconSet[ icon ];

		if ( ! iconName ) {
			console.warn( `Invalid icon name ("${ icon }") passed to the SvgIcon component.` );
			return null;
		}

		const path = iconName.path;
		const viewbox = iconName.viewbox;

		const iconClass = [ "yoast-svg-icon", "yoast-svg-icon-" + icon, className ].filter( Boolean ).join( " " );
		const ComponentToUse = iconName.CustomComponent ? iconName.CustomComponent : StyledSvg;

		return (
			<ComponentToUse
				aria-hidden={ true }
				role="img"
				focusable="false"
				size={ size }
				className={ iconClass }
				xmlns="http://www.w3.org/2000/svg"
				viewBox={ viewbox }
				fill={ color }
			>
				{ isArray( path ) ? path : <path d={ path } /> }
			</ComponentToUse>
		);
	}
}

SvgIconSet.propTypes = {
	icon: PropTypes.string.isRequired,
	iconSet: PropTypes.object.isRequired,
	color: PropTypes.string,
	size: PropTypes.string,
	className: PropTypes.string,
};

SvgIconSet.defaultProps = {
	size: "16px",
	color: "currentColor",
	className: "",
};

/**
 * Create an SVG Icon component with a custom set of icons.
 *
 * @param {Object} iconSet Set of SVG icons.
 *
 * @returns {React.Component} The SvgIcon component.
 */
export default ( iconSet ) => {
	/**
	 * Renders an SVG icon.
	 *
	 * @param {Object} props The component props.
	 * @param {string} props.icon The icon name.
	 * @param {string} [props.className=""] The CSS class.
	 * @param {string} [props.color="currentColor"] The icon color.
	 * @param {string} [props.size="16px"] The icon size.
	 *
	 * @returns {React.Element} The react element.
	 */
	const SvgIcon = ( { icon, className = "", color = "currentColor", size = "16px" } ) => {
		return <SvgIconSet
			iconSet={ iconSet }
			icon={ icon }
			className={ className }
			color={ color }
			size={ size }
		/>;
	};

	SvgIcon.propTypes = {
		icon: PropTypes.string.isRequired,
		color: PropTypes.string,
		size: PropTypes.string,
		className: PropTypes.string,
	};

	return SvgIcon;
};
