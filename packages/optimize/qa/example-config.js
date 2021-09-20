/**
 * Part we need from the yoastseo's Mark.
 * @param {Object} properties The properties.
 * @constructor
 */
function Mark( properties = { original: "", marked: "" } ) {
	this._properties = properties;
	this.applyWithReplace = function( text ) {
		return text.split( this._properties.original ).join( this._properties.marked );
	};
}

/**
 * Create mock list item data.
 * @param {string} id Identifier.
 * @returns {Object} Item data.
 */
const createMockListItem = ( id ) => ( {
	id: `${ id }`,
	image: { url: "https://yoast.com/app/uploads/2020/11/seo_academy_bubble-e1606118557866.png" },
	title: `${ id } title`,
	date: "2021-06-14T10:20:14+0000",
	seoScore: "",
	readabilityScore: "",
	seo: {
		title: "SEO title with title var: %%title%%",
		description: "SEO description with focus keyphrase var: %%focus_keyphrase%%",
	},
	keyphrases: {
		focus: "Focus keyphrase",
	},
} );

export const mockItemsData = {
	products: [ "product-1", "product-2", "product-3", "product-4" ].map( createMockListItem ),
	"product-tags": [ "product-tag-1", "product-tag-2", "product-tag-3", "product-tag-4" ].map( createMockListItem ),
	"blog-posts": [ "blog-post-1", "blog-post-2" ].map( createMockListItem ),
};

export const mockAnalysisData = {
	readability: {
		results: {
			errorsResults: [],
			problemsResults: [
				{
					score: 3,
					rating: "bad",
					hasMarks: true,
					marker: [
						new Mark( {
							original: "description",
							marked: "<yoastmark class=\"yoast-text-mark\">description</yoastmark>",
						} ),
					],
					id: "passiveVoice",
					text: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: 20% of the sentences contain passive voice, which is more than the recommended maximum of 10%. <a href='https://yoa.st/34u' target='_blank'>Try to use their active counterparts</a>.",
					markerId: "passiveVoice",
				},
			],
			improvementsResults: [
				{
					score: 6,
					rating: "OK",
					hasMarks: false,
					marker: [],
					id: "fleschReadingEase",
					text: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 50.6 in the test, which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences to improve readability</a>.",
					markerId: "fleschReadingEase",
				},
				{
					score: 6,
					rating: "OK",
					hasMarks: true,
					marker: [
						new Mark( {
							original: "Mock",
							marked: "<yoastmark class=\"yoast-text-mark\">Mock</yoastmark>",
						} ),
					],
					id: "textSentenceLength",
					text: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: 30% of the sentences contain more than 20 words, which is more than the recommended maximum of 25%. <a href='https://yoa.st/34w' target='_blank'>Try to shorten the sentences</a>.",
					markerId: "textSentenceLength",
				},
			],
			goodResults: [
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "subheadingsTooLong",
					text: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: You are not using any subheadings, but your text is short enough and probably doesn't need them.",
					markerId: "subheadingsTooLong",
				},
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "textParagraphTooLong",
					text: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!",
					markerId: "textParagraphTooLong",
				},
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "textTransitionWords",
					text: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!",
					markerId: "textTransitionWords",
				},
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "sentenceBeginnings",
					text: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
					markerId: "sentenceBeginnings",
				},
			],
			considerationsResults: [],
		},
		score: 30,
	},
	seo: {
		results: {
			errorsResults: [],
			problemsResults: [
				{
					score: -10,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "keywordDensity",
					text: "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 6 times. That's more than the recommended maximum of 5 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!",
					markerId: "keywordDensity",
				},
				{
					score: 1,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "metaDescriptionLength",
					text: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>:  No meta description has been specified. Search engines will display copy from the page instead. <a href='https://yoa.st/34e' target='_blank'>Make sure to write one</a>!",
					markerId: "metaDescriptionLength",
				},
				{
					score: 3,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "images",
					text: "<a href='https://yoa.st/33c' target='_blank'>Images</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
					markerId: "images",
				},
				{
					score: -10,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "textLength",
					text: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 176 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>.",
					markerId: "textLength",
				},
				{
					score: 3,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "externalLinks",
					text: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: No outbound links appear in this page. <a href='https://yoa.st/34g' target='_blank'>Add some</a>!",
					markerId: "externalLinks",
				},
				{
					score: 3,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "internalLinks",
					text: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: No internal links appear in this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!",
					markerId: "internalLinks",
				},
				{
					score: 1,
					rating: "bad",
					hasMarks: false,
					marker: [],
					id: "titleWidth",
					text: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: <a href='https://yoa.st/34i' target='_blank'>Please create an SEO title</a>.",
					markerId: "titleWidth",
				},
			],
			improvementsResults: [],
			goodResults: [
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "introductionKeyword",
					text: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
					markerId: "introductionKeyword",
				},
				{
					score: 9,
					rating: "good",
					hasMarks: false,
					marker: [],
					id: "keyphraseLength",
					text: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
					markerId: "keyphraseLength",
				},
			],
			considerationsResults: [],
		},
		score: 8,
	},
};

