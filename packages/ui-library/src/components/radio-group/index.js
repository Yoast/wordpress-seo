/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Radio from "../../elements/radio";
import Label from "../../elements/label";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio-group--inline-block",
	},
};

/**
 * @param {JSX.node} children Children prop is used for the checkbox label.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} label Label.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children,
	id,
	name,
	options,
	variant,
	className,
	...props
} ) => {
	return (
		<div
			className={ classNames(
				"yst-radio-group",
				classNameMap.variant[ variant ],
				className,
			) }
		>
			{ children && <Label className="yst-mb-3">{ children }</Label> }
			<div className="yst-radio-group__options">
				{ options.map( ( item, index ) => {
					const itemId = `${ id }-${ index }`;
					return <Radio
						key={ itemId }
						id={ itemId }
						name={ name }
						value={ item.value }
						variant={ variant }
						{ ...props }
					>
						{ item.label }
					</Radio>;
				} ) }
			</div>
		</div>
	);
};

RadioGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

RadioGroup.defaultProps = {
	children: null,
	variant: "default",
	className: "",
};

export default RadioGroup;
