export default class ParsedPaper {
	constructor() {
		this._metadata = {};
		this._tree = {};

		this.setTree.bind( this );
	}

	setTree( tree ) {
		this._tree = tree;
	}

	getTree() {
		return this._tree;
	}

	setMetaValue( key, value ) {
		this._metadata[ key ] = value;
	}

	getMetaValue( key ) {
		return this._metadata[ key ];
	}

	setMetaData( metadata ) {
		this._metadata = metadata;
	}

	getMetadata() {
		return this._metadata;
	}
}
