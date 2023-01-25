import parseSynonyms from "../../../../../src/languageProcessing/helpers/sanitize/parseSynonyms";
import { MetadataMiscellaneous, MetadataText, StructuredNode } from "../../../structure/tree/nodes";

/**
 * Parses the given paper attributes to a tree.
 *
 * @param {Paper} paper The Paper to parse.
 *
 * @memberOf module:parsedPaper/builder
 *
 * @returns {module:parsedPaper/structure.Node} The build tree.
 */
const buildTree = function buildTree( paper ) {
	const metadata = new StructuredNode( "metadata", null );

	// Add text types.
	metadata.addChild( new MetadataText( "title", paper.getTitle() ) );
	metadata.addChild( new MetadataText( "description", paper.getDescription() ) );

	// Add miscellaneous types.
	metadata.addChild( new MetadataMiscellaneous( "keyphrase", paper.getKeyword() ) );
	metadata.addChild( new MetadataMiscellaneous( "synonyms", parseSynonyms( paper.getSynonyms() ) ) );
	metadata.addChild( new MetadataMiscellaneous( "slug", paper.getSlug() ) );
	metadata.addChild( new MetadataMiscellaneous( "titleWidth", paper.getTitleWidth() ) );
	metadata.addChild( new MetadataMiscellaneous( "permalink", paper.getPermalink() ) );
	metadata.addChild( new MetadataMiscellaneous( "locale", paper.getLocale() ) );

	return metadata;
};

export default buildTree;