export const mockDetailData = {
	title: "Mock title",
	description: "Mock description",
	slug: "mock-slug",
	isCornerstone: false,
	price: "$12345,67",
	availability: "In stock",
	fallbacks: {
		seo: {
			title: "SEO title fallback from CMS",
			description: "SEO description fallback from CMS",
		},
	},
	reviews: {
		count: 999,
		rating: 5,
	},
	date: "2021-07-29T07:36:33.190Z",
	author: "Mock Authur",
	keyphrases: {
		focus: "Mock focus keyphrase",
		related: {
			a: "Mock related keyphrase A",
			b: "Mock related keyphrase B",
		},
		synonyms: {
			focus: "Mock focus kephrase synonym",
			a: "Mock related keyphrase synonym A",
			b: "Mock related keyphrase synonym B",
		},
	},
	seo: {
		title: "Mock SEO title",
		description: "Mock SEO description",
	},
	opengraph: {
		title: "Mock Facebook title",
		description: "Mock Facebook description",
		image: {
			url: "https://placekitten.com/150/100",
		},
	},
	twitter: {
		title: "Mock Twitter title",
		description: "Mock Twitter description",
		image: {
			url: "",
		},
	},
	advanced: {
		breadcrumbsTitle: "Mock breadcrumbs title",
		canonicalUrl: "https://canonical-url.mock",
		robots: {
			isNoIndex: null,
			isNoFollow: false,
			advanced: [],
		},
	},
	scores: {
		readability: null,
		seo: null,
	},
	images: [
		{
			id: "1",
			url: "https://placekitten.com/400/250",
			alt: "Featured image",
		},
		{
			id: "2",
			url: "https://placekitten.com/150/100",
			alt: "alt text",
		},
		{
			id: "3",
			url: "https://placekitten.com/200/200",
			alt: "alt text",
		},
		{
			id: "4",
			url: "https://placekitten.com/100/300",
			alt: "alt text",
		},
		{
			id: "5",
			url: "https://placekitten.com/100/100",
			alt: "alt text",
		},
	],
};

export const mockDetailMetadata = {
	editUrl: "https://example.com/edit",
	previewUrl: "https://example.com/preview",
};

