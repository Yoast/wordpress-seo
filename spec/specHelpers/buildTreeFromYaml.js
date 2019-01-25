import { load } from "js-yaml";
import { ignoredHtmlElements } from "../../src/tree/builder/htmlConstants";
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
				const formattingElement = new FormattingElement( parameters.type, parameters.attributes );

				this.setSourceLocation( container, parameters );
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
		const paragraph = new Paragraph( parameters.implicit ? "" : "p" );
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
	 * @param {string} type   The type of structured node.
	 *
	 * @returns {module:tree/structure.StructuredNode} The parsed Structured node.
	 */
	parseStructured( parameters, type ) {
		const structured = new StructuredNode( type );
		structured.children = parameters.children.map( child => this.parse( child ) );
		return structured;
	}

	/**
	 * Parses the given parameters to an Ignored node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 * @param {string} type   The type of ignored element.
	 *
	 * @returns {module:tree/structure.Ignored} The parsed Ignored node.
	 */
	parseIgnored( parameters, type ) {
		const ignored = new Ignored( type );
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
	parse( parameters ) {
		const type = Object.keys( parameters )[ 0 ];
		let element = {};
		switch ( type ) {
			case "Paragraph": element = this.parseParagraph( parameters[ type ] ); break;
			case "Heading": element = this.parseHeading( parameters[ type ] ); break;
			case "List": element = this.parseList( parameters[ type ] ); break;
			case "ListItem": element = this.parseListItem( parameters[ type ] ); break;
			default:
				if ( ignoredHtmlElements.includes( element ) ) {
					element = this.parseIgnored( parameters[ type ], type );
				} else {
					element = this.parseStructured( parameters[ type ], type );
				}
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
