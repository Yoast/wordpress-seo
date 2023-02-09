import frequencyList from "./internal/frequencyList.json";

// This is a config for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
export default {
	frequencyList: frequencyList.list,
	wordLength: 7,
	doesUpperCaseDecreaseComplexity: true,
};
