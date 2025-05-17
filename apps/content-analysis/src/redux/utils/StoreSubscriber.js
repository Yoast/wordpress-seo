// External dependencies.
import { debounce, isEqual } from "lodash-es";
import buildTree from "yoastseo/src/parsedPaper/build/tree";
import Paper from "yoastseo/src/values/Paper";
import getMorphologyData from "yoastspec/specHelpers/getMorphologyData";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";

// Internal dependencies.
import formatAnalyzeResult from "../../utils/formatAnalyzeResult";
import { setResults } from "../actions/results";
import { setStatus } from "../actions/worker";
import TreeBuilder from "yoastseo/src/parsedPaper/build/tree/TreeBuilder";

export default class StoreSubscriber {
	constructor( { store, worker } ) {
		this._store = store;
		this._worker = worker;
		this._prevState = {
			configuration: {},
			options: {},
			paper: {},
		};

		this.onStoreChange = this.onStoreChange.bind( this );
		this.triggerAutomaticRefresh = debounce( this.triggerAutomaticRefresh, 500 );
		this.triggerTreeBuilder = debounce( this.triggerTreeBuilder, 250 );
	}

	onStoreChange() {
		const state = this._store.getState();

		const { isAutomaticRefreshEnabled } = state.worker;
		const { isTreeBuilderEnabled } = state.options;

		if ( isAutomaticRefreshEnabled ) {
			this.triggerAutomaticRefresh( this._prevState, state );
			this.triggerInitialize( this._prevState, state );
		}

		if ( isTreeBuilderEnabled ) {
			this.triggerTreeBuilder( this._prevState, state );
		}

		this._prevState = state;
	}

	dispatch( action ) {
		this._store.dispatch( action );
	}

	analyzePaper( paper ) {
		this._worker.analyze( Paper.parse( paper ) )
			.then( ( { result } ) => {
				this.dispatch( setStatus( "idling" ) );
				this.dispatch( setResults( formatAnalyzeResult( result, "" ) ) );
			} );
	}

	analyzeRelatedKeyphrase( paper ) {
		const relatedKeyphrase = {
			keyword: paper.keyword,
			synonyms: paper.synonyms,
		};
		this._worker.analyzeRelatedKeywords( Paper.parse( paper ), { relatedKeyphrase } )
			.then( ( { result } ) => {
				this.dispatch( setStatus( "idling" ) );
				this.dispatch( setResults( formatAnalyzeResult( result, "relatedKeyphrase" ) ) );
			} );
	}

	triggerAutomaticRefresh( prevState, state ) {
		const { paper: prevPaper } = prevState;
		const { paper } = state;

		if ( ! isEqual( paper, prevPaper ) ) {
			this.dispatch( setStatus( "analyzing" ) );
			if ( state.options.isRelatedKeyphrase ) {
				this.analyzeRelatedKeyphrase( paper );
			} else {
				this.analyzePaper( paper );
			}
		}
	}

	triggerInitialize( prevState, state ) {
		const { configuration: prevConfiguration, options: prevOptions } = prevState;
		const { configuration, options, paper } = state;

		if ( ! isEqual( prevConfiguration, configuration ) || ! isEqual( prevOptions, options ) ) {
			const config = {
				...configuration,
				researchData: {
					morphology: options.useMorphology ? getMorphologyData( getLanguage( paper.locale ) ) : {},
				},
			};
			this._worker.initialize( config ).then( () => {
				if ( options.isRelatedKeyphrase ) {
					return this.analyzeRelatedKeyphrase( paper );
				}
				return this.analyzePaper( paper );
			} );
		}
	}

	triggerTreeBuilder( prevState, state ) {
		const { paper: { text: prevText }, options: { isTreeBuilderEnabled: prevIsTreeBuilderEnabled } } = prevState;
		const { paper: { text }, options: { isTreeBuilderEnabled } } = state;

		/*
		 * Extra check on the `isTreeBuilderEnabled` to build again after enabling the tree builder option.
		 * This can have timing issues with the debounce and other store change and not work.
		 */
		if ( prevIsTreeBuilderEnabled !== isTreeBuilderEnabled || prevText !== text ) {
			try {
				const HtmlTreeBuilder = new TreeBuilder();
				let tree = HtmlTreeBuilder.build( text );
				// Remove any circular dependencies by using the `toString` implementation.
				tree = JSON.parse( tree.toString() );
				this.dispatch( setResults( { tree } ) );
			} catch ( exception ) {
				console.error( "An error occurred during the building of the tree " +
					"(for the development tool's tree visualization).\n\n", exception );
				this.dispatch( setResults( { } ) );
			}
		}
	}

	subscribe() {
		this._store.subscribe( this.onStoreChange );
	}
}
