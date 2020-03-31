import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupProps, FieldGroupDefaultProps } from "../field-group/FieldGroup";

// Import required CSS.
import "./select.css";
import "../base/typography.css";
import "../base/root.css";
import "../base/icons.css";
import "../base/colors.css";
import "../base/utility.css";

/**
 * MultiSelect using the select2 package.
 */
export class MultiSelect extends React.Component {
	/**
	 * Constructor for the MultiSelect.
	 *
	 * @param {object} props The props for the MultiSelect.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Creates a select2 component from the select and listen to the change action.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.select2 = $( `#${ this.props.id }` );
		this.select2.select2( { containerCssClass: "yoast-multiselect" } );
		this.select2.on( "change.select2", this.onChangeHandler );
	}

	/**
	 * Handler for the onChange event.
	 *
	 * @param {object} event The event that was fired.
	 *
	 * @returns {void}
	 */
	onChangeHandler( event ) {
		// TODO: Remove stub and implement function.
		console.warn( event );
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
			...fieldGroupProps
		} = this.props;
		return (
			<FieldGroup
				htmlFor={ id }
				{ ...fieldGroupProps }
			>
				<select
					multiple="multiple"
					id={ id }
					defaultValue={ selected }
				>
					{ options.map( option => {
						return <option key={ option.value } value={ option.value }>{ option.name }</option>;
					} ) }
				</select>
			</FieldGroup>
		);
	}
}

/**
 * Defines how a select option should look.
 */
const selectOption = PropTypes.shape( { name: PropTypes.string, value: PropTypes.string } );

MultiSelect.propTypes = {
	id: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( selectOption ).isRequired,
	selected: PropTypes.arrayOf( PropTypes.string ),
	...FieldGroupProps,
};

MultiSelect.defaultProps = {
	selected: [],
	...FieldGroupDefaultProps,
};
