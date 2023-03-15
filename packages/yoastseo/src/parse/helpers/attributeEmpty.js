import { isEmpty } from "lodash-es";

export default function attributeEmpty( node, attributeName ) {
	const attribute = node.attrs.find( attr => attr.name === attributeName );
	return isEmpty( attribute.value );
}
