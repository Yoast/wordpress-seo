import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps, FieldGroupDefaultProps } from "../field-group/FieldGroup";
import { default as ReactSelect } from "react-select";

// Import required CSS.
import "./select.css";

/**
 * Defines how a select option should look.
 */
const selectOption = PropTypes.shape( { name: PropTypes.string, value: PropTypes.string } );
const selectProps = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string,
	options: PropTypes.arrayOf( selectOption ).isRequired,
	selected: PropTypes.oneOfType( [ PropTypes.arrayOf( PropTypes.string ), PropTypes.string ] ),
	onChange: PropTypes.func,
	...FieldGroupProps,
};
const selectDefaultProps = {
	name: "",
	selected: [],
	onChange: () => {},
	...FieldGroupDefaultProps,
};

/**
 * Renders a HTML option based on a name and value.
 *
 * @param {string} name The name of the option.
 * @param {string} value The value of the option.
 *
 * @returns {React.Component} An HTML option.
 */
const Option = ( { name, value } ) => <option key={ value } value={ value }>{ name }</option>;

Option.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
};

/* eslint-disable jsx-a11y/no-onchange*/
/**
 * Function to map options to a react-select compatible array.
 *
 * @param {Option[]} options Select options.
 *
 * @returns {object[]} An react-select compatible array of options.
 */
const changeOptionFormatToReactSelect = ( options ) => {
	return options.map( option => {
		return {
			value: option.value,
			label: option.name,
		};
	} );
};

/**
 * MultiSelect using the react-select package.
 *
 * @param {object} props The functional component props.
 *
 * @returns {React.Component} The react-select MultiSelect.
 */
export const MultiSelect = ( props ) => {
	const {
		id,
		inputId,
		selected,
		options,
		name,
		onChange,
		...fieldGroupProps
	} = props;

	// Make sure to pass an array of options to the multiselect.
	const selections = Array.isArray( selected ) ? selected : [ selected ];

	const reactSelectOptions = changeOptionFormatToReactSelect( options );
	const selectedOptions = reactSelectOptions.filter( option => selections.includes( option.value ) );

	const onChangeHandler = useCallback( selection => {
		// Make sure that selection is always an array.
		if ( ! selection ) {
			selection = [];
		}

		// Only call the onChange handler on the selected values.
		 onChange( selection.map( option => option.value ) );
	} );

	return (
		<FieldGroup
			{ ...fieldGroupProps }
			htmlFor={ id }
		>
			<ReactSelect
				isMulti={ true }
				id={ id }
				inputId={ inputId }
				name={ `${ name }[]` }
				value={ selectedOptions }
				options={ reactSelectOptions }
				hideSelectedOptions={ false }
				onChange={ onChangeHandler }
				className="yoast-select-container"
				classNamePrefix="yoast-select"
				isClearable={ false }
				isSearchable={ false }
				placeholder=""
			/>
		</FieldGroup>
	);
};

MultiSelect.propTypes = {
	...selectProps,
	inputId: PropTypes.string,
};
MultiSelect.defaultProps = {
	...selectDefaultProps,
	inputId: null,
};

/**
 * React wrapper for a basic HTML select.
 */
export class Select extends React.Component {
	/**
	 * Class constructor.
	 *
	 * @param {object} props Class props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		this.onBlurHandler = this.onBlurHandler.bind( this );
		this.onInputHandler = this.onInputHandler.bind( this );

		this.state = {
			selected: this.props.selected,
		};
	}

	/**
	 * Handles the onBlur event of the select.
	 *
	 * We are using onBlur because onChange can negatively impact the a11y.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
	onBlurHandler( event ) {
		// The selected option is set as the value on the complete select component.
		this.props.onChange( event.target.value );
	}

	/**
	 * Passes the target's name and input value to the onOptionFocus function if it exists.
	 *
	 * NOTE: Please do not pass functions to props.onOptionFocus that would induce a context change in the DOM (navigation, focus changes).
	 *       This is an a11y concern, because it disorients keyboard and screenreader users.
	 *
	 * @param {Event} event The event triggered by an Input.
	 *
	 * @returns {void}
	 */
	onInputHandler( event ) {
		// Need to update the state in order to show the selected result before blurring.
		this.setState( { selected: event.target.value } );
		if ( this.onOptionFocus ) {
			this.props.onOptionFocus( event.target.name, event.target.value );
		}
	}

	/**
	 * Compare props to decide whether the selected state has changed.
	 *
	 * @param {Object} prevProps The previous props
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( prevProps.selected !== this.props.selected ) {
			this.setState( { selected: this.props.selected } );
		}
	}
	/**
	 * Render function for component.
	 *
	 * @returns {void}
	 */
	render() {
		const {
			id,
			options,
			name,
			...fieldGroupProps
		} = this.props;

		return (
			<FieldGroup
				{ ...fieldGroupProps }
				htmlFor={ id }
			>
				<select
					id={ id }
					name={ name }
					value={ this.state.selected }
					onBlur={ this.onBlurHandler }
					onInput={ this.onInputHandler }
				>
					{ options.map( Option ) }
				</select>
			</FieldGroup>
		);
	}
}

Select.propTypes = {
	...selectProps,
	onOptionFocus: PropTypes.func,
};
Select.defaultProps = {
	...selectDefaultProps,
	onOptionFocus: null,
};
