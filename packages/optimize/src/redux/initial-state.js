import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { createInitialImageState, withId } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";

import { DEFAULT_KEYPHRASE_KEYS } from "./reducers/analysis-related";

/**
 *
 * @param {Object} contentType Content type options.
 * @returns {Object} Initial state of query data for content type.
 */
export const createInitialQueryData = ( contentType = { slug: "", requestData: {} } ) => {
	return ( {
		...contentType.requestData,
		contentType: contentType.slug,
		filters: {},
		// Add optional additional query data from content type options.
		sortBy: contentType.defaultSort || {
			column: "",
			direction: "desc",
		},
		searchTerm: "",
	} );
};

export const defaultInitialState = {
	notifications: [],
	options: {
		contentTypes: {},
		faviconSrc: "",
		siteUrl: "https:///",
		locale: "en",
		contentTypeSchemaInfoLink: "",
		cornerstoneContentInfoLink: "",
		readabilityAnalysisInfoLink: "",
		keyphraseSynonymsInfoLink: "",
		focusKeyphraseInfoLink: "",
		noIndexInfoLink: "",
		noFollowInfoLink: "",
		metaRobotsInfoLink: "",
		canonicalUrlInfoLink: "",
	},
	settings: {},
	list: {
		data: {
			items: [],
			after: null,
		},
		query: {
			status: ASYNC_STATUS.idle,
			error: {},
			moreResultsStatus: ASYNC_STATUS.idle,
			moreResultsError: {},
			data: createInitialQueryData(),
		},
	},
	detail: {
		save: {
			status: ASYNC_STATUS.idle,
			error: "",
		},
		data: {
			title: "",
			description: "",
			slug: "",
			isCornerstone: false,
			previewMode: "mobile",
			price: "",
			availability: "",
			fallbacks: {},
			reviews: {
				count: null,
				rating: null,
			},
			date: "2021-07-29T07:36:33.190Z",
			author: "",
			images: [],
			keyphrases: {
				focus: "",
				related: {},
				synonyms: {
					focus: "",
				},
			},
			scores: {
				readability: null,
				seo: null,
			},
			schema: {
				pageType: "",
				articleType: "",
			},
			seo: {
				title: "",
				description: "",
			},
			opengraph: {
				title: "",
				description: "",
				image: createInitialImageState(),
			},
			twitter: {
				title: "",
				description: "",
				image: createInitialImageState(),
			},
			advanced: {
				canonicalUrl: "",
				robots: {
					isNoIndex: null,
					isNoFollow: false,
					advanced: [],
				},
			},
		},
		metadata: {
			editUrl: "",
			previewUrl: "",
		},
		analysis: {
			focus: {
				status: ASYNC_STATUS.idle,
				readability: {},
				seo: {},
			},
			related: {
				status: ASYNC_STATUS.idle,
				availableKeys: [ ...DEFAULT_KEYPHRASE_KEYS ],
			},
			marker: {
				id: null,
				marks: [],
			},
			research: {
				status: ASYNC_STATUS.idle,
				morphology: {},
			},
		},
	},
};

/**
 * Create the Redux initial state.
 * @param {Object} config The configuration object.
 * @param {Object[]} config.contentTypes The content type options.
 * @param {Object} config.settings The user settings configured in Settings UI.
 * @param {Object} config.options The general options.
 * @param {Object} config.notifications The initial general messages.
 * @returns {Object} Initial state object.
 */
const createInitialState = ( { contentTypes, settings, options, notifications } ) => {
	return merge(
		{},
		defaultInitialState,
		{
			notifications: notifications.map( withId ),
			settings,
			options: { ...options, contentTypes },
		},
	);
};

export default createInitialState;
