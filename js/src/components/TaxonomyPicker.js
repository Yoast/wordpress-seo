/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

/**
 * A select box for selecting a taxonomy.
 *
 * Also calls `onChange` prop when the currently selected options is no longer available.
 */
class TaxonomyPicker extends React.Component {
	/**
	 * Checks if the terms have changes and calls the appropriate handler.
	 *
	 * @param {Object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		const { terms } = this.props;
		if ( terms !== prevProps.terms ) {
			this.handleTermsChange();
		}
	}

	/**
	 * Checks if the current value still has a corresponding option, and if not changes
	 * the value to the first term's id.
	 *
	 * @returns {void}
	 */
	handleTermsChange() {
		const { terms, value } = this.props;
		const selectedTerm = terms.find( term => {
			return term.id === value;
		} );
		if ( ! selectedTerm ) {
			this.props.onChange( terms.length ? terms[ 0 ].id : -1 );
		}
	}

	/**
	 * Renders the TaxonomyPicker component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		const {
			value,
			id,
			terms,
			onChange,
		} = this.props;

		return (
			<select
				disabled={ terms.length < 2 }
				className="components-select-control__input"
				id={ id }
				value={ value }
				onChange={ e => {
					onChange( e.target.value );
				} } >
				{
					terms.map( term => {
						return (
							<option
								key={ term.id }
								value={ term.id }>
								{ term.name }
							</option>
						);
					} )
				}
			</select>
		);
	}
}

TaxonomyPicker.propTypes = {
	terms: PropTypes.arrayOf( PropTypes.shape( {
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func.isRequired,
	id: PropTypes.string,
	value: PropTypes.string,
};

export default TaxonomyPicker;
