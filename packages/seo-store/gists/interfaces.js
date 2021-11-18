// -------------- Analyze function --------------
const paper = {
	analysisType: "post",
	seoTitle: "Title",
	metaDescription: "",
	date: "",
	permalink: "",
	slug: "",
	content: "",
	// No more locale here: needs analysis worker adaptation.
	isCornerstone: false,
	// IsTaxonomy: false,  -- Replaced by analysisType.
	seoTitleWidth: 0,
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

// -------------- Initialize function --------------

// Inside worker wrapper??
/**
 * 1. createWorker( workerUrl )
 * 2. worker.postMessage( researchUrl )
 * 3. fetchMorphologyData( morphologyUrl )
 * 4. createConfiguration( )
 * 5. worker.initialize( configuration )
 * 6. return worker
 */
async function createAnalyzer( { analysisWorkerUrl, analysisResearcherUrlBase, morphologyUrl, locale, ...rest } ) {
	const worker = createWorker( analysisWorkerUrl );
	const researchUrl = createResearchUrl( analysisResearcherUrlBase, locale );

	worker.postMessage( {
		dependencies: [ researchUrl ],
	} );
	const morphology = await getMorphologyData( { morphologyUrl, locale } );
	const configuration = createConfiguration( { morphology, ...rest } );

	worker.initialize( configuration );

	return {
		// New functionality to combine current analyze with analyzeRelatedKeywords and runResearch.
		analyze: worker.analyze,
		// Bit out of scope for now, but this needs to stay for extensibility
		loadScript: worker.loadScript,
		customMessage: worker.customMessage,
	};
}

const wrapperConfig = {
	analysisWorkerUrl: "",
	researchUrl: "",
	morphologyUrl: "", // -> fetches the morphology data and passes it to the worker as researchData.
	locale: "en_US", // Needed to determine the morphology URL
	// Worker.initialize
	//	ContentAnalysisActive: true,
	//	KeywordAnalysisActive: true,
	useKeywordDistribution: false,
	locale: "en_US",
	//	CustomAnalysisType: "",
	translations: {},
	assessorOptions: {
		[ analysisType ]: {},
	}, // Mostly used for shortlinks per analysisType.
	defaultQueryParams: {},
	logLevel: "",
	enabledFeatures: [],
};


// Assessments config
const assessments = {
	introductionKeyword: {
		urlTitle: "",
		urlCallToAction: "",
	},
	keyphraseLength: {
		urlTitle: "",
		urlCallToAction: "",
	},
	metaDescriptionKeyword: {
		parameters: { recommendedMinimum: 1 },
		urlTitle: "",
		urlCallToAction: "",
	},
};
const analysisTypes = {
	product: {
		readabilityAssessments: {
			standard: [ "introduction", "keyphraseLength" ],
			cornerstone: [
				{ introductionKeyword: { isRelatedKeyphrase: true } },
				{ metaDescriptionKeyword: { scores: { good: 9, bad: 3 } } },
			],
		},
		focusKeyphraseAssessments: {
			standard: [],
			cornerstone: [],
		},
		relatedKeyphraseAssessments: {
			standard: [],
			cornerstone: [],
		},
	},
};
