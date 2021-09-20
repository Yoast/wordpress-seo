import { exampleSaveFunction } from "../example-config";

const falseConfig = {
	options: {
		contentTypes: {
			archiveOnly: {
				slug: "archiveOnly",
				label: "Archive only",
				hasSinglePage: false,
				hasArchive: true,
				hasCustomFields: false,
				hasSchemaArticleTypes: false,
				hasSchemaPageTypes: false,
				hasAutomaticSchemaTypes: false,
				hasBreadcrumbs: false,
				hasSocialAppearance: false,
				priority: 90,
			},
			singleOnly: {
				slug: "singleOnly",
				label: "Single only",
				hasSinglePage: true,
				hasArchive: false,
				hasCustomFields: false,
				hasBreadcrumbs: false,
				hasSchemaPageTypes: false,
				hasSchemaArticleTypes: false,
				hasAutomaticSchemaTypes: false,
				hasSocialAppearance: false,
			},
		},
		integrations: {
			semRush: false,
			ryte: false,
			zapier: false,
			webmasterVerification: {
				pinterest: false,
				google: false,
				bing: false,
				yandex: false,
				baidu: false,
			},
		},
		advancedSettings: {
			notFoundPages: {
				isEnabled: false,
			},
			searchPages: {
				isEnabled: false,
			},
			rss: {
				contentBeforePost: false,
				contentAfterPost: false,
			},
		},
		schema: {
			siteRepresentation: false,
			hasPersonRepresentation: false,
			users: [
				{ id: 1, value: "John Doe", label: "John Doe", profileEditLink: "http://example.com/john" },
				{ id: 2, value: "Roger Federer", label: "Roger Federer", profileEditLink: "http://example.com/roger" },
			],
			socialProfiles: false,
			organizationInfoIsMissingLink: "https://yoa.st/missing",
		},
		siteDefaults: {
			tagLine: false,
		},
	},
	data: {
		contentTypes: {},
		integrations: {
			semRush: false,
			ryte: false,
			zapier: false,
			webmasterVerification: {
				pinterest: "",
				google: "",
				bing: "",
				yandex: "",
				baidu: "",
			},
		},
		schema: {
			siteRepresentation: {
				organizationOrPerson: "organization",
				organizationName: "",
				organizationLogo: "",
				personName: "",
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
				separator: "-",
				siteImage: "",
			},
		},
		advancedSettings: {
			notFoundPages: { title: "" },
			searchPages: { title: "" },
			rss: {
				contentBeforePost: "",
				// translators: %s is replaced with the %%POSTLINK%% variable, %s is replaced with the %%BLOGLINK%% variable.
				contentAfterPost: "",
			},
		},
	},
	imagePicker: jest.fn( ( { successCallback } ) => {
		successCallback( { url: "new-image.url" } );
	} ),
	handleSave: exampleSaveFunction,
};

export default falseConfig;
