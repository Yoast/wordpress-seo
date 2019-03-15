/* global wpseoReplaceVarsL10n */

/* External dependencies */
import {
	subscribe,
	select,
	dispatch,
} from "@wordpress/data";
import forEach from "lodash/forEach";

/* Internal dependencies */
import {
	promisifySelector,
	invalidateTerms,
} from "../wp-data/utils";

/**
 * Creates a promise that will resolve to the post's post type.
 *
 * @returns {Promise<string>} A promise resolving to the post type.
 */
const getPostType = promisifySelector(
	"core/editor",
	"getEditedPostAttribute",
).bind( null, "type" );

/**
 * Creates a promise that will resolve to a list of taxonomies.
 *
 * @param {string} posttype The post type to get taxonomies for.
 *
 * @returns {Promise<array>} List of taxonomies for the given post type.
 */
const getApplicableTaxonomies = promisifySelector(
	"yoast-seo/wp-data",
	"getTaxonomies",
);

/**
 * Creates a promise that will resolve to a list of terms.
 *
 * @param {string} taxonomySlug The slug of the taxonomy to get the terms for.
 *
 * @returns {Promise<array>} List of terms for the given taxonomy.
 */
const getTerms = promisifySelector(
	"yoast-seo/wp-data",
	"getTerms",
);

/**
 * Handles the taxonomy replacement variables for a single taxonomy.
 */
class TaxonomyReplacementVariable {
	/**
	 * The class constuctor.
	 *
	 * @param {Object} taxonomy The taxonomy to handle the replacement variables for.
	 */
	constructor( taxonomy ) {
		this.taxonomy  = taxonomy;
		this.terms     = [];
		this.isBuiltIn = [ "category", "tag" ].includes( taxonomy.slug );
	}

	/**
	 * Updates the replacement variable.
	 *
	 * @returns {void}
	 */
	updateReplacementVariable() {
		const termIds = select( "core/editor" ).getEditedPostAttribute( this.taxonomy.rest_base );

		const termNames = [];

		forEach( termIds, termId => {
			const term = this.terms.find( currentTerm => currentTerm.id === termId );

			/**
			 * If a term cannot be found it is most likely because a new term has been added through the gutenberg interface.
			 * In order to get a new list of terms we should invalidate the resolution of terms. In this.haveTermsChanged
			 * we check for a new list of terms being retrieved, and if so we call this.updateReplacementVariable again.
			 */
			if ( ! term ) {
				invalidateTerms( this.taxonomy.slug );
				return;
			}

			termNames.push( term.name );
		} );

		const replacementVariableValue = termNames.join( ", " );
		const replacementVariableName = this.isBuiltIn ? this.taxonomy.slug : `ct_${ this.taxonomy.slug }`;

		dispatch( "yoast-seo/editor" ).updateReplacementVariable( replacementVariableName, replacementVariableValue );
	}

	/**
	 * Checks if the term ids have changed compared to the previous state.
	 *
	 * @returns {boolean} Whether the terms have changed for this post.
	 */
	haveTermIdsForPostChanged() {
		const nextTermIds = select( "core/editor" ).getEditedPostAttribute( this.taxonomy.rest_base );
		if ( this.termIds !== nextTermIds ) {
			this.termIds = nextTermIds;
			return true;
		}
		return false;
	}

	/**
	 * Checks if the list of terms has changed compared to the previous state.
	 *
	 * @returns {boolean} Whether the list of terms has changed.
	 */
	haveTermsChanged() {
		/* eslint-disable-next-line camelcase */
		const nextTerms = select( "yoast-seo/wp-data" ).getTerms( this.taxonomy.slug );
		if ( nextTerms && this.terms !== nextTerms && nextTerms.length ) {
			this.terms = nextTerms;
			return true;
		}
		return false;
	}

	/**
	 * Watch the post for changes in taxonomy ids, and update the replacement variable accordingly.
	 *
	 * @returns {void}
	 */
	listenForTermChanges() {
		this.unsubscribe = subscribe( () => {
			if ( this.haveTermIdsForPostChanged() || this.haveTermsChanged() ) {
				this.updateReplacementVariable();
			}
		} );
	}

	/**
	 * Set the initial replacement variable and start listening for changes.
	 *
	 * @returns {void}
	 */
	listen() {
		getTerms( this.taxonomy.slug ).then( terms => {
			this.terms = terms;
			this.updateReplacementVariable();
			this.listenForTermChanges();
		} );
	}
}

/**
 * Handles all taxonomy replacement variables.
 */
class TaxonomyReplacementVariables {
	/**
	 * Creates a listener for each taxonomy.
	 *
	 * @returns {void}
	 */
	listen() {
		getPostType().then( postType => {
			if ( wpseoReplaceVarsL10n.has_taxonomies === "" ) {
				return null;
			}

			return getApplicableTaxonomies( postType );
		} ).then( taxonomies => {
			forEach( taxonomies, taxonomy => {
				const listener = new TaxonomyReplacementVariable( taxonomy );
				listener.listen();
			} );
		} );
	}
}

export default TaxonomyReplacementVariables;
