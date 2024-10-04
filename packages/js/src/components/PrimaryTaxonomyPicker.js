import apiFetch from "@wordpress/api-fetch";
import { ExternalLink } from "@wordpress/components";
import { Component } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { difference, noop } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";
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
	 * Checks if the current value still has a corresponding option, and if not changes
	 * the value to the first term's id.
	 *
	 * @returns {void}
	 */
	handleSelectedTermsChange() {
		const { selectedTerms } = this.state;
		const { primaryTaxonomyId } = this.props;
		const selectedTerm = selectedTerms.find( term => {
			return term.id === primaryTaxonomyId;
		} );
		if ( ! selectedTerm ) {
			/**
			 * If the selected term is no longer available, set the primary term id to
			 * the first term, and to -1 if no term is available.
			 */
			this.onChange( selectedTerms.length ? selectedTerms[ 0 ].id : -1 );
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
		const { name } = this.props.taxonomy;

		this.updateReplacementVariable( termId );

		this.props.setPrimaryTaxonomyId( name, termId );

		this.input.value = termId === -1 ? "" : termId;
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
