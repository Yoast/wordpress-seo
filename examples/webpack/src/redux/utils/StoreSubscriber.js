// External dependencies.
import { debounce, isEqual } from "lodash-es";
import Paper from "yoastsrc/values/Paper";

// Internal dependencies.
import formatAnalyzeResult from "../../utils/formatAnalyzeResult";
import getMorphologyData from "../../utils/getMorphologyData";
import { setResults } from "../actions/results";
import { setStatus } from "../actions/worker";

export default class StoreSubscriber {
	constructor( { store, worker } ) {
		this._store = store;
		this._worker = worker;
		this._prevState = {};

		this.onStoreChange = this.onStoreChange.bind( this );
		this.triggerAutomaticRefresh = debounce( this.triggerAutomaticRefresh, 500 );
	}

	onStoreChange() {
		const state = this._store.getState();

		const { isAutomaticRefreshEnabled } = state.worker;

		if ( isAutomaticRefreshEnabled ) {
			this.triggerAutomaticRefresh( this._prevState, state );
			this.triggerInitialize( this._prevState, state );
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
		const { configuration, options } = state;

		if ( ! isEqual( prevConfiguration, configuration ) || ! isEqual( prevOptions, options ) ) {
			const config = {
				...configuration,
				researchData: {
					morphology: state.options.useMorphology ? getMorphologyData() : {},
				},
			};
			this._worker.initialize( config ).then( () => {
				if ( state.options.isRelatedKeyphrase ) {
					return this.analyzeRelatedKeyphrase( state.paper );
				}
				return this.analyzePaper( state.paper );
			} );
		}
	}

	subscribe() {
		this._store.subscribe( this.onStoreChange );
	}
}
