import { exampleSaveFunction } from "../example-config";

const trueConfigEmptyData = {
	options: {
		contentTypes: {
			singleAndArchive: {
				slug: "singleAndArchive",
				label: "singleAndArchive",
				hasSinglePage: true,
				hasArchive: true,
				hasCustomFields: true,
				hasSchemaArticleTypes: true,
				hasSchemaPageTypes: true,
				hasAutomaticSchemaTypes: false,
				hasBreadcrumbs: true,
				hasSocialAppearance: true,
				showSEOSettings: true,
				priority: 90,
			},
		},
		integrations: {
			semRush: true,
			ryte: true,
			zapier: true,
			webmasterVerification: {
				pinterest: true,
				google: true,
				bing: true,
				yandex: true,
				baidu: true,
			},
		},
		schema: {
			siteRepresentation: true,
			hasPersonRepresentation: true,
			users: [
				{ id: 1, value: "John Doe", label: "John Doe", profileEditLink: "http://example.com/john" },
				{ id: 2, value: "Roger Federer", label: "Roger Federer", profileEditLink: "http://example.com/roger" },
			],
			socialProfiles: true,
			organizationInfoIsMissingLink: "https://yoa.st/missing",
		},
		advancedSettings: {
			notFoundPages: {
				isEnabled: true,
			},
			searchPages: {
				isEnabled: true,
			},
			rss: {
				contentBeforePost: true,
				contentAfterPost: true,
			},
		},
		siteDefaults: {
			tagLine: true,
		},
	},
	data: {},
	imagePicker: jest.fn( ( { successCallback } ) => {
		successCallback( { url: "new-image.url" } );
	} ),
	handleSave: exampleSaveFunction,
};

export default trueConfigEmptyData;
