import { build } from "./build";
import LanguageProcessor from "./language/LanguageProcessor";

/**
 * Ensures the given paper has an HTML tree, building it if it doesn't.
 *
 * This is the supported public entry point for satisfying the tree precondition of `Assessor.assess()`
 * and of tree-dependent researches when driving them directly (i.e. without `AnalysisWorkerWrapper`).
 * It is a no-op when the paper already carries a tree, so it is safe to call before reusing a paper
 * across multiple assessor passes.
 *
 * @param {Paper}      paper      The paper to ensure has a tree. Mutated in place when a tree is built.
 * @param {Researcher} researcher The researcher whose language processor should be used to tokenize.
 *
 * @returns {Paper} The same paper instance, guaranteed to have a tree.
 */
export function ensureTree( paper, researcher ) {
	if ( paper.getTree() !== null ) {
		return paper;
	}

	const languageProcessor = new LanguageProcessor( researcher );
	const shortcodes = paper._attributes && paper._attributes.shortcodes;
	paper.setTree( build( paper, languageProcessor, shortcodes ) );

	return paper;
}
