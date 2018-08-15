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

		const { field_id: fieldId, name } = props.taxonomy;
		this.input = document.getElementById( fieldId );
		props.setPrimaryTaxonomy( name, parseInt( this.input.value, 10 ) );

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
	 * Updates the replacement variable when the terms were not yet retrieved on mount.
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
		const TaxonomyCollection = wp.api.getCollectionByRoute( `/wp/v2/${ this.props.taxonomy.rest_base }` );
		if ( ! TaxonomyCollection ) {
			return;
		}
		const collection = new TaxonomyCollection();
		collection.fetch().then( terms => {
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
	 * @param {array} terms           The available terms.
	 * @param {array} selectedTermIds The ids of the selected terms.
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
		const { name } = this.props.taxonomy;

		this.updateReplacementVariable( termId );

		this.props.setPrimaryTaxonomy( name, termId );

		this.input.value = termId;
	}

	/**
	 * Updates the primary taxonomy replacement variable.
	 *
	 * @param {number} termId The term's id.
	 *
	 * @returns {void}
	 */
	updateReplacementVariable( termId ) {
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
		} = this.props;

		return (
			<div className="components-base-control__field">
				<PrimaryTaxonomyPickerLabel
					htmlFor="yoast-primary-category-picker"
					className="components-base-control__label">
					{
						sprintf(
							/* Translators: %s: category name */
							__( "Select the primary %s" ),
							this.props.taxonomy.singular_label.toLowerCase()
						)
					}
				</PrimaryTaxonomyPickerLabel>
				<TaxonomyPicker
					value={ primaryTaxonomy }
					onChange={ this.onChange }
					id="yoast-primary-category-picker"
					terms={ this.state.selectedTerms }/>
			</div>
		);
	}
}

PrimaryTaxonomyPicker.propTypes = {
	selectedTermIds: PropTypes.arrayOf( PropTypes.number ),
	primaryTaxonomy: PropTypes.string,
	setPrimaryTaxonomy: PropTypes.func,
	updateReplacementVariable: PropTypes.func,
	receiveEntityRecords: PropTypes.func,
	taxonomy: PropTypes.shape( {
		name: PropTypes.string,
		/* eslint-disable */
		field_id: PropTypes.string,
		rest_base: PropTypes.string,
		singular_label: PropTypes.string,
		/* eslint-enable */
	} ),
};

export default compose( [
	withSelect( ( select, props ) => {
		const editorData = select( "core/editor" );
		const yoastData = select( "yoast-seo/editor" );

		const { taxonomy } = props;

		const selectedTermIds = editorData.getEditedPostAttribute( taxonomy[ "rest_base" ] ) || [];

		return {
			selectedTermIds,
			primaryTaxonomy: yoastData.getPrimaryTaxonomy( taxonomy.name ),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setPrimaryTaxonomy,
			updateReplacementVariable,
		} = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomy,
			updateReplacementVariable,
		};
	} ),
] )( PrimaryTaxonomyPicker );
