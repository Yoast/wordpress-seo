/**
 * FactoryProto is a mock factory function.
 *
 */
export default class FactoryProto {
    /**
     * Returns a mock element that lodash accepts as an element.
     *
     * @returns {object} Mock HTML element.
     */
    static buildMockElement(): object;
    /**
     * Returns a mock researcher.
     *
     * @param {Object} expectedValue Expected value.
     * @param {boolean} [multiValue=false] Whether the researcher has multiple values.
     * @param {boolean} [hasMorphologyData=false] Whether the researcher has morphology data.
     * @param {Object|boolean} [config=false] Optional config to be used for an assessment.
     * @param {Object|boolean} [helpers=false] Optional helpers to be used for an assessment.
     *
     * @returns {Object} Mock researcher.
     */
    static buildMockResearcher(expectedValue: Object, multiValue?: boolean | undefined, hasMorphologyData?: boolean | undefined, config?: boolean | Object | undefined, helpers?: boolean | Object | undefined): Object;
    /**
     * This method repeats a string and returns a new string based on the string and the amount of repetitions.
     *
     * @param {string} string      String to repeat.
     * @param {int}    repetitions Number of repetitions.
     *
     * @returns {string} The result.
     */
    static buildMockString(string: string, repetitions: int): string;
}
