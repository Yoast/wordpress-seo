/**
 * @typedef {import("../../../parse/structure").Node} Node
 * @typedef {import("../../../parse/structure/Sentence").default} Sentence
 */

/**
 * Checks if the given node is a list item that is not a HowTo step.
 * @param {Node} parentNode The node to check.
 * @returns {boolean} Whether the node is a list item that is not a HowTo step.
 */
const checkIfNodeIsListItem = ( parentNode ) => {
	return parentNode?.name === "li" && ! parentNode?.attributes?.class?.has( "schema-how-to-step" );
};

/**
 * Determines whether a tree node should be included when getting sentences from the tree.
 * @param {Node} treeNode The tree node to check.
 * @param {Node} tree The full tree.
 * @param {boolean} shouldMergeListItems Whether to merge sentences from list items into one array.
 * @returns {boolean} Whether the sentences from the tree node should be included.
 */
const shouldIncludeNode = ( treeNode, tree, shouldMergeListItems ) => {
	const parentNode = treeNode.getParentNode ? treeNode.getParentNode( tree ) : null;

	// Check if the node is a list item that is not a HowTo step.
	const isListItem = checkIfNodeIsListItem( parentNode );
	const isList = /(ul|ol)/.test( treeNode.name );
	/*
	 If shouldMergeListItems is true, we want to exclude the sentences from the individual list items,
	 as we will be merging all sentences from the list items into one array.
	 If shouldMergeListItems is false, we want to exclude the sentences from the list itself,
	 as we only want the sentences from the individual list items.
	 */
	if ( ( shouldMergeListItems && isListItem ) || ( ! shouldMergeListItems && isList ) ) {
		return false;
	}
	return !! treeNode.sentences;
};

/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Node} tree The tree to get the sentences from.
 * @param {boolean} [shouldMergeListItems=false] Whether to merge sentences from list items into one array.
 * At this moment, this flag is set to true for Keyphrase distribution assessment only.
 *
 * @returns {Sentence[]} The array of sentences retrieved from paragraph and heading nodes plus sourceCodeLocation of the parent node.
 */
export default function( tree, shouldMergeListItems = false ) {
	// Get all nodes that have a sentence property which is not an empty array.
	const nodesWithSentences = tree.findAll( treeNode => shouldIncludeNode( treeNode, tree, shouldMergeListItems ) );

	return nodesWithSentences.flatMap( node => node.sentences.map( sentence => {
		sentence.setParentAttributes( node, tree );
		return sentence;
	} ) );
}