const exampleColumnConfig = [
	{
		key: "image",
		label: "Image",
		sortable: false,
		type: "thumbnail",
	},
	{
		key: "title",
		label: "Title",
		sortable: true,
		type: "",
	},
	{
		key: "date",
		label: "Date",
		sortable: true,
		type: "date",
	},
	{
		key: "seoScore",
		icon: <svg
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="none" fill="currentColor"
			className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
		>
			<path
				key="outerPath"
				d="M13.56 0H7a3.5 3.5 0 0 0-3.34 3.4v13.16A3.41 3.41 0 0 0 7.06 20h6.5A3.41 3.41 0 0 0 17 16.56V3.4A3.51 3.51 0 0 0 13.56 0zm1.9 16.08a2.37 2.37 0 0 1-2.35 2.37H7.52a2.37 2.37 0 0 1-2.35-2.37V3.86a2.37 2.37 0 0 1 2.35-2.37h5.59a2.37 2.37 0 0 1 2.35 2.37z"
			/>
			<circle key="circle1" cx="10.31" cy="9.98" r="2.15" />
			<circle key="circle2" cx="10.31" cy="4.69" r="2.15" />
			<circle key="circle3" cx="10.31" cy="15.31" r="2.15" />
		</svg>,
		label: "SEO score",
		sortable: false,
		type: "score",
	},
	{
		key: "readabilityScore",
		icon: <svg
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="none" fill="currentColor"
			className="yst-w-5 yst-h-5 yst-mx-auto yst-text-gray-500"
		>
			<path
				d="M2.42 19.81a.11.11 0 1 0 .19.1C5.75 14.5 8.88 17 13.17 14.17c-2.92 0-3.72-1.56-3.72-1.56a7 7 0 0 0 5.26.39c1-.8 2.79-2.64 2.93-6.59a3.44 3.44 0 0 1-2.42.29 4.81 4.81 0 0 0 2.4-1.7 5.85 5.85 0 0 0-2.74-5c.79 10.33-9.17 5.88-11.67 18.29A12.55 12.55 0 0 1 9 11.78c2.83-1.49 5.15-2.93 6-6.71-.64 4.56-2.7 6.25-5.55 7.53-2.66 1.2-5.39 2.68-7.03 7.21z"
			/>
		</svg>,
		label: "Readability score",
		sortable: false,
		type: "score",
	},
	{
		key: "seo.title",
		label: "SEO title",
		sortable: false,
		type: "",
	},
	{
		key: "seo.description",
		label: "Meta description",
		sortable: true,
		type: "",
	},
	{
		key: "keyphrases.focus",
		label: "Focus keyphrase",
		sortable: true,
		type: "",
	},
];

const exampleSettings = {
	contentTypes: {
		products: {
			showSingleInSearchResults: false,
			showArchiveInSearchResults: true,
			showSEOSettings: true,
			schema: {
				pageType: "WebPage",
				articleType: "Article",
			},
			templates: {
				seo: {
					single: {
						title: "Settings SEO title",
						description: "Settings SEO description",
					},
					archive: {
						title: "",
						description: "",
					},
				},
				social: {
					single: {
						title: "",
						description: "",
						image: {},
					},
					archive: {
						title: "",
						description: "",
						image: {},
					},
				},
			},
			breadcrumbsTitle: "",
		},
		productTags: {
			showSingleInSearchResults: true,
			showArchiveInSearchResults: true,
			showSEOSettings: true,
			schema: {
				pageType: "CollectionPage",
				articleType: "",
			},
			templates: {
				seo: {
					single: {
						title: "Settings SEO title",
						description: "Settings SEO description",
					},
					archive: {
						title: "",
						description: "",
					},
				},
				social: {
					single: {
						title: "",
						description: "",
						image: {},
					},
					archive: {
						title: "",
						description: "",
						image: {},
					},
				},
			},
			breadcrumbsTitle: "",
		},
	},
	integrations: {
		webmasterVerification: {
			pinterest: "",
			google: "",
			bing: "",
			yandex: "",
			baidu: "",
		},
		semRush: true,
		ryte: true,
		zapier: false,
	},
	schema: {
		siteRepresentation: {
			organizationOrPerson: "organization",
			organizationName: "",
			organizationLogo: {
				url: "",
			},
			personName: "John Doe",
			personAvatar: "",
		},
		socialProfiles: {
			facebookPageUrl: "",
			twitterProfileUrl: "",
			instagramUrl: "",
			other: [],
		},
	},
	siteSettings: {
		siteDefaults: {
			separator: "--sep--",
			siteImage: "",
		},
	},
	advancedSettings: {
		notFoundPages: {
			title: "",
		},
		searchPages: {
			title: "",
		},
		rss: {
			contentBeforePost: "",
			contentAfterPost: "The post %%POSTLINK%% appeared first on %%BLOGLINK%%.",
		},
	},
};

