/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import Select from "../../elements/select";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id Identifier.
 * @param {string} value Selected value.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {Function} onChange Change callback.
 * @param {JSX.Element} error Error node.
 * @param {string} [className] Optional CSS class.
 * @param {string} label Label.
 * @param {JSX.node} [children] Optional description.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} SelectField component.
 */
const SelectField = ( {
	children,
	id,
	value,
	options,
	label,
	onChange,
	error,
	className,
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { error, description: children } );

	return (
		<div className={ classNames( "yst-select-field", className ) }>
			<Label className="yst-select-field__label" label={ label } />
			<Select
				id={ id }
				value={ value }
				options={ options }
				onChange={ onChange }
				isError={ Boolean( error ) }
				className="yst-select-field__select"
				buttonProps={ { "aria-describedby": describedBy } }
				{ ...props }
			/>
			{ error && <p id={ ids.error } className="yst-select-field__error">{ error }</p> }
			{ children && <div id={ ids.description } className="yst-select-field__description">{ children }</div> }
		</div>
	);
};

SelectField.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.node,
	className: PropTypes.string,
};

SelectField.defaultProps = {
	children: null,
	value: undefined,
	error: null,
	className: "",
};

export default SelectField;
