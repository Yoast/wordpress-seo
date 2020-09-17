import React, { Fragment } from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";
import { getId } from "../GenerateId";
// Import required CSS.
import "./checkbox.css";

/**
 * Proptypes for the vertical and horizontal checkboxes components.
 */
const checkboxesProps = {
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
	} ) ).isRequired,
	checked: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

/**
 * Function that checks whether the ID is in an array of ids.
 *
 * @param {string} id An ID of an individual checkbox.
 * @param {string[]} checkedIds An array of ids of the checkboxes that are checked.
 *
 * @returns {bool} true if id is in checkedIds, false otherwise.
 */
const isChecked = ( id, checkedIds ) => checkedIds.indexOf( id ) !== -1;

/**
 * Smallest component in the CheckboxGroup. Contains a label and the checkbox.
 *
 * @param {string} id The ID of te checkbox.
 * @param {string} label The label of the checkbox.
 * @param {function} onChange The onChange handler.
 *
 * @returns {React.Component} A React component that wraps around the HTML checkbox.
 */
const Checkbox = ( { id, label, checked } ) => <Fragment>
	<input type="checkbox" id={ id } defaultChecked={ checked } />
	<label htmlFor={ id } className="yoast-field-group__checkbox">{ label }</label>
</Fragment>;

Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	checked: PropTypes.bool,
};

Checkbox.defaultProps = {
	checked: false,
};

/**
 * Component that renders a vertical list of checkboxes with their labels.
 *
 * @param {Object[]} options An array of options of the checkboxes.
 * @param {string[]} checked An array of ids that are checked.
 *
 * @returns {*} A React component that contains a list of vertical checkboxes.
 */
const VerticalCheckboxes = ( { options, checked } ) => {
	return options.map( option => {
		return (
			<div key={ option.id } className="yoast-field-group__checkbox">
				<Checkbox { ...option } checked={ isChecked( option.id, checked ) } />
			</div>
		);
	} );
};

VerticalCheckboxes.propTypes = checkboxesProps;

/**
 * React component that renders a list of horizontal checkboxes.
 *
 * @param {object[]} options An array of checkbox options.
 * @param {string[]} checked An array of ids that are checked.
 *
 * @returns {*} A React component that renders a list of horizontal checkboxes.
 */
const HorizontalCheckboxes = ( { options, checked } ) => {
	return <div className="yoast-field-group__checkbox yoast-field-group__checkbox--horizontal">
		{ options.map( option =>
			<Checkbox key={ option.id } { ...option } checked={ isChecked( option.id, checked ) } />
		) }
	</div>;
};

HorizontalCheckboxes.propTypes = checkboxesProps;

/**
 * This component renders a list of vertical or horizontal checkboxes based on the provided props.
 *
 * @param {object} props The props required for this component.
 *
 * @returns {React.Component} A list of checkboxes.
 */
class CheckboxGroup extends React.Component {
	/**
	 * Constructor for the CheckboxGroup class.
	 *
	 * @param {object} props Component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		this.state = {
			checked: props.checked,
		};
		this.onChangeHandler = this.onChangeHandler.bind( this );
	}

	/**
	 * Handles the onChange events of the checkboxes and calls the onChange props with an array of checked ids.
	 *
	 * @param {object} event The event object.
	 *
	 * @returns {void}
	 */
	onChangeHandler( event ) {
		const target = event.target;
		const checked = this.state.checked;
		const updated = target.checked ? checked.concat( target.id ) : checked.filter( item => item !== target.id );
		this.setState( {
			checked: updated,
		} );
		this.props.onChange( updated );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {React.Component} The CheckboxGroup component.
	 */
	render() {
		const {
			id,
			options,
			vertical,
			...fieldGroupProps
		} = this.props;
		const componentId = getId( id );

		const checkboxProps = {
			options,
			checked: this.state.checked,
		};

		return (
			<FieldGroup
				{ ...fieldGroupProps }
				htmlFor={ componentId }
			>
				<div onChange={ this.onChangeHandler }>
					{ vertical
						? <VerticalCheckboxes { ...checkboxProps } />
						: <HorizontalCheckboxes { ...checkboxProps } />
					}
				</div>
			</FieldGroup>
		);
	}
}


CheckboxGroup.propTypes = {
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string.isRequired,
		id: PropTypes.string,
	} ) ).isRequired,
	vertical: PropTypes.bool,
	checked: PropTypes.arrayOf( PropTypes.string ),
	onChange: PropTypes.func,
	...FieldGroupProps,
};

CheckboxGroup.defaultProps = {
	vertical: true,
	checked: [],
	onChange: () => {},
	...FieldGroupDefaultProps,
};

export default CheckboxGroup;
