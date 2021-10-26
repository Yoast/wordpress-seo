/**
 * @typedef {object} PaperData
 * @property {string} 
 */

/**
 * @callback analyze
 * @param {PaperData} paperData
 */

/**
 * @typedef {object} AnalysisStoreConfig
 * @property {function} analyze - The function to analyze paper data based on keyphrases and configuration.
 * @property {function} preparePaper - The function to prepare/transform paper data before sending it to the analyze function.
 * @property {function} processResults - The function to process/transform analysis results.
 */

/**
 * @typedef {object} AnalysisStoreInterface
 * @property {object} store - The Redux Store.
 * @property {React.ReactElement} Provider - The registry Provider.
 */