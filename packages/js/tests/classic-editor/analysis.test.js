import { getAnalysisConfiguration } from "../../src/classic-editor/getAnalysisConfiguration";

/* eslint-disable camelcase */
jest.mock( "../../src/analysis/getTranslations", () => {
	return jest.fn( () => (
		{
			domain: "js-text-analysis",
			locale_data: {
				"js-text-analysis": {
					"": {},
				},
			},
		}
	) );
} );

jest.mock( "@yoast/feature-flag", () => (
	{
		enabledFeatures: jest.fn( () => (
			[ "SOME_LANGUAGE" ]
		) ),
	}
) );

jest.mock( "../../src/analysis/isKeywordAnalysisActive", () => {
	return jest.fn( () => true );
} );

jest.mock( "../../src/analysis/isContentAnalysisActive", () => {
	return jest.fn( () => false );
} );

describe( "The getAnalysisConfiguration function", () => {
	const translations = {
		domain: "js-text-analysis",
		locale_data: {
			"js-text-analysis": {
				"": {},
			},
		},
	};

	it( "returns a default configuration when the global script data is not available", () => {
		const actual = getAnalysisConfiguration();

		expect( actual.workerUrl ).toEqual( "analysis-worker.js" );
		expect( actual.dependencies ).toEqual( {} );
		expect( actual.configuration ).toEqual( {
			locale: "en_US",
			defaultQueryParams: {},
			logLevel: "ERROR",
			enabledFeatures: [ "SOME_LANGUAGE" ],
			translations,
			isReadabilityActive: false,
			isSeoActive: true,
		} );
	} );

	it( "returns configuration when global script data is available", () => {
		const dependencies = {
			"regenerator-runtime": "http://basic.wordpress.test/wp-includes/js/dist/vendor/regenerator-runtime.js?ver=0.13.7",
			"wp-polyfill": "http://basic.wordpress.test/wp-includes/js/dist/vendor/wp-polyfill.js?ver=3.15.0",
			lodash: "http://basic.wordpress.test/wp-includes/js/dist/vendor/lodash.js?ver=4.17.19",
			"wp-autop": "http://basic.wordpress.test/wp-includes/js/dist/autop.js?ver=0e55c6c10f6d8a4bd90b2ea903436301",
			"yoast-seo-feature-flag-package": "http://basic.wordpress.test/wp-content/" +
											  "plugins/wordpress-seo/js/dist/externals/featureFlag-175-RC1.js",
			"yoast-seo-jed-package": "http://basic.wordpress.test/wp-content/plugins/wordpress-seo/js/dist/externals/jed-175-RC1.js",
			"yoast-seo-analysis-package": "http://basic.wordpress.test/wp-content/" +
										  "plugins/wordpress-seo/js/dist/externals/analysis-175-RC1.js",
			"yoast-seo-en-language": "http://basic.wordpress.test/wp-content/plugins/wordpress-seo/js/dist/languages/en-175-RC1.js",
		};

		const defaultQueryArgs = {
			php_version: "7.4",
			platform: "wordpress",
			platform_version: "5.8.2",
			software: "free",
			software_version: "17.5-RC1",
			days_active: "6-30",
			user_language: "en_US",
		};

		self.wpseoAdminL10n = {
			default_query_params: defaultQueryArgs,
		};

		self.wpseoScriptData = {
			metabox: {
				contentLocale: "nl_NL",
			},
			analysis: {
				worker: {
					url: "some-analysis-worker.js",
					dependencies,
					log_level: "DEBUG",
				},
			},
		};

		const actual = getAnalysisConfiguration();

		expect( actual.workerUrl ).toEqual( "some-analysis-worker.js" );
		expect( actual.dependencies ).toEqual( dependencies );
		expect( actual.configuration ).toEqual( {
			locale: "nl_NL",
			defaultQueryParams: defaultQueryArgs,
			logLevel: "DEBUG",
			enabledFeatures: [ "SOME_LANGUAGE" ],
			translations,
			isReadabilityActive: false,
			isSeoActive: true,
		} );
	} );
} );
