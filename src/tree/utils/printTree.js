/**
 * Builds a textual representation of the given tree.
 * Can be used for printing the contents of the tree to the console.
 *
 * @param {Node} tree		The tree to print.
 * @param {string} indent	The indentation to use for printing.
 * @returns {string[]} A textual representation of the tree, each line is one element of the array.
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
