/**
 * Constructs a new SEO assessor.
 *
 * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher the assessments need to use to get information about the text.
 *
 * @param {Object}                              config                    The assessor configuration.
 * @param {boolean}                             [config.relatedKeyphrase] If this assessor is for a related keyphrase, instead of the main one.
 * @param {boolean}                             [config.taxonomy]         If this assessor is for a taxonomy page, instead of a regular page.
 * @param {boolean}                             [config.cornerstone]      If this assessor is for cornerstone content.
 *
 * @returns {module:parsedPaper/assess.TreeAssessor} The created SEO assessor.
 *
 * @throws {Error} An error when no assessor exists for the given combination of configuration options.
 *
 * @memberOf module:parsedPaper/assess
 */
export function constructSEOAssessor(researcher: any, config: {
    relatedKeyphrase?: boolean | undefined;
    taxonomy?: boolean | undefined;
    cornerstone?: boolean | undefined;
}): any;
/**
 * Constructs a new readability assessor.
 *
 * @param {module:parsedPaper/research.TreeResearcher} researcher           The researcher the assessments need to use to
 *                                                                          get information about the text.
 * @param {boolean}                                    isCornerstoneContent If the to be analyzed content is considered cornerstone content
 * (which uses stricter boundaries).
 *
 * @returns {module:parsedPaper/assess.TreeAssessor} The created readability assessor.
 *
 * @memberOf module:parsedPaper/assess
 */
export function constructReadabilityAssessor(researcher: any, isCornerstoneContent?: boolean): any;
