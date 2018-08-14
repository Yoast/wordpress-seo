/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { TreeSelect } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import groupBy from "lodash/groupBy";

/**
 * Returns terms in a tree form.
 *
 * Copied from the gutenberg repo.
 *
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/utils/terms.js
 *
 * @param {Array} flatTerms  Array of terms in flat format.
 *
 * @returns {Array} Array of terms in tree format.
 */
export function buildTermsTree( flatTerms ) {
	const termsByParent = groupBy( flatTerms, "parent" );
	const fillWithChildren = ( terms ) => {
		return terms.map( ( term ) => {
			const children = termsByParent[ term.id ];
			return {
				...term,
				children: children && children.length
					? fillWithChildren( children )
					: [],
			};
		} );
	};

	return fillWithChildren( termsByParent[ "0" ] || [] );
}

class PrimaryTaxonomyPicker extends React.Component {
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );

		const { field_id: fieldId, name } = props.taxonomy;
		this.input = document.getElementById( fieldId );
		props.setPrimaryTaxonomy( name, this.input.value );

		this.state = {
			termsTree: buildTermsTree( props.terms ),
		};
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.terms !== this.props.terms ) {
			this.setState( { termsTree: buildTermsTree( this.props.terms ) } );
		}
	}

	onChange( taxonomyId ) {
		const { name } = this.props.taxonomy;

		this.props.setPrimaryTaxonomy( name, taxonomyId );

		this.input.value = taxonomyId;
	}

	render() {
		const {
			primaryTaxonomy,
		} = this.props;

		return (
			<div className="components-base-control__field">
				<label
					htmlFor="yoast-primary-category-picker"
					className="components-base-control__label">
					Select the primary category
				</label>
				<TreeSelect
					value={ primaryTaxonomy }
					onChange={ this.onChange }
					id="yoast-primary-category-picker"
					tree={ this.state.termsTree }/>
			</div>
		);
	}
}

PrimaryTaxonomyPicker.propTypes = {
	terms: PropTypes.array,
	primaryTaxonomy: PropTypes.string,
	setPrimaryTaxonomy: PropTypes.func,
	taxonomy: PropTypes.shape( {
		name: PropTypes.string,
		field_id: PropTypes.string,
	} ),
};

export default compose( [
	withSelect( select => {
		const coreData = select( "core" );
		const yoastData = select( "yoast-seo/editor" );

		return {
			terms: coreData.getEntityRecords( "taxonomy", "category" ),
			primaryTaxonomy: yoastData.getPrimaryTaxonomy( "category" ),
		};
	} ),
	withDispatch( dispatch => {
		const yoastDispatch = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomy: yoastDispatch.setPrimaryTaxonomy,
		};
	} ),
] )( PrimaryTaxonomyPicker );
