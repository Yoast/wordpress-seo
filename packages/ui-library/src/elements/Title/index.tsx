import React, { FC } from "react";
import cx from "classnames";

export const propertyMap = {
	size: {
		"1": "yst-title-1",
		"2": "yst-title-2",
		"3": "yst-title-3",
		"4": "yst-title-4",
	},
	element: {
		h1: 'h1',
		h2: 'h2',
		h3: 'h3',
		h4: 'h4',
	}
}

interface TitleProps {
	as?: keyof typeof propertyMap.element;
	size?: keyof typeof propertyMap.size;
	className?: string;
	// Handlers
	onClick?: () => void;
	[k: string]: unknown;
}

const Title: FC<TitleProps> = ({
	children,
	as: Component = "h1",
	size = "1",
	className = "",
	...props
}) => {
	const sizeClassName = propertyMap.size[ size ]
	return (
		<Component
			className={cx(
				'yst-title',
				sizeClassName,
				className
			)}
			{...props}
		>
			{ children }
		</Component>
	);
};

export default Title;
