/**
 * Convert content to string due to depracation of toHTML in RichText.Content.
 * See https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/rich-text/index.js line 175
 * @param {Array|String} content .
 * @returns {string} The Question component.
 */
export default function convertValueToStringRichText( content ) {
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
			return `<${item.type} src="${item.props.src}" alt="${item.props.alt}" style="${item.props.style}" class="${item.props.class}" />`;
		}
	 return `<${item.type} >${convertValueToStringRichText( item.props.children )}</${item.type}>`;
	} ).join( "" );
}
