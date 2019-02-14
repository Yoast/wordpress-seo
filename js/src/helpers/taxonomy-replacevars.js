/* External dependencies */
import {
	subscribe,
	select,
	dispatch,
} from "@wordpress/data";
import forEach from "lodash/forEach";

/**
 * Creates a promise that will resolve to the post's post type.
 *
 * @returns {Promise<string>} A promise resolving to the post type.
 */
function getPostType() {
	return new Promise( resolve => {
		let postType = select( "core/editor" ).getEditedPostAttribute( "type" );

		if ( postType ) {
			return resolve( postType );
		}

		const unsubscribe = subscribe( () => {
			postType = select( "core/editor" ).getEditedPostAttribute( "type" );

			if ( postType ) {
				unsubscribe();

				return resolve( postType );
			}
		} );
	} );
}

/**
 * Creates a promise that will wait for getEntityRecords to yield a result with the given arguments.
 *
 * @param {Array} args The arguments to be passed to getEntityRecords.
 *
 * @returns {Promise} A promise resolving to the entity records.
 */
function resolveGetEntityRecords( args ) {
	return new Promise( resolve => {
		const getEntityRecords = select( "core" ).getEntityRecords.bind( null, ...args );
		const hasFinishedResolution = select( "core/data" ).hasFinishedResolution.bind( null, "core", "getEntityRecords", args );

		const records = getEntityRecords();

		if ( hasFinishedResolution() ) {
			return resolve( records );
		}

		const unsubscribe = subscribe( () => {
			if ( hasFinishedResolution() ) {
				unsubscribe();

				resolve( getEntityRecords() );
			}
		} );
	} );
}

/**
 * Creates a promise that will resolve to an array of taxonomies applicable to the given post type.
 *
 * @param {string} postType The post type to retrieve the applicable taxonomies for.
 *
 * @returns {Promise} A promise resolving to an array of taxonomies applicable for the given post type.
 */
function getApplicableTaxonomies( postType ) {
	/* eslint-disable-next-line camelcase */
	const args = [ "root", "taxonomy", { type: postType, per_page: -1 } ];

	return resolveGetEntityRecords( args );
}

/**
 * Creates a promise that will resolve to an array of terms for the given taxonomy.
 *
 * @param {string} taxonomySlug The taxonomy's slug.
 *
 * @returns {Promise} A promise resolving to an array of terms for the given taxonomy.
 */
function getTerms( taxonomySlug ) {
	/* eslint-disable-next-line camelcase */
	const args = [ "taxonomy", taxonomySlug, { per_page: -1 } ];

	return resolveGetEntityRecords( args );
}

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
				/* eslint-disable-next-line camelcase */
				dispatch( "core/data" ).invalidateResolution( "core", "getEntityRecords", [ "taxonomy", this.taxonomy.slug, { per_page: -1 } ] );
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
		const nextTerms = select( "core" ).getEntityRecords( "taxonomy", this.taxonomy.slug, { per_page: -1 } );
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
