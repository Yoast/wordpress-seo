const assessments = [
	{
		identifier: "seniorsCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternative: "older persons/older people, older citizen(s)",
		score: 6,
		feedbackFormat: "Avoid using \"%1$s\" as it is potentially harmful. " +
						"Consider using \"%2$s\" instead unless referring to yourself or to " +
						"someone who explicitly wants to be referred to with this term. " +
						"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\").",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternative: "older persons/older people",
		score: 3,
		feedbackFormat: "Avoid using \"%1$s\" as it is potentially harmful. " +
						"Consider using \"%2$s\" instead unless referring to yourself or to " +
						"someone who explicitly wants to be referred to with this term. " +
						"Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\").",
		learnMoreUrl: "https://yoa.st/",
	},
];

export default assessments;
