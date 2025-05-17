import { noop } from "lodash";
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
	disabled: PropTypes.bool,
	...FieldGroupProps,
};
const selectDefaultProps = {
	name: "",
	selected: [],
	onChange: () => {},
	disabled: false,
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
 * ReactSelect using the react-select package.
 *
 * @param {object} props The functional component props.
 *
 * @returns {React.Component} The react-select ReactSelect component.
 */
export const YoastReactSelect = ( props ) => {
	const {
		id,
		isMulti,
		isSearchable,
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

	return (
		<FieldGroup
			{ ...fieldGroupProps }
			htmlFor={ inputId }
		>
			<ReactSelect
				isMulti={ isMulti }
				id={ id }
				name={ name }
				inputId={ inputId }
				value={ selectedOptions }
				options={ reactSelectOptions }
				hideSelectedOptions={ false }
				onChange={ onChange }
				className="yoast-select-container"
				classNamePrefix="yoast-select"
				isClearable={ false }
				isSearchable={ isSearchable }
				placeholder=""
			/>
		</FieldGroup>
	);
};

YoastReactSelect.propTypes = selectProps;
YoastReactSelect.defaultProps = selectDefaultProps;

/**
 * SingleSelect component.
 * @param {object} props The functional component props.
 *
 * @returns {React.Component} The react-select MultiSelect component.
 */
export const SingleSelect = ( props ) => {
	const { onChange } = props;

	const onChangeHandler = useCallback( selection => onChange( selection.value ) );
	return <YoastReactSelect
		{ ...props }
		isMulti={ false }
		isSearchable={ true }
		onChange={ onChangeHandler }
	/>;
};

SingleSelect.propTypes = selectProps;
SingleSelect.defaultProps = selectDefaultProps;

/**
 * MultiSelect component.
 * @param {object} props The functional component props.
 *
 * @returns {React.Component} The react-select MultiSelect component.
 */
export const MultiSelect = ( props ) => {
	const { onChange } = props;

	const onChangeHandler = useCallback( selection => {
		// Make sure that selection is always an array.
		if ( ! selection ) {
			selection = [];
		}

		// Only call the onChange handler on the selected values.
		onChange( selection.map( option => option.value ) );
	} );

	return <YoastReactSelect
		{ ...props }
		isMulti={ true }
		isSearchable={ false }
		onChange={ onChangeHandler }
	/>;
};

MultiSelect.propTypes = selectProps;
MultiSelect.defaultProps = selectDefaultProps;

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
		if ( this.props.onOptionFocus ) {
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
			disabled,
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
					onChange={ noop }
					disabled={ disabled }
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
