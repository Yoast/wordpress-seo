const filterShortcodesFromSentence = ( sentence, shortcodeTags ) => {
	const tokens = sentence.tokens;
	// traverse through tokens backwards
	for ( let i = tokens.length - 1; i >= 0; i-- ) {
		if ( shortcodeTags.includes( tokens[ i ].text ) && tokens[ i - 1 ] && tokens[ i - 1 ].text === "[" ) {
			while ( tokens[ i ].text !== "]" ) {
				tokens.splice( i, 1 );
			}
			tokens.splice( i, 1 );
			tokens.splice( i - 1, 1 );
		}
	}
	sentence.tokens = tokens;
};

const filterFromTokens = ( tree, shortcodeTags ) => {
	if ( tree.sentences ) {
		tree.sentences.forEach( sentence => {
			filterShortcodesFromSentence( sentence, shortcodeTags );
		} );
	}

	if ( tree.childNodes ) {
		tree.childNodes.forEach( childNode => {
			filterFromTokens( childNode, shortcodeTags );
		} );
	}
	return tree;
};

const filterShortcodesFromTree = ( tree, shortcodeTags ) => {
	if ( shortcodeTags ) {
		filterFromTokens( tree, shortcodeTags );
	}
};

export default filterShortcodesFromTree;
