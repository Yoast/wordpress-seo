import { load } from "js-yaml";
import { FormattingElement, Paragraph, TextContainer,
	Heading, StructuredNode, List, ListItem } from "../../src/parsedPaper/structure/tree";

/**
 * Supports building a tree from a YAML-encoded string.
 */
class TreeFromYaml {
	/**
	 * Parses the given text and formatting to a TextContainer.
	 *
	 * @param {string} text         The text to put in the TextContainer.
	 * @param {Object[]} formatting The formatting to parse.
	 *
	 * @returns {module:parsedPaper/structure.TextContainer} The parsed TextContainer.
	 */
	parseTextContainer( text, formatting ) {
		const container = new TextContainer();

		container.text = text;
		if ( formatting ) {
			container.formatting = formatting.map( parameters => {
				const type = Object.keys( parameters )[ 0 ];
				parameters = parameters[ type ];

				const sourceCodeLocation = parameters.sourceCodeLocation;
				const formattingElement = new FormattingElement( type, sourceCodeLocation, parameters.attributes );

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
	 * @returns {module:parsedPaper/structure.Heading} The parsed Heading node.
	 */
	parseHeading( parameters ) {
		const sourceCodeLocation = parameters.sourceCodeLocation;
		const heading = new Heading( parameters.level, sourceCodeLocation );
		heading.textContainer = this.parseTextContainer( parameters.text, parameters.formatting );
		return heading;
	}

	/**
	 * Parses the given parameters to a Paragraph node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:parsedPaper/structure.Paragraph} The parsed Paragraph node.
	 */
	parseParagraph( parameters ) {
		const sourceCodeLocation = parameters.sourceCodeLocation;
		const paragraph = new Paragraph( sourceCodeLocation, parameters.isImplicit );
		paragraph.textContainer = this.parseTextContainer( parameters.text, parameters.formatting );
		return paragraph;
	}

	/**
	 * Parses the given parameters to a ListItem node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:parsedPaper/structure.ListItem} The parsed ListItem node.
	 */
	parseListItem( parameters ) {
		const sourceCodeLocation = parameters.sourceCodeLocation;
		const listItem = new ListItem( sourceCodeLocation );
		listItem.textContainer = this.parseTextContainer( parameters.text, parameters.formatting );
		return listItem;
	}

	/**
	 * Parses the given parameters to a List node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:parsedPaper/structure.List} The parsed List node.
	 */
	parseList( parameters ) {
		const sourceCodeLocation = parameters.sourceCodeLocation;
		const list = new List( parameters.ordered, sourceCodeLocation );
		if ( parameters.children ) {
			list.children = parameters.children.map( child => this.parse( child ) );
		}
		return list;
	}

	/**
	 * Parses the given parameters to a Structured node.
	 *
	 * @param {Object} parameters The parameters to parse.
	 *
	 * @returns {module:parsedPaper/structure.StructuredNode} The parsed Structured node.
	 */
	parseStructured( parameters ) {
		const sourceCodeLocation = parameters.sourceCodeLocation;
		const structured = new StructuredNode( parameters.tag, sourceCodeLocation );
		if ( parameters.children ) {
			structured.children = parameters.children.map( child => this.parse( child ) );
		}
		return structured;
	}

	/**
	 * Parses the given JSON parameters to a node in the tree.
	 *
	 * @param {Object} parameters The JSON parameters to parse to a node.
	 *
	 * @returns {module:parsedPaper/structure.Node} The parsed tree.
	 */
	parse( parameters ) {
		/*
		  Type of node to add.
		  The type should be the first (and only) key of the JSON object.
		  E.g. `{ Paragraph: { text: "Some text"... } }` => 'Paragraph'.
		 */
		const type = Object.keys( parameters )[ 0 ];
		let element = {};
		switch ( type ) {
			case "Paragraph":  element = this.parseParagraph( parameters[ type ] );  break;
			case "Heading":    element = this.parseHeading( parameters[ type ] );    break;
			case "List":       element = this.parseList( parameters[ type ] );       break;
			case "ListItem":   element = this.parseListItem( parameters[ type ] );   break;
			case "Structured": element = this.parseStructured( parameters[ type ] ); break;
			default: throw new Error( `Node of type '${type}' is not known.` );
		}
		return element;
	}
}


/**
 * Parses the given input string to a tree representation.
 *
 * @param {string} input The YAML string to parse to a tree.
 *
 * @returns {module:parsedPaper/structure.Node} The parsed tree.
 */
const buildTreeFromYaml = function( input ) {
	// Parse YAML to JSON with `js-yaml` library.
	const parameters = load( input );
	// Parse and return tree from JSON.
	const treeBuilder = new TreeFromYaml();
	return treeBuilder.parse( parameters );
};

export default buildTreeFromYaml;
