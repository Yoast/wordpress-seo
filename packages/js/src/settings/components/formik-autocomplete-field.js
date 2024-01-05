import { useCallback, useState, useEffect } from "@wordpress/element";
import { AutocompleteField } from "@yoast/ui-library";
import classNames from "classnames";
import { useField } from "formik";
import PropTypes from "prop-types";


/**
 * @param {Object} props The props object.
 * @param {string} props.name The field name.
 * @param {string} props.id The field id.
 * @param {boolean} props.disabled Whether the field is disabled.
 * @param {string} props.className The className.
 * @param {array} props.options The options.
 * @returns {JSX.Element} The page select component.
 */
const FormikAutocompleteField = ( { name, id, disabled, options, className, ...props } ) => {
	const [ field, , { setTouched, setValue } ] = useField( { type: "select", name, id, ...props } );
	const [ selectedLabel, setSelectedLabel ] = useState( "" );

	/**
	 * Sets the selected label.
	 * @param {string} value The selected value.
	 * @returns {void}
	 */
	const handleSelectedLabel = ( value ) => {
		if ( value && options.find( option => option.value === value )?.label ) {
			setSelectedLabel( options.find( option => option.value === value ).label );
		} else {
			setSelectedLabel( value );
		}
	};

	const handleChange = useCallback( newValue => {
		setValue( newValue );
		handleSelectedLabel( newValue );
	}, [ setValue, setTouched ] );

	const handleQueryChange = useCallback( event => {
	    setValue( event.target.value );
		handleSelectedLabel( event.target.value );
	}, [ setValue ] );

	useEffect( () => {
		handleSelectedLabel( field.value );
	}, [] );

	return (
		<AutocompleteField
			{ ...field }
			name={ name }
			id={ id }
			selectedLabel={ selectedLabel }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
			className={ classNames( className, disabled && "yst-autocomplete--disabled" ) }
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

FormikAutocompleteField.defaultProps = {
	disabled: false,
	className: "",
	options: [],
};

export default FormikAutocompleteField;
