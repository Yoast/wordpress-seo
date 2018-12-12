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