/* eslint-disable no-unused-vars */
/**
 * An example for how to implement the imagePicker.
 *
 * @param {Object} config The data of the currently selected image.
 * @param {Function} config.successCallback Callback to fire when upload succeeds.
 * @param {Function} config.errorCallback Callback to fire when upload fails.
 * @param {File} file File to be uploaded.
 *
 * @returns {void}
 */
export const mockImagePicker = async ( { requestCallback, successCallback, errorCallback } ) => {
	requestCallback();
	// Mock async delay
	await new Promise( resolve => setTimeout( resolve, 1500 ) );

	// return errorCallback( { message: "Something terrible has happened." } );
	successCallback( { id: "image-id", url: "https://fhm.nl/wp-content/uploads/2018/05/Bassie-Euro-Entertainment-375x270.jpg" } );
};
/* eslint-enable no-unused-vars */

const contentTypes = {
	products: {
		slug: "products",
		label: "Products",
		labelSingular: "Product",
		columns: exampleColumnConfig,
		defaultSort: {
			column: "title",
			direction: "desc",
		},
		hasSchemaPageTypes: true,
		hasSchemaArticleTypes: true,
		hasAutomaticSchemaTypes: true,
		filters: [
			{
				name: "status",
				label: "Status",
				choices: [
					{
						value: "all",
						label: "All statuses",
					}, {
						value: "active",
						label: "Active",
					}, {
						value: "draft",
						label: "Draft",
					}, {
						value: "archived",
						label: "Archived",
					},
				],
			},
		],
	},
	"product-tags": {
		slug: "product-tags",
		label: "Product tags",
		labelSingular: "Product tag",
		columns: exampleColumnConfig,
		defaultSort: {
			column: "date",
			direction: "desc",
		},
		hasSchemaPageTypes: true,
		hasSchemaArticleTypes: true,
		hasAutomaticSchemaTypes: true,
		hasReadabilityAnalysis: false,
		hasSeoAnalysis: false,
		hasRelatedKeyphrases: false,
		hasCornerstone: false,
		hasContentEditor: false,
		hasMediaList: false,
	},
	"blog-posts": {
		slug: "blog-posts",
		label: "Blog posts",
		labelSingular: "Blog post",
		defaultSort: {
			column: "date",
			direction: "desc",
		},
		columns: exampleColumnConfig,
		filters: [],
		mediaListTitle: "Featured image",
	},
};

