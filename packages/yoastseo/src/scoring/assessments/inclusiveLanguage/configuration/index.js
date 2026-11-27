import ageAssessments from "./ageAssessments.js";
import appearanceAssessments from "./appearanceAssessments.js";
import disabilityAssessments from "./disabilityAssessments.js";
import genderAssessments from "./genderAssessments.js";
import cultureAssessments from "./cultureAssessments.js";
import sesAssessments from "./sesAssessments.js";
import otherAssessments from "./otherAssessments.js";
import sexualOrientationAssessments from "./sexualOrientationAssessments.js";

export default [
	...ageAssessments,
	...appearanceAssessments,
	...disabilityAssessments,
	...genderAssessments,
	...cultureAssessments,
	...sesAssessments,
	...otherAssessments,
	...sexualOrientationAssessments,
];
