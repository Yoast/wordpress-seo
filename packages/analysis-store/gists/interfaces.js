const paper = {
	analysisType: "post",
	seoTitle: "Title",
	metaDescription: "",
	date: "",
	permalink: "",
	slug: "",
	content: "",
};
const keyphrases = {
	focus: {
		id: "focus",
		keyphrase: "focus",
		synonyms: "",
	},
	rej2oirj: {
		id: "rej2oirj",
		keyphrase: "a keyphrase",
		synonyms: "a synonym",
	},
};
const config = {
	// Do we need other config here?
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

export const analyzeInterface = {
	paper,
	keyphrases,
	config,
};

export const resultsInterface = {
	seo: {
		focus: {},
		// Have a nanoid as key.
		rej2oirj: {},
	},
	readability: {},
	research: {
		morphology: {},
	},
};
