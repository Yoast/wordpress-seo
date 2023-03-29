import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import filterTree from "../../../src/parse/build/private/filterTree";
import { build } from "../../../src/parse/build";
import permanentFilters from "../../../src/parse/build/private/alwaysFilterElements";

/**
 * Builds an HTML tree for a given paper and researcher, and adds it to the paper.
 *
 * @param {Paper} paper The paper to which the tree will be added.
 * @param {Researcher} researcher The researcher.
 * @returns {void}
 */
export default function buildTree( paper, researcher ) {
	const languageProcessor = new LanguageProcessor( researcher );
	paper.setTree( filterTree( build( paper.getText(), languageProcessor ), permanentFilters ) );
}
