/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

class TaxonomyPicker extends React.Component {
	componentDidUpdate( prevProps ) {
		// Check if the selected primary taxonomy was removed from the seletced taxonomies for the post.
		const { terms, value } = this.props;
		if ( terms.length > 0 && terms !== prevProps.terms ) {
			const selectedTerm = terms.find( term => {
				return term.id === value;
			} );
			if ( ! selectedTerm ) {
				console.log( terms[ 0 ], value, selectedTerm );
				this.props.onChange( terms[ 0 ].id );
			}
		}
	}

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
