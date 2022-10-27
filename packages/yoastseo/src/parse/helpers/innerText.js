
export default function innerText( node ) {
	let text = "";

	if( node.childNodes ) {
		node.childNodes.forEach( child => {
			if ( child.nodeName === "#text" ) {
				text += child.value;
			} else {
				text += innerText( child );
			}
		} );
	}

	return text;
}

