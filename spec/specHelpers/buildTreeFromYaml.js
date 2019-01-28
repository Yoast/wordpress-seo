import { load } from "js-yaml";
import { FormattingElement, Paragraph, TextContainer,
	Heading, StructuredNode, List, ListItem, Ignored } from "../../src/tree/structure";

/**
 * Supports building a tree from a YAML-encoded string.
 */
class TreeFromYaml {
	/**
	 * Sets the source code location (start index and end index) of the given element,
	 * based on the info in the given object.
	 *
	 * @param {Object} element    The element to set the source code location of.
	 * @param {Object} parameters The parameters to get the source code location info from.
	 *
	 * @returns {void}
	 */
	setSourceLocation( element, parameters ) {
		element.sourceStartIndex = parameters.sourceStartIndex;
		element.sourceEndIndex = parameters.sourceEndIndex;
	}

	/**
	 * Parses the given text and formatting to a TextContainer.
	 *
	 * @param {string} text         The text to put in the TextContainer.
	 * @param {Object[]} formatting The formatting to parse.
	 *
	 * @returns {module:tree/structure.TextContainer} The parsed TextContainer.
	 */
	parseTextContainer( text, formatting ) {
		const container = new TextContainer();

		container.text = text;
		if ( formatting ) {
			container.formatting = formatting.map( parameters => {
				const type = Object.keys( parameters )[ 0 ];
				parameters = parameters[ type ];
				const formattingElement = new FormattingElement( type, parameters.attributes );

				this.setSourceLocation( formattingElement, parameters );
				formattingElement.textStartIndex = parameters.textStartIndex;
				formattingElement.textEndIndex = parameters.textEndIndex;

				return formattingElement;
			} );
		}

		return container;
	}

	/**
	 * Parses the given parameters to a Heading node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.Heading} The parsed Heading node.
	 */
	parseHeading( parameters ) {
		const heading = new Heading( parameters.level );
		heading.textContainer = this.parseTextContainer( parameters.text, parameters.formatting );
		return heading;
	}

	/**
	 * Parses the given parameters to a Paragraph node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.Paragraph} The parsed Paragraph node.
	 */
	parseParagraph( parameters ) {
		const paragraph = new Paragraph( parameters.tag );
		paragraph.textContainer = this.parseTextContainer( parameters.text, parameters.formatting );
		return paragraph;
	}

	/**
	 * Parses the given parameters to a ListItem node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.ListItem} The parsed ListItem node.
	 */
	parseListItem( parameters ) {
		const listItem = new ListItem();
		listItem.children = parameters.children.map( child => this.parse( child ) );
		return listItem;
	}

	/**
	 * Parses the given parameters to a List node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.List} The parsed List node.
	 */
	parseList( parameters ) {
		const list = new List( parameters.ordered );
		list.children = parameters.children.map( child => this.parse( child ) );
		return list;
	}

	/**
	 * Parses the given parameters to a Structured node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.StructuredNode} The parsed Structured node.
	 */
	parseStructured( parameters ) {
		const structured = new StructuredNode( parameters.tag );
		structured.children = parameters.children.map( child => this.parse( child ) );
		return structured;
	}

	/**
	 * Parses the given parameters to an Ignored node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:tree/structure.Ignored} The parsed Ignored node.
	 */
	parseIgnored( parameters ) {
		const ignored = new Ignored( parameters.tag );
		ignored.content = parameters.content;
		return ignored;
	}

	/**
	 * Parses the given JSON parameters to a node in the tree.
	 *
	 * @param {Object} parameters The JSON parameters to parse to a node.
	 *
	 * @returns {module:tree/structure.Node} The parsed tree.
	 */
	parse( parameters ) { // eslint-disable-line complexity
		/*
		  Type of node to add.
		  E.g. encoded as `{ Paragraph: { text: "Some text"... } }`
		 */
		const type = Object.keys( parameters )[ 0 ];
		let element = {};
		switch ( type ) {
			case "Paragraph":  element = this.parseParagraph( parameters[ type ] );  break;
			case "Heading":    element = this.parseHeading( parameters[ type ] );    break;
			case "List":       element = this.parseList( parameters[ type ] );       break;
			case "ListItem":   element = this.parseListItem( parameters[ type ] );   break;
			case "Ignored":    element = this.parseIgnored( parameters[ type ] );    break;
			case "Structured": element = this.parseStructured( parameters[ type ] ); break;
			default: throw new Error( `Node of type '${type}' is not known.` );
		}
		this.setSourceLocation( element, parameters[ type ] );
		return element;
	}
}


/**
 * Parses the given input string to a tree representation.
 *
 * @param {string} input The YAML string to parse to a tree.
 *
 * @returns {module:tree/structure.Node} The parsed tree.
 */
const buildTreeFromYaml = function( input ) {
	const parameters = load( input );
	const treeBuilder = new TreeFromYaml();
	return treeBuilder.parse( parameters );
};

export default buildTreeFromYaml;
