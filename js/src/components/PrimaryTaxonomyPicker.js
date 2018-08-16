/* global wp */
/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { sprintf, __ } from "@wordpress/i18n";
import styled from "styled-components";
import diff from "lodash/difference";

/* Internal dependencies */
import TaxonomyPicker from "./TaxonomyPicker";

const PrimaryTaxonomyPickerLabel = styled.label`
	padding-top: 16px;
`;

/**
 * A component for selecting a primary taxonomy term.
 */
class PrimaryTaxonomyPicker extends React.Component {
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
		this.updateReplacementVariable = this.updateReplacementVariable.bind( this );

		const { fieldId, name } = props.taxonomy;
		this.input = document.getElementById( fieldId );
		props.setPrimaryTaxonomyId( name, parseInt( this.input.value, 10 ) );

		this.state = {
			selectedTerms: [],
			terms: [],
		};
	}

	/**
	 * Fetches the terms for the given taxonomy.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.fetchTerms();
	}

	/**
	 * Handle prop changes when needed.
	 *
	 * @param {Object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		// Check if a term has been added and retrieve new terms if so.
		if ( prevProps.selectedTermIds.length < this.props.selectedTermIds.length ) {
			const newId = diff( this.props.selectedTermIds, prevProps.selectedTermIds )[ 0 ];
			if( ! this.termIsAvailable( newId ) ) {
				this.fetchTerms();
				return;
			}
		}
		// Check if the selected terms have changed.
		if ( prevProps.selectedTermIds !== this.props.selectedTermIds ) {
			this.updateSelectedTerms( this.state.terms, this.props.selectedTermIds );
		}
	}

	/**
	 * Determines whether the term with the given id is among the retrieved terms.
	 *
	 * @param {number} termId The term's id.
	 *
	 * @returns {boolean} Whther the term is available.
	 */
	termIsAvailable( termId ) {
		return !! this.state.terms.find( term => term.id === termId );
	}

	/**
	 * Fetches the terms from the WordPress API.
	 *
	 * @returns {void}
	 */
	fetchTerms() {
		const TaxonomyCollection = wp.api.getCollectionByRoute( `/wp/v2/${ this.props.taxonomy.restBase }` );
		if ( ! TaxonomyCollection ) {
			return;
		}
		const collection = new TaxonomyCollection();
		collection.fetch( {
			data: {
				per_page: -1,
				orderby: "count",
				order: "desc",
				_fields: [ "id", "name" ],
			},
		} ).then( terms => {
			const oldState = this.state;
			this.setState( {
				terms,
				selectedTerms: this.getSelectedTerms( terms, this.props.selectedTermIds ),
			}, () => {
				if ( oldState.terms.length === 0 && this.state.terms.length > 0 ) {
					this.updateReplacementVariable( this.props.primaryTaxonomy );
				}
			} );
		} );
	}

	/**
	 * Determines what terms are selected.
	 *
	 * @param {Array} terms           The available terms.
	 * @param {Array} selectedTermIds The ids of the selected terms.
	 *
	 * @returns {Array} The selected terms.
	 */
	getSelectedTerms( terms, selectedTermIds ) {
		return terms.filter( term => {
			return selectedTermIds.includes( term.id );
		} );
	}

	/**
	 * Updates the state with the selected terms.
	 *
	 * @param {Array} terms           The available terms.
	 * @param {Array} selectedTermIds The ids of the selected terms.
	 *
	 * @returns {void}
	 */
	updateSelectedTerms( terms, selectedTermIds ) {
		const selectedTerms = this.getSelectedTerms( terms, selectedTermIds );
		this.setState( {
			selectedTerms,
		} );
	}

	/**
	 * Handles an onChange event.
	 *
	 * Updates the primary taxonomy in the store, as well as the replacement variable and the hidden field.
	 *
	 * @param {number} termId The term's id.
	 *
	 * @returns {void}
	 */
	onChange( termId ) {
		const termIdNum = typeof termId === "string" ? parseInt( termId, 10 ) : termId;

		const { name } = this.props.taxonomy;

		this.updateReplacementVariable( termIdNum );

		this.props.setPrimaryTaxonomyId( name, termIdNum );

		this.input.value = termIdNum === -1 ? "" : termIdNum;
	}

	/**
	 * Updates the primary taxonomy replacement variable.
	 *
	 * @param {number} termId The term's id.
	 *
	 * @returns {void}
	 */
	updateReplacementVariable( termId ) {
		/**
		 * We only use the primary category replacement variable, therefore only do this for the
		 * category taxonomy.
		 */
		if ( this.props.taxonomy.name !== "category" ) {
			return;
		}
		const primaryTerm = this.state.selectedTerms.find( term => term.id === termId );
		if ( primaryTerm ) {
			this.props.updateReplacementVariable( `primary_${ this.props.taxonomy.name }`, primaryTerm.name );
		}
	}

	/**
	 * Renders the PrimaryTaxonomyPicker component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		const {
			primaryTaxonomy,
			taxonomy,
		} = this.props;

		const fieldId = `yoast-primary-${ taxonomy.name }-picker`;

		return (
			<div className="components-base-control__field">
				<PrimaryTaxonomyPickerLabel
					htmlFor={ fieldId }
					className="components-base-control__label">
					{
						sprintf(
							/* Translators: %s expands to the taxonomy name */
							__( "Select the primary %s" ),
							taxonomy.singularLabel.toLowerCase()
						)
					}
				</PrimaryTaxonomyPickerLabel>
				<TaxonomyPicker
					value={ primaryTaxonomy }
					onChange={ this.onChange }
					id={ fieldId }
					terms={ this.state.selectedTerms }/>
			</div>
		);
	}
}

PrimaryTaxonomyPicker.propTypes = {
	selectedTermIds: PropTypes.arrayOf( PropTypes.number ),
	primaryTaxonomy: PropTypes.string,
	setPrimaryTaxonomyId: PropTypes.func,
	updateReplacementVariable: PropTypes.func,
	receiveEntityRecords: PropTypes.func,
	taxonomy: PropTypes.shape( {
		name: PropTypes.string,
		fieldId: PropTypes.string,
		restBase: PropTypes.string,
		singularLabel: PropTypes.string,
	} ),
};

export default compose( [
	withSelect( ( select, props ) => {
		const editorData = select( "core/editor" );
		const yoastData = select( "yoast-seo/editor" );

		const { taxonomy } = props;

		const selectedTermIds = editorData.getEditedPostAttribute( taxonomy.restBase ) || [];

		return {
			selectedTermIds,
			primaryTaxonomy: yoastData.getPrimaryTaxonomyId( taxonomy.name ),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		} = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomyId,
			updateReplacementVariable,
		};
	} ),
] )( PrimaryTaxonomyPicker );
