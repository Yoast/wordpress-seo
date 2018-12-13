// Disable reason: The function is being used only for development purposes, therefore does not require optimisation.
/* eslint-disable complexity */

/**
 * Creates an array of elements of the structured tree and their attributes to be used for printing of the tree using
 * console.log.
 *
 * @param {Object} tree      The tree to print out.
 * @param {string} [indent]  An indentation parameter to be used for recursive indentation.
 *
 * @returns {string} The text of the heading.
 */
export default function printTree( tree, indent = "" ) {
	let print = [ `${indent}type: ${tree.type}` ];
	switch ( tree.type ) {
		case "StructuredNode":
		case "List":
		case "ListItem":
			print.push( `${indent}children:` );
			tree.children.forEach( child => {
				print = print.concat( printTree( child, indent + "  " ) );
			} );
			break;
		case "Heading":
			print.push( `${indent}level: ${tree.level}` );
			print.push( `${indent}text: "${tree.textContainer.text}"` );
			break;
		case "Paragraph":
			print.push( `${indent}text: "${tree.textContainer.text}"` );
			break;
		case "StructuredIrrelevant":
		case "Whitespace":
			print.push( `${indent}content: "${tree.content}"` );
			break;
	}
	return print;
}
/* eslint-enable complexity */
