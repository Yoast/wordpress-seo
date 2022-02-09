import React, { FC } from "react";
import cx from "classnames";

const classNameMap = {
	variant: {
		default: "", // Default is currentColor.
		white: "yst-text-white",
	},
	size: {
		3: "yst-w-3 yst-h-3",
		4: "yst-w-4 yst-h-4",
		8: "yst-w-8 yst-h-8",
	},
};

type SpinnerProps = {
    variant?: keyof typeof classNameMap.variant;
    size?: keyof typeof classNameMap.size;
    className?: string;
}

const Spinner: FC<SpinnerProps> = ( {
	variant = "default",
	size = 4,
	className = "",
} ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg/"
		fill="none"
		viewBox="0 0 24 24"
		className={ cx(
			"yst-animate-spin",
			classNameMap.variant[ variant ],
			classNameMap.size[ size ],
			className,
		) }
	>
		<circle className="yst-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
		<path className="yst-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
	</svg>
);

export default Spinner;