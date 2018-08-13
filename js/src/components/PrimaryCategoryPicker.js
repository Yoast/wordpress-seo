import React from "react";
import PropTypes from "prop-types";
import { withSelect } from "@wordpress/data";
import { TreeSelect } from "@wordpress/components";
import { compose } from "@wordpress/element";
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

class PrimaryCategoryPicker extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			categoriesTree: buildTermsTree( props.categories )
		};
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.categories !== this.props.categories ) {
			this.setState( { categoriesTree: buildTermsTree( this.props.categories ) } );
		}
	}

	render() {
		const {
			primaryCategory,
		} = this.props;

		return (
			<div className="components-base-control__field">
				<label
					htmlFor="yoast-primary-category-selector"
					className="components-base-control__label">
					Select the primary category
				</label>
				<TreeSelect
					value={ primaryCategory }
					onChange={ console.log }
					id="yoast-primary-category-selector"
					tree={ this.state.categoriesTree }/>
			</div>
		);
	}
}

PrimaryCategoryPicker.propTypes = {
	categories: PropTypes.array,
};

export default withSelect( select => {
	const coreData = select( "core" );
	const yoastData = select( "yoast-seo/editor" );

	return {
		categories: coreData.getEntityRecords( "taxonomy", "category" ),
		primaryCategory: yoastData.getPrimaryCategory(),
	};
} )( PrimaryCategoryPicker );
