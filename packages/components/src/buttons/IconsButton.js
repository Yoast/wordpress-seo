// External dependencies.
import React from "react";
import PropTypes from "prop-types";

// Internal dependencies.
import { default as Button } from "./Button";
import { SvgIcon } from "../index";

/**
 * Returns an icons button that can optionally contain a prefix and / or a suffix icon.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled icon button.
 */
const IconsButton = ( props ) => {
	const {
		children,
		className,
		prefixIcon,
		suffixIcon,
		...buttonProps
	} = props;

	return (
		<Button className={ className } { ...buttonProps }>
			{ prefixIcon && prefixIcon.icon &&
			<SvgIcon
				icon={ prefixIcon.icon }
				color={ prefixIcon.color }
				size={ prefixIcon.size }
			/>
			}
			{ children }
			{ suffixIcon && suffixIcon.icon &&
			<SvgIcon
				icon={ suffixIcon.icon }
				color={ suffixIcon.color }
				size={ suffixIcon.size }
			/>
			}
		</Button>
	);
};

IconsButton.propTypes = {
	className: PropTypes.string,
	prefixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	suffixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ),
};

export default IconsButton;
