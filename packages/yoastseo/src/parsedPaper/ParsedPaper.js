export default class ParsedPaper {
	constructor() {
		this.metadata = {};
		this.tree = {};

		this.setTree.bind( this );
	}

	setTree( tree ) {
		this.tree = tree;
	}

	getTree() {
		return this.tree;
	}

	setMetaValue( key, value ) {
		this.metaData[ key ] = value;
	}

	getMetaValue( key ) {
		return this.metadata[ key ];
	}

	setMetaData( metadata ) {
		this.metaData = metadata;
	}

	getMetadata() {
		return this.metadata;
	}
}
