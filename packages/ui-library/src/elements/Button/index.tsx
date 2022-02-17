import React, { ElementType, FC } from  "react";
import classNames from "classnames";

import Spinner from "../Spinner";

const classNameMap = {
	variant: {
		primary: "yst-button-primary",
		secondary: "yst-button-secondary",
		error: "yst-button-error",
	},
	size: {
		default: "",
		small: "yst-button-small",
		large: "yst-button-large",
	},
};

interface ButtonProps {
    as?: ElementType;
	type?: "button" | "submit";
	variant?: keyof typeof classNameMap.variant;
	size?: keyof typeof classNameMap.size;
	isLoading?: boolean;
	isDisabled?: boolean;
	className?: string;
	onClick?: () => void;
    [k: string]: unknown; // Wilcard: all props allowed.
}

const Button: FC<ButtonProps> = ( {
	children,
	as: Component = "button",
	type = "button",
	variant = "primary",
	size = "default",
	isLoading = false,
	isDisabled = false,
	className = "",
	...props
} ) => (
	<Component
		type={ type }
		disabled={ isDisabled }
		className={ classNames(
			"yst-button",
			classNameMap.variant[ variant ],
			classNameMap.size[ size ],
			className,
		) }
		{ ...props }
	>
		{ isLoading && <Spinner size={ size === "small" ? 3 : 4 } className="yst-mr-2" /> }
		{ children }
	</Component>
);

export default Button;