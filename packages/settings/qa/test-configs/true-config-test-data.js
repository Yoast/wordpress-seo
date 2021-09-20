import { exampleContentTypesConfig, exampleSaveFunction } from "../example-config";

const trueConfigTestData = {
	options: {
		contentTypes: exampleContentTypesConfig,
		integrations: {
			semRush: true,
			ryte: true,
			zapier: true,
			zapierApiKey: "123456789",
			webmasterVerification: {
				pinterest: true,
				google: true,
				bing: true,
				yandex: true,
				baidu: true,
				pinterestLink: "https://www.pinterest.com/settings/claim/",
				googleLink: "https://www.google.com/webmasters/verification/verification?hl=en&tid=alternate&siteUrl=",
				bingLink: "https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=",
				yandexLink: "https://webmaster.yandex.com/sites/add",
				baiduLink: "https://ziyuan.baidu.com/login/index?u=/site/siteadd",
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
		siteDefaults: {
			siteTitleValue: "My site title",
			siteTitleLink: "/site-title/edit",
			tagLine: true,
			tagLineValue: "You're it!",
			tagLineLink: "/tag/edit",
		},
		advancedSettings: {
			notFoundPages: {
				isEnabled: true,
			},
			searchPages: {
				isEnabled: true,
				learnMoreLink: "https://example.com/learn-more",
			},
			rss: {
				contentBeforePost: true,
				contentAfterPost: true,
			},
		},
	},
	data: {
		contentTypes: {
			pages: {
				showSingleInSearchResults: true,
				showArchiveInSearchResults: true,
				showSEOSettings: true,
				schema: {
					pageType: "WebPage",
					articleType: "NewsArticle",
				},
				templates: {
					seo: {
						single: {
							title: "title single seo pages test",
							description: "description single seo pages test",
						},
						archive: {
							title: "title archive seo pages test",
							description: "description archive seo pages test",
						},
					},
					social: {
						single: {
							title: "title single social pages test",
							description: "description single social pages test",
							image: {
								url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg",
							},
						},
						archive: {
							title: "title archive social pages test",
							description: "description archive social pages test",
							image: {
								url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg",
							},
						},
					},
				},
				breadcrumbsTitle: "test breadcrumbs title first content type",
				slug: "pages",
			},
			locations: {
				showSingleInSearchResults: true,
				showArchiveInSearchResults: true,
				showSEOSettings: true,
				// Will be ignored due to the automatic schema.
				schema: {
					pageType: "WebPage",
					articleType: "NewsArticle",
				},
				templates: {
					seo: {
						single: {
							title: "title single seo locations test",
							description: "description single seo locations test",
						},
						archive: {
							title: "title archive seo locations test",
							description: "description archive seo locations test",
						},
					},
					social: {
						single: {
							title: "title single social locations test",
							description: "description single social locations test",
							image: {
								url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg",
							},
						},
						archive: {
							title: "title archive social locations test",
							description: "description archive social locations test",
							image: {
								url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg",
							},
						},
					},
				},
				breadcrumbsTitle: "test breadcrumbs title second content type",
				slug: "locations",
			},
		},
		integrations: {
			semRush: true,
			ryte: true,
			zapier: true,
			webmasterVerification: {
				pinterest: "pinterest-test.nl",
				google: "google-test.nl",
				bing: "bing-test.nl",
				yandex: "yandex-test.nl",
				baidu: "baidu-test.nl",
			},
		},
		schema: {
			siteRepresentation: {
				organizationOrPerson: "organization",
				organizationName: "test organization",
				organizationLogo: { url: "https://organization-logo.jpg/" },
				personName: "John Doe",
				personAvatar: { url: "https://person-avatar.jpg/" },
			},
			socialProfiles: {
				facebookPageUrl: "https://facebook-test.nl",
				twitterProfileUrl: "https://twitter-test.nl",
				instagramUrl: "https://instagram-test.nl",
				other: [
					"https://other-test.nl",
				],
			},
		},
		siteSettings: {
			siteDefaults: {
				separator: "*",
				siteImage: { url: "https://yoast.com/app/themes/yoast-theme/images/logo.svg" },
			},
		},
		advancedSettings: {
			notFoundPages: { title: "not found title" },
			searchPages: { title: "searchpage test title" },
			rss: {
				contentBeforePost: "rss content before post test",
				// translators: %s is replaced with the %%POSTLINK%% variable, %s is replaced with the %%BLOGLINK%% variable.
				contentAfterPost: "rss content after post test",
			},
		},
	},
	imagePicker: jest.fn( ( { successCallback } ) => {
		successCallback( { url: "new-image.url" } );
	} ),
	handleSave: exampleSaveFunction,
};

export default trueConfigTestData;
