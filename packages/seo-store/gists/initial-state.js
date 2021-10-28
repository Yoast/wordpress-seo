// Proposed state:
export const state = {
	data: {
		// Do we need to send locale here?
		seoTitle: "Title",
		metaDescription: "",
		date: "",
		permalink: "",
		slug: "",
		content: "",
		// Editor data we could use, for example in replacevars or for fallbacks.
		title: "",
		excerpt: "",
		featuredImage: {},
		// Fallbacks? Make a solution similar to replacevars.
	},
	keyphrases: {
		focus: {
			keyphrase: "focus",
			synonyms: "",
		},
		// Have a nanoid as key?
		rej2oirj: {
			id: "rej2oirj",
			keyphrase: "a keyphrase",
			synonyms: "a synonym",
		},
	},
	config: {
		// Do we need other config here?
		analysisType: "post",
		isSeoActive: true,
		isReadabilityActive: true,
		researches: [ "morphology" ],
	},
	results: {
		status: "idle",
		error: "",
		seo: {
			focus: {},
			rej2oirj: {},
		},
		readability: {},
		research: {
			morphology: {},
		},
	},
};
