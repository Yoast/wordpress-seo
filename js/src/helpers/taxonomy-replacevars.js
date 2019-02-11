import {
	subscribe,
	select,
	dispatch,
} from "@wordpress/data";
import forEach from "lodash/forEach";

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

function getApplicableTaxonomies( postType ) {
	const args = [ "root", "taxonomy", { type: postType } ];

	return resolveGetEntityRecords( args );
}

function getTerms( taxonomy ) {
	const args = [ "taxonomy", taxonomy.slug ];

	return resolveGetEntityRecords( args );
}

class TaxonomyReplacementVariable {
	constructor( taxonomy ) {
		this.taxonomy  = taxonomy;
		this.terms     = [];
		this.isBuiltIn = [ "category", "tag" ].includes( taxonomy.slug );
	}

	updateReplacementVariable() {
		const termIds = select( "core/editor" ).getEditedPostAttribute( this.taxonomy.rest_base );

		const termNames = [];

		forEach( termIds, termId => {
			const term = this.terms.find( term => term.id === termId );

			if ( ! term ) {
				return;
			}

			termNames.push( term.name );
		} );

		const replacementVariableValue = termNames.join( ", " );
		const replacementVariableName = this.isBuiltIn ? this.taxonomy.slug : `ct_${ this.taxonomy.slug }`;

		dispatch( "yoast-seo/editor" ).updateReplacementVariable( replacementVariableName, replacementVariableValue );
	}

	listenForTermChanges() {
		subscribe( () => {
			const nextTermIds = select( "core/editor" ).getEditedPostAttribute( this.taxonomy.rest_base );
			if ( this.termIds !== nextTermIds ) {
				this.termIds = nextTermIds;

				this.updateReplacementVariable();
			}
		} );
	}

	listen() {
		getTerms( this.taxonomy ).then( terms => {
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
	constructor() {
		this.taxonomies = [];
		this.terms = {};
	}

	listen() {
		// Make sure taxonomy resolution has started.
		getPostType().then( postType => {
			return getApplicableTaxonomies( postType );
		} ).then( taxonomies => {
			this.taxonomies = taxonomies;

			forEach( taxonomies, taxonomy => {
				const listener = new TaxonomyReplacementVariable( taxonomy );
				listener.listen();
			} );
		} );
	}
}

export default TaxonomyReplacementVariables;