export default {
	notifications: [
		{
			title: "This is an initial general warning",
		},
	],
	contentTypes,
	navigation: {
		"blog-posts": {
			children: [ {
				key: "blog-post-1",
				target: "blog-post/blog-1",
				label: "Blog posts 1",
				priority: 10,
				props: {
					contentType: {
						...contentTypes[ "blog-posts" ],
						requestData: {
							blogId: "blog-1",
						},
					},
				},
			}, {
				key: "blog-post-2",
				target: "blog-post/blog-2",
				label: "Blog posts 2",
				priority: 10,
				props: {
					contentType: {
						...contentTypes[ "blog-posts" ],
						requestData: {
							blogId: "blog-2",
						},
					},
				},
			} ],
		},
	},
	options: {
		cmsName: "WordPress SEO",
		siteUrl: "https://mock.site.url",
		siteSocialImage: {
			url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg",
		},
		contentTypeSchemaInfoLink: "https://example.com/schema-info",
		cornerstoneContentInfoLink: "https://example.com/cornerstone-info",
		readabilityAnalysisInfoLink: "https://example.com/readability-info",
		keyphraseSynonymsInfoLink: "https://example.com/keyphrase-synonyms-info",
		focusKeyphraseInfoLink: "https://example.com/focus-keyphrase-info",
		noIndexInfoLink: "https://example.com/noindex-info",
		noFollowInfoLink: "https://example.com/nofollow-info",
		metaRobotsInfoLink: "https://example.com/meta-robots-info",
		canonicalUrlInfoLink: "https://example.com/canonical-url-info",
	},
	settings: exampleSettings,
	imagePicker: mockImagePicker,
	handleQuery: async ( query ) => {
		console.warn( "you are trying to get by this query:", query );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
			data: {
				items: mockItemsData[ query.contentType ],
				moreItemsAvailable: Math.random() < 0.5,
			},
			error: { message: "An unexpected error occurred." },
		};
	},
	handleSave: async ( data, { contentType, id } ) => {
		console.warn( "you are trying to save this data:", data, { contentType, id } );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
		};
	},
	getDetail: async ( data ) => {
		console.warn( "you are trying to get a detail by this data:", data );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
			data: mockDetailData,
			metadata: mockDetailMetadata,
		};
	},
	runAnalysis: async ( { contentType, data } ) => {
		console.warn( "you are trying to run an analysis with this data:", contentType, data );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
			data: mockAnalysisData,
		};
	},
	runRelatedKeyphraseAnalysis: async ( { contentType, data } ) => {
		console.warn( "you are trying to run a related keyphrases analysis with this data:", contentType, data );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
			data: {
				a: {
					results: {
						errorsResults: [],
						problemsResults: [
							{
								score: 3,
								rating: "bad",
								hasMarks: false,
								marker: [],
								id: "introductionKeyword",
								text: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Your keyphrase or its synonyms do not appear in the first paragraph. <a href='https://yoa.st/33f' target='_blank'>Make sure the topic is clear immediately</a>.",
								markerId: "a:introductionKeyword",
							},
							{
								score: 3,
								rating: "bad",
								hasMarks: false,
								marker: [],
								id: "images",
								text: "<a href='https://yoa.st/33c' target='_blank'>Images</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
								markerId: "a:images",
							},
						],
						improvementsResults: [],
						goodResults: [
							{
								score: 9,
								rating: "good",
								hasMarks: false,
								marker: [],
								id: "keyphraseLength",
								text: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
								markerId: "a:keyphraseLength",
							},
						],
						considerationsResults: [],
					},
					score: 33,
				},
				b: {
					results: {
						errorsResults: [],
						problemsResults: [
							{
								score: 3,
								rating: "bad",
								hasMarks: false,
								marker: [],
								id: "images",
								text: "<a href='https://yoa.st/33c' target='_blank'>Images</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
								markerId: "b:images",
							},
						],
						improvementsResults: [],
						goodResults: [
							{
								score: 9,
								rating: "good",
								hasMarks: false,
								marker: [],
								id: "introductionKeyword",
								text: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
								markerId: "b:introductionKeyword",
							},
							{
								score: 9,
								rating: "good",
								hasMarks: false,
								marker: [],
								id: "keyphraseLength",
								text: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
								markerId: "b:keyphraseLength",
							},
						],
						considerationsResults: [],
					},
					score: 47,
				},
			},
		};
	},
	runResearch: async ( { contentType, data } ) => {
		console.warn( "you are trying to run a research with this data:", contentType, data );
		// Dummy promise delay
		await new Promise( resolve => setTimeout( resolve, 2000 ) );
		return {
			status: 200,
			data: {
				keyphraseForms: [
					[ "Mock", "Mocks", "Mocking" ],
				],
				synonymsForms: [],
			},
		};
	},
};
