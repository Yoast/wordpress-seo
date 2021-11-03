// Proposed state:
export const state = {
	analysis: {
		config: {
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
	},
	editor: {
		title: "",
		date: "",
		permalink: "",
		excerpt: "",
		content: "",
		featuredImage: {},
	},
	form: {
		seo: {
			title: "Title",
			description: "",
			slug: "",
		},
		keyphrases: {
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
		},
		schema: {},
		social: {},
		robots: {},
	},
};
