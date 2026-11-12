// External dependencies.
import React from "react";

// Internal dependencies.
import { default as Button } from "./Button";
import { SvgIcon } from "../index";

/**
 * Returns an icons button that can optionally contain a prefix and / or a suffix icon.
 *
 * @param {Object} props Component props.
 * @param {string} [props.className] The class name of the button.
 * @param {Object} [props.prefixIcon] The icon before the content.
 * @param {string} [props.prefixIcon.icon] The name of the icon.
 * @param {string} [props.prefixIcon.color] The color of the icon.
 * @param {string} [props.prefixIcon.size] The size of the icon.
 * @param {Object} [props.suffixIcon] The icon after the content.
 * @param {string} [props.suffixIcon.icon] The name of the icon.
 * @param {string} [props.suffixIcon.color] The color of the icon.
 * @param {string} [props.suffixIcon.size] The size of the icon.
 * @param {(import("react").ReactNode[]|import("react").ReactNode|string)} [props.children] The content of the button.
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

export default IconsButton;
