import { useCallback } from "@wordpress/element";
import { AutocompleteField } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import PropTypes from "prop-types";


/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @param {string} props.className The className.
 * @param {array} props.options The options.
 * @returns {JSX.Element} The page select component.
 */
const FormikAutocompleteField = ( { name, id, options, className = "", ...props } ) => {
	const [ field, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );

	const handleChange = useCallback( newValue => {
		// setTouched( true, false );
		setValue( newValue );
	}, [ setValue, setTouched ] );

	const handleQueryChange = useCallback( event => {
	    setValue( event.target.value );
	}, [ setValue ] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			selectedLabel={ field.value }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
			className={ classNames( className, props.disabled && "yst-autocomplete--disabled" ) }
			{ ...props }
		>
			{ options && options.map( ( option ) =>
				<AutocompleteField.Option key={ option.value } value={ option.value }>
					{ option.label }
				</AutocompleteField.Option>
			) }

		</AutocompleteField>
	);
};

FormikAutocompleteField.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	options: PropTypes.array,
};

export default FormikAutocompleteField;
