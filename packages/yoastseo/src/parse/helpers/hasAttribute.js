

export default function hasAttribute( node, attributeName ) {
	return node.attrs.some( attribute => attribute.name === attributeName );
}
