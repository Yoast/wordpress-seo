import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps, FieldGroupDefaultProps } from "../field-group/FieldGroup";
import ErrorWithUrl from "../../internal/ErrorWithUrl";
import ErrorBoundary from "../../internal/ErrorBoundary";

// Import required CSS.
import "./select.css";

/**
 * Defines how a select option should look.
 */
const selectOption = PropTypes.shape( { name: PropTypes.string, value: PropTypes.string } );
const selectProps = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( selectOption ).isRequired,
	selected: PropTypes.oneOfType( [ PropTypes.arrayOf( PropTypes.string ), PropTypes.string ] ),
	onChange: PropTypes.func,
	...FieldGroupProps,
};
const selectDefaultProps = {
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

/**
 * MultiSelect using the select2 package.
 */
class MultiSelect extends React.Component {
	/**
	 * Constructor for the MultiSelect.
	 *
	 * @param {object} props The props for the MultiSelect.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		// Make sure that both jQuery and select2 are defined on the global window.
		if ( typeof window.jQuery === "undefined" || typeof window.jQuery().select2 === "undefined" ) {
			throw new ErrorWithUrl(
				"Make sure to read our docs about the requirements for the MultiSelect.",
				"https://github.com/Yoast/javascript/blob/develop/packages/components/README.md#using-the-multiselect"
			);
		}

		super( props );
		this.onChangeHandler = this.onChangeHandler.bind( this );
	}

	/**
	 * Creates a select2 component from the select and listen to the change action.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.select2 = jQuery( `#${ this.props.id }` );
		this.select2.select2();
		this.select2.on( "change.select2", this.onChangeHandler );
	}

	/**
	 * Handler for the onChange event.
	 *
	 * @param {object} event The event that was fired.
	 *
	 * @returns {void}
	 */
	onChangeHandler() {
		// It is easier to query the select for the selected options than keep track of them in this component as well.
		const selection = this.select2.select2( "data" ).map( option => option.id );
		this.props.onChange( selection );
	}

	/**
	 * Renders the MultiSelect component.
	 *
	 * @returns {React.Component} The MultiSelect.
	 */
	render() {
		const {
			id,
			selected,
			options,
			name,
			...fieldGroupProps
		} = this.props;

		// Make sure to pass an array of options to the multiselect.
		const selections = Array.isArray( selected ) ? selected : [ selected ];

		return (
			<FieldGroup
				htmlFor={ id }
				{ ...fieldGroupProps }
			>
				<select
					multiple="multiple"
					id={ id }
					name={ `${ name }[]` }
					defaultValue={ selections }
				>
					{ options.map( Option ) }
				</select>
			</FieldGroup>
		);
	}
}

MultiSelect.propTypes = selectProps;
MultiSelect.defaultProps = selectDefaultProps;

/**
 * Renders the MultiSelect inside its own ErrorBoundary to prevent errors from bubbling up.
 *
 * @param {object} props The props for the MultiSelect.
 *
 * @returns {React.Component} The MultiSelect wrapped in an ErrorBoundary.
 */
const MultiSelectWithErrorBoundary = ( props ) => (
	<ErrorBoundary>
		<MultiSelect { ...props } />
	</ErrorBoundary>
);

MultiSelectWithErrorBoundary.propTypes = selectProps;
MultiSelectWithErrorBoundary.defaultProps = selectDefaultProps;

export { MultiSelectWithErrorBoundary as MultiSelect };

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
	 * Render function for component.
	 *
	 * @returns {void}
	 */
	render() {
		const {
			id,
			selected,
			options,
			name,
			...fieldGroupProps
		} = this.props;

		// Make sure to pass a single option when it is a normal select.
		const selection = Array.isArray( selected ) ? selected[ 0 ] : selected;

		return (
			<FieldGroup
				htmlFor={ id }
				{ ...fieldGroupProps }
			>
				<select
					id={ id }
					name={ name }
					defaultValue={ selection }
					onBlur={ this.onBlurHandler }
				>
					{ options.map( Option ) }
				</select>
			</FieldGroup>
		);
	}
}

Select.propTypes = selectProps;
Select.defaultProps = selectDefaultProps;
