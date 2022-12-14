import ageAssessments from "./ageAssessments";
import appearanceAssessments from "./appearanceAssessments";
import disabilityAssessments from "./disabilityAssessments";
import genderAssessments from "./genderAssessments";
import cultureAssessments from "./cultureAssessments";
import sesAssessments from "./sesAssessments";
import otherAssessments from "./otherAssessments";
import sexualOrientationAssessments from "./sexualOrientationAssessments";

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
