import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import { build } from "../../../src/parse/build";

/**
 * Builds an HTML tree for a given paper and researcher, and adds it to the paper.
 *
 * @param {Paper} paper The paper to which the tree will be added.
 * @param {Researcher} researcher The researcher.
 * @returns {void}
 */
export default function buildTree( paper, researcher ) {
	const languageProcessor = new LanguageProcessor( researcher );
	paper.setTree( build( paper.getText(), languageProcessor ) );
}
