/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import { CheckCircleIcon } from "@heroicons/react/solid";

import Label from "../label";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio--inline-block",
	},
};

/**
 * @param {JSX.node} children Children prop is used for the checkbox label.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( {
	children,
	id,
	name,
	value,
	variant,
	className,
	...props
} ) => {
	if ( variant === "inline-block" ) {
		return (
			<div className="yst-inline-flex yst-items-center">
				<input
					type="radio"
					id={ id }
					name={ name }
					value={ value }
					className="yst-radio yst-radio--inline-block"
					{ ...props }
				/>
				<label
					htmlFor={ id }
					className={ classNames(
						"yst-radio__label",
						className,
					) }
				>
					{ children }
					<CheckCircleIcon className="yst-radio__check" />
				</label>
			</div>
		);
	}

	return (
		<div className="yst-flex yst-items-center">
			<input
				type="radio"
				id={ id }
				name={ name }
				value={ value }
				className={ classNames(
					"yst-radio",
					children && "yst-mr-3",
					className,
				) }
				{ ...props }
			/>
			{ children && <Label htmlFor={ id } className="yst-radio__label">{ children }</Label> }
		</div>
	);
};

Radio.propTypes = {
	children: PropTypes.node,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

Radio.defaultProps = {
	children: null,
	variant: "default",
	className: "",
};

export default Radio;
