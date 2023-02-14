/**
 * Convert content to string due to deprecation of toHTML in RichText.Content for nested attributes.
 * See https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/rich-text/index.js line 175
 * @param {Array|String} content As an array of objects (type: html tag, props: html atttributes, children: content).
 * @returns {string} The html content as a string.
 */
export default function convertValueToStringRichText( content ) {
	/**
	* @param {string} str The string to escape.
	* @returns {string} The escaped string.
	*/
	const escapeQuotes = ( str ) => str.replace( /"/g, "&quot;" );
	if ( typeof content === "string" ) {
		return content;
	}
	return content.map( ( item ) => {
		if ( typeof item === "string" ) {
			return item;
		}
		if ( item.type === "br" ) {
			return `<${item.type}>`;
		}
		if ( item.type === "img" ) {
			return `<${item.type} src="${item.props.src}" alt="${ escapeQuotes( item.props.alt )}" style="${item.props.style}" class="${item.props.class}" />`;
		}
	 return `<${item.type} >${convertValueToStringRichText( item.props.children )}</${item.type}>`;
	} ).join( "" );
}
