
/**
 * Class used to build a Structured Tree, to be used in further analysis.
 *
 * Implements the `TreeAdapter` of the `parse5` library.
 * @see https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/tree-adapter/interface.md
 */
class TreeBuilder {
	createDocument() {

	}

	createDocumentFragment() {

	}

	createElement( tagName, namespaceURI, attrs ) {

	}

	createCommentNode( data ) {

	}

	createTextNode( value ) {

	}

	appendChild( parentNode, newNode ) {

	}

	insertBefore( parentNode, newNode, referenceNode ) {

	}

	setTemplateContent( templateElement, contentElement ) {

	}

	getTemplateContent( templateElement ) {

	}

	setDocumentType( document, name, publicId, systemId ) {

	}

	setDocumentMode( document, mode ) {

	}

	getDocumentMode( document ) {

	}

	detachNode( node ) {

	}

	insertText( parentNode, text ) {

	}

	insertTextBefore( parentNode, text, referenceNode ) {

	}

	adoptAttributes( recipient, attrs ) {

	}

	// Tree traversing

	getFirstChild( node ) {

	}

	getChildNodes( node ) {

	}

	getParentNode( node ) {

	}

	getAttrList( element ) {

	}

	//Node data

	getTagName( element ) {

	}

	getNamespaceURI( element ) {

	}

	getTextNodeContent( textNode ) {

	}

	getCommentNodeContent( commentNode ) {

	}

	getDocumentTypeNodeName( doctypeNode ) {

	}

	getDocumentTypeNodePublicId( doctypeNode ) {

	}

	getDocumentTypeNodeSystemId( doctypeNode ) {

	}

	// Node types

	isTextNode( node ) {

	}

	isCommentNode( node ) {

	}

	isDocumentTypeNode( node ) {

	}

	isElementNode( node ) {

	}

	// Source code location

	setNodeSourceCodeLocation( node, location ) {

	}

	getNodeSourceCodeLocation( node ) {

	}
}
export default TreeBuilder;
