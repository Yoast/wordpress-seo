// External dependencies.
import buildTree from "yoastsrc/tree/builder";

// Internal dependencies.
import { setResults } from "../actions/results";

export default class TreeBuilder {
	constructor( { store } ) {
		this._store = store;
		this._prevText = {};

		this.onStoreChange = this.onStoreChange.bind( this );
	}

	onStoreChange() {
		const {
			options: { isTreeBuilderEnabled },
			paper: { text },
		} = this._store.getState();

		if ( this._prevText === text ) {
			return;
		}
		this._prevText = text;

		if ( isTreeBuilderEnabled ) {
			this.buildTree( text );
		}
	}

	buildTree( text ) {
		let tree = buildTree( text );

		// Remove any circular dependencies by using the `toString` implementation.
		tree = JSON.parse( tree.toString() );

		this.dispatch( setResults( { tree } ) );
	}

	dispatch( action ) {
		this._store.dispatch( action );
	}

	subscribe() {
		this._store.subscribe( this.onStoreChange );
	}
}
