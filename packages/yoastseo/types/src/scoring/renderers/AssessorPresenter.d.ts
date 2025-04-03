export default AssessorPresenter;
/**
 * Represents the AssessorPresenter.
 */
declare class AssessorPresenter {
    /**
     * Constructs the AssessorPresenter.
     *
     * @param {Object} args A list of arguments to use in the presenter.
     * @param {object} args.targets The HTML elements to render the output to.
     * @param {string} args.targets.output The HTML element to render the individual ratings out to.
     * @param {string} args.targets.overall The HTML element to render the overall rating out to.
     * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
     * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
     *
     * @constructor
     */
    constructor(args: {
        targets: {
            output: string;
            overall: string;
        };
        keyword: string;
        assessor: SEOAssessor;
    });
    keyword: string;
    assessor: SEOAssessor;
    output: string;
    overall: string;
    presenterConfig: Object;
    _disableMarkerButtons: boolean;
    _activeMarker: boolean;
    /**
     * Sets the keyword.
     *
     * @param {string} keyword The keyword to use.
     * @returns {void}
     */
    setKeyword(keyword: string): void;
    /**
     * Checks whether a specific property exists in the presenter configuration.
     *
     * @param {string} property The property name to search for.
     * @returns {boolean} Whether or not the property exists.
     */
    configHasProperty(property: string): boolean;
    /**
     * Gets a fully formatted indicator object that can be used.
     *
     * @param {string} rating The rating to use.
     * @returns {Object} An object containing the class, the screen reader text, and the full text.
     */
    getIndicator(rating: string): Object;
    /**
     * Gets the indicator color class from the presenter configuration, if it exists.
     *
     * @param {string} rating The rating to check against the config.
     * @returns {string} String containing the CSS class to be used.
     */
    getIndicatorColorClass(rating: string): string;
    /**
     * Gets the indicator screen reader text from the presenter configuration, if it exists.
     *
     * @param {string} rating The rating to check against the config.
     * @returns {string} Translated string containing the screen reader text to be used.
     */
    getIndicatorScreenReaderText(rating: string): string;
    /**
     * Gets the indicator screen reader readability text from the presenter configuration, if it exists.
     *
     * @param {string} rating The rating to check against the config.
     * @returns {string} Translated string containing the screen reader readability text to be used.
     */
    getIndicatorScreenReaderReadabilityText(rating: string): string;
    /**
     * Gets the indicator full text from the presenter configuration, if it exists.
     *
     * @param {string} rating The rating to check against the config.
     * @returns {string} Translated string containing the full text to be used.
     */
    getIndicatorFullText(rating: string): string;
    /**
     * Adds a rating based on the numeric score.
     *
     * @param {Object} result Object based on the Assessment result. Requires a score property to work.
     * @returns {Object} The Assessment result object with the rating added.
     */
    resultToRating(result: Object): Object;
    /**
     * Takes the individual assessment results, sorts and rates them.
     *
     * @returns {Object} Object containing all the individual ratings.
     */
    getIndividualRatings(): Object;
    /**
     * Excludes items from the results that are present in the `exclude` array.
     *
     * @param {Array} results Array containing the items to filter through.
     * @param {Array} exclude Array of results to exclude.
     * @returns {Array} Array containing items that remain after exclusion.
     */
    excludeFromResults(results: any[], exclude: any[]): any[];
    /**
     * Sorts results based on their score property and always places items considered to be non-sortable, at the top.
     *
     * @param {Array} results Array containing the results that need to be sorted.
     * @returns {Array} Array containing the sorted results.
     */
    sort(results: any[]): any[];
    /**
     * Returns a subset of results that have an undefined score or a score set to zero.
     *
     * @param {Array} results The results to filter through.
     * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
     */
    getUndefinedScores(results: any[]): any[];
    /**
     * Creates a rating object based on the item that is being passed.
     *
     * @param {Object} item The item to check and create a rating object from.
     * @returns {Object} Object containing a parsed item, including a colored indicator.
     */
    addRating(item: Object): Object;
    /**
     * Calculates the overall rating score based on the overall score.
     *
     * @param {Number} overallScore The overall score to use in the calculation.
     * @returns {Object} The rating based on the score.
     */
    getOverallRating(overallScore: number): Object;
    /**
     * Marks with a given marker. This will set the active marker to the correct value.
     *
     * @param {string} identifier The identifier for the assessment/marker.
     * @param {Function} marker The marker function.
     * @returns {void}
     */
    markAssessment(identifier: string, marker: Function): void;
    /**
     * Disables the currently active marker in the UI.
     *
     * @returns {void}
     */
    disableMarker(): void;
    /**
     * Disables the marker buttons.
     *
     * @returns {void}
     */
    disableMarkerButtons(): void;
    /**
     * Enables the marker buttons.
     *
     * @returns {void}
     */
    enableMarkerButtons(): void;
    /**
     * Adds an event listener for the marker button
     *
     * @param {string} identifier The identifier for the assessment the marker belongs to.
     * @param {Function} marker The marker function that can mark the assessment in the text.
     * @returns {void}
     */
    addMarkerEventHandler(identifier: string, marker: Function): void;
    /**
     * Renders out both the individual and the overall ratings.
     *
     * @returns {void}
     */
    render(): void;
    /**
     * Adds event handlers to the mark buttons.
     *
     * @param {Object} scores The list of rendered scores.
     *
     * @returns {void}
     */
    bindMarkButtons(scores: Object): void;
    /**
     * Removes all marks currently on the text.
     *
     * @returns {void}
     */
    removeAllMarks(): void;
    /**
     * Renders out the individual ratings.
     * Here, this method is set to noop. In `post-scraper.js` and `term-scraper.js` where this method is called, it is overridden with noop as well.
     *
     * @returns {void}
     */
    renderIndividualRatings(): void;
    /**
     * Renders out the overall rating.
     *
     * @returns {void}
     */
    renderOverallRating(): void;
}
