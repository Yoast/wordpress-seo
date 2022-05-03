import { CheckCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";
import Label from "../label";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio--inline-block",
	},
};

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} label Label.
 * @param {string} srLabel Screen reader label.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( {
	id,
	name,
	value,
	label,
	srLabel,
	variant,
	className,
	...props
} ) => {
	const svgAriaProps = useSvgAria();

	if ( variant === "inline-block" ) {
		return (
			<div
				className={ classNames(
					"yst-radio",
					"yst-radio--inline-block",
					className,
				) }
			>
				<input
					type="radio"
					id={ id }
					name={ name }
					value={ value }
					className="yst-radio__input"
					aria-label={ srLabel }
					{ ...props }
				/>
				<span className="yst-radio__content">
					<Label htmlFor={ id } className="yst-radio__label" label={ label } />
					<CheckCircleIcon className="yst-radio__check" { ...svgAriaProps } />
				</span>
			</div>
		);
	}

	return (
		<div
			className={ classNames(
				"yst-radio",
				className,
			) }
		>
			<input
				type="radio"
				id={ id }
				name={ name }
				value={ value }
				className="yst-radio__input"
				{ ...props }
			/>
			<Label htmlFor={ id } className="yst-radio__label" label={ label } />
		</div>
	);
};

Radio.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	srLabel: PropTypes.string,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

Radio.defaultProps = {
	srLabel: "",
	variant: "default",
	className: "",
};

export default Radio;
