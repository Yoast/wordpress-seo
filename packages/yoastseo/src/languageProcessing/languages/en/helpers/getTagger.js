import POSTagger from "./internal/tagger/POSTagger";

/**
 * Returns the tagger.
 *
 * @returns {POSTagger} The tagger.
 */
export default function getTagger() {
	return new POSTagger();
}
