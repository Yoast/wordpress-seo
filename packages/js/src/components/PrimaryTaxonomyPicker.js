import apiFetch from "@wordpress/api-fetch";
import { ExternalLink } from "@wordpress/components";
import { select } from "@wordpress/data";
import { Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { difference, noop } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrimaryTermFields from "../helpers/fields/PrimaryTermFields";
import TaxonomyPicker from "./TaxonomyPicker";

const PrimaryTaxonomyPickerField = styled.div`
	padding-top: 16px;
`;

/**
 * A component for selecting a primary taxonomy term.
 */
class PrimaryTaxonomyPicker extends Component {
	/**
	 * Constructs a PrimaryTaxonomyPicker component.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
		this.updateReplacementVariable = this.updateReplacementVariable.bind( this );

		const { fieldId, name } = props.taxonomy;
		const rawValue = PrimaryTermFields.get( name, fieldId );
		const parsedPrimaryTaxonomyId = parseInt( rawValue, 10 );
		// Fallback to -1 when the field is empty or invalid to avoid dispatching NaN.
		props.setPrimaryTaxonomyId( name, Number.isNaN( parsedPrimaryTaxonomyId ) ? -1 : parsedPrimaryTaxonomyId );

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
	 * @param {Object} prevState The previous state.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		// Check if a term has been added and retrieve new terms if so.
		if ( prevProps.selectedTermIds.length < this.props.selectedTermIds.length ) {
			const newId = difference( this.props.selectedTermIds, prevProps.selectedTermIds )[ 0 ];
			if ( ! this.termIsAvailable( newId ) ) {
				this.fetchTerms();
				return;
			}
		}
		// Check if the selected terms have changed.
		if ( prevProps.selectedTermIds !== this.props.selectedTermIds ) {
			this.updateSelectedTerms( this.state.terms, this.props.selectedTermIds );
		}
		// Handle terms change.
		if ( prevState.selectedTerms !== this.state.selectedTerms ) {
			this.handleSelectedTermsChange();
		}
	}

	/**
	 * Resolves a stale -1 placeholder by re-reading the saved primary taxonomy ID from the field.
	 * Returns true if the caller should stop further processing.
	 *
	 * A -1 may be written by the constructor before REST entity meta has loaded. Once meta is
	 * available, sync the real value to the store rather than letting the fallback-to-first-term
	 * path overwrite the saved primary term without user interaction.
	 *
	 * @returns {boolean} Whether the caller should return early.
	 */
	resolveStalePrimaryId() {
		const { primaryTaxonomyId, taxonomy } = this.props;
		if ( primaryTaxonomyId !== -1 ) {
			return false;
		}
		const rawValue = PrimaryTermFields.get( taxonomy.name, taxonomy.fieldId );
		const parsed = parseInt( rawValue, 10 );
		if ( ! Number.isNaN( parsed ) ) {
			this.props.setPrimaryTaxonomyId( taxonomy.name, parsed );
			return true;
		}
		// Entity meta hasn't loaded yet; skip onChange to avoid dirtying the post.
		if ( ! select( "core/editor" ).getEditedPostAttribute( "meta" ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Checks if the current value still has a corresponding option, and if not changes
	 * the value to the first term's id.
	 *
	 * @returns {void}
	 */
	handleSelectedTermsChange() {
		const { selectedTerms } = this.state;
		const { primaryTaxonomyId, taxonomy } = this.props;

		// Terms haven't been fetched yet: selectedTerms is derived from an empty list, so any
		// "primary not found" result here is a false negative. Skip until fetchTerms resolves.
		if ( this.state.terms.length === 0 ) {
			return;
		}

		if ( this.resolveStalePrimaryId() ) {
			return;
		}

		const selectedTerm = selectedTerms.find( term => {
			return term.id === primaryTaxonomyId;
		} );
		if ( ! selectedTerm ) {
			const autoSelectedId = selectedTerms.length ? selectedTerms[ 0 ].id : -1;
			if ( primaryTaxonomyId === -1 ) {
				// No primary term was ever saved. Auto-select the first term for UI display only,
				// without writing to meta, so the post is not dirtied before user interaction.
				this.props.setPrimaryTaxonomyId( taxonomy.name, autoSelectedId );
				this.updateReplacementVariable( autoSelectedId );
			} else {
				// The saved primary term is no longer among the selected terms (user removed it).
				// Fall back to the first available term and persist the change.
				this.onChange( autoSelectedId );
			}
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
		const { taxonomy } = this.props;
		if ( ! taxonomy ) {
			return;
		}
		this.fetchRequest = apiFetch( {
			path: addQueryArgs(
				`/wp/v2/${ taxonomy.restBase }`,
				{
					/* eslint-disable-next-line camelcase */
					per_page: -1,
					orderby: "count",
					order: "desc",
					_fields: "id,name",
				}
			),
		} );

		this.fetchRequest.then( terms => {
			const oldState = this.state;
			this.setState( {
				terms,
				selectedTerms: this.getSelectedTerms( terms, this.props.selectedTermIds ),
			}, () => {
				if ( oldState.terms.length === 0 && this.state.terms.length > 0 ) {
					this.updateReplacementVariable( this.props.primaryTaxonomyId );
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
		const { name, fieldId } = this.props.taxonomy;

		this.updateReplacementVariable( termId );

		this.props.setPrimaryTaxonomyId( name, termId );

		PrimaryTermFields.set( name, fieldId, termId );
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
		this.props.updateReplacementVariable(
			`primary_${ this.props.taxonomy.name }`,
			primaryTerm ? primaryTerm.name : ""
		);
	}

	/**
	 * Renders the PrimaryTaxonomyPicker component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		const {
			primaryTaxonomyId,
			taxonomy,
			learnMoreLink,
		} = this.props;

		if ( this.state.selectedTerms.length < 2 ) {
			return null;
		}

		const fieldId = `yoast-primary-${ taxonomy.name }-picker`;

		return (
			<PrimaryTaxonomyPickerField className="components-base-control__field">
				<TaxonomyPicker
					label={
						sprintf(
							/* translators: %s expands to the taxonomy name. */
							__( "Select the primary %s", "wordpress-seo" ),
							taxonomy.singularLabel.toLowerCase()
						)
					}
					value={ primaryTaxonomyId }
					onChange={ this.onChange }
					id={ fieldId }
					terms={ this.state.selectedTerms }
				/>
				<ExternalLink className="yst-inline-block yst-mt-2" href={ learnMoreLink }>
					{ __( "Learn more", "wordpress-seo" ) }
					<span className="screen-reader-text">
						{ __( "Learn more about the primary category.", "wordpress-seo" ) }
					</span>
				</ExternalLink>
			</PrimaryTaxonomyPickerField>
		);
	}
}

PrimaryTaxonomyPicker.propTypes = {
	selectedTermIds: PropTypes.arrayOf( PropTypes.number ),
	primaryTaxonomyId: PropTypes.number,
	setPrimaryTaxonomyId: PropTypes.func,
	updateReplacementVariable: PropTypes.func,
	taxonomy: PropTypes.shape( {
		name: PropTypes.string,
		fieldId: PropTypes.string,
		restBase: PropTypes.string,
		singularLabel: PropTypes.string,
	} ),
	learnMoreLink: PropTypes.string.isRequired,
};

PrimaryTaxonomyPicker.defaultProps = {
	selectedTermIds: [],
	primaryTaxonomyId: -1,
	setPrimaryTaxonomyId: noop,
	updateReplacementVariable: noop,
	taxonomy: {},
};

export default PrimaryTaxonomyPicker;
