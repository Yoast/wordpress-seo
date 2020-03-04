/**
 * Strips tags from HTML nodes.
 *
 * @param nodes The nodes.
 * @param allowedTags The allowed tags.
 */
function stripTagsFromNodes( nodes: NodeListOf<ChildNode>, allowedTags: string[] ) {
	nodes.forEach( node => {
		if ( node.nodeType !== Node.ELEMENT_NODE ) {
			return;
		}
		const tag = node.nodeName.toLowerCase();
		if ( tag === "script" || tag === "style" ) {
			node.remove();
			return;
		}
		stripTagsFromNodes( node.childNodes, allowedTags );
		if ( allowedTags.includes( tag ) ) {
			return;
		}
		node.replaceWith( ...Array.from( node.childNodes ) );
	} );
}

/**
 * Strips tags from HTML.
 *
 * @param html The HTML.
 * @param allowedTags Optional. The allowed tags.
 *
 * @returns The stripped HTML.
 */
export function stripTags( html: string, allowedTags: string[] = [] ): string {
	const parser = new DOMParser();
	const document = parser.parseFromString( html, "text/html" );

	stripTagsFromNodes( document.body.childNodes, allowedTags );

	return document.body.innerHTML;
}

/**
 * Splits nodes on a specific tag.
 *
 * @param nodes The nodes.
 * @param tag   The tag to split on.
 *
 * @returns The inner HTML of all nodes with the given tag.
 */
function splitNodesOnTag( nodes: NodeListOf<ChildNode>, tag: string ): string[] {
	let values: string[] = [];

	nodes.forEach( node => {
		if ( node.nodeType !== Node.ELEMENT_NODE ) {
			return;
		}
		const nodeTag = node.nodeName.toLowerCase();
		if ( nodeTag === tag ) {
			values.push( ( node as Element ).innerHTML );
			return;
		}
		values = values.concat( splitNodesOnTag( node.childNodes, tag ) );
	} );

	return values;
}

/**
 * Splits HTML on a specific tag.
 *
 * @param html The HTML.
 * @param tag  The tag to spit on.
 *
 * @returns The inner HTML of each tag.
 */
export function splitOnTag( html: string, tag: string ): string[] {
	const parser = new DOMParser();
	const document = parser.parseFromString( html, "text/html" );

	return splitNodesOnTag( document.body.childNodes, tag );
}
