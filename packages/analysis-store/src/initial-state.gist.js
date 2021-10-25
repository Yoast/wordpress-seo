import { ASYNC_STATUS } from "./constants";

// Proposed state:
const state = {
	data: {
		// Do we need to send locale here?
		seoTitle: "Title",
		metaDescription: "",
		date: "",
		permalink: "",
		slug: "",
		content: "",
	},
	targets: {
		keyphrases: {
			focus: "focus",
			rej2oirj: "a keyphrase", // nanoid as key?
		},
		synonyms: {
			focus: "",
			rej2oirj: "a synonym",
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
		status: ASYNC_STATUS.IDLE,
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
