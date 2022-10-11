import { useCallback } from "@wordpress/element";
import classNames from "classnames";
import { includes, without, noop } from "lodash";
import PropTypes from "prop-types";
import Checkbox from "../../elements/checkbox";
import Label from "../../elements/label";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {string} [id] Identifier.
 * @param {string} [name] Name.
 * @param {string[]} [values] Values.
 * @param {string} [label] Label.
 * @param {string} [description] Description.
 * @param {{ value: string, label: string }[]} options Options to choose from.
 * @param {Function} onChange Change handler.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} CheckboxGroup component.
 */
const CheckboxGroup = ( {
	children,
	id,
	name,
	values,
	label,
	description,
	options,
	onChange,
	className,
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => {
		if ( target.checked && ! includes( values, target.value ) ) {
			return onChange( [ ...values, target.value ] );
		}
		onChange( without( values, target.value ) );
	}, [ values, onChange ] );

	return (
		<fieldset
			id={ `checkbox-group-${ id }` }
			className={ classNames( "yst-checkbox-group", className ) }
		>
			<Label as="legend" className="yst-checkbox-group__label" label={ label } />
			{ description && <div className="yst-checkbox-group__description">{ description }</div> }
			<div className="yst-checkbox-group__options">
				{ children || options.map( ( option, index ) => {
					const optionId = `checkbox-${ id }-${ index }`;
					return <Checkbox
						key={ optionId }
						id={ optionId }
						name={ name }
						value={ option.value }
						label={ option.label }
						checked={ includes( values, option.value ) }
						onChange={ handleChange }
						{ ...props }
					/>;
				} ) }
			</div>
		</fieldset>
	);
};

CheckboxGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string,
	name: PropTypes.string,
	values: PropTypes.arrayOf( PropTypes.string ),
	label: PropTypes.string,
	description: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func,
	className: PropTypes.string,
};

CheckboxGroup.defaultProps = {
	children: null,
	id: "",
	name: "",
	values: [],
	label: "",
	description: "",
	onChange: noop,
	className: "",
};

export default CheckboxGroup;
