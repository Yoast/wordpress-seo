import React, { ElementType, FC } from  "react";
import cx from "classnames";

interface TitleProps {
    as?: ElementType;
	size?: "1" | "2" | "3" | "4" | "5" | "6";
	className?: string;
	// Handlers
	onClick?: () => void;
    [k: string]: unknown;
}

const sizeClassMap = {
	1: "",
	2: "",
	3: "",
	4: "",
	5: "",
	6: "",
}

const Title: FC<TitleProps> = ( {
	children,
	as: Component = "h1",
	size = "1",
	className = "",
	...props
} ) => {
	const sizeClassName = sizeClassMap[ size ]
	return (
		<Component
			className={ cx( sizeClassName, className ) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

export default Title;