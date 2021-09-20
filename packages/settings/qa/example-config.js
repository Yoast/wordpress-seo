import { mergeWithArrayReplace } from "@yoast/admin-ui-toolkit/helpers";
import { defaultInitialState as initialState } from "../src/redux/initial-state";

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
export const exampleImagePickerFunction = async ( { requestCallback, successCallback, errorCallback } ) => {
	requestCallback();
	// Mock async delay
	await new Promise( resolve => setTimeout( resolve, 1500 ) );

	// errorCallback( { message: "Something terrible has happened." } );
	successCallback( { id: "image-id", url: "https://fhm.nl/wp-content/uploads/2018/05/Bassie-Euro-Entertainment-375x270.jpg" } );
};
/* eslint-enable no-unused-vars */

/**
 * An example async save function.
 *
 * @param {Object} data The data object with to-be-saved data.
 *
 * @returns {Object} The mocked response from the server.
 */
export async function exampleSaveFunction( data ) {
	console.warn( "you are trying to save this data:", data );
	// Mock async delay
	await new Promise( resolve => setTimeout( resolve, 1500 ) );

	// Test success case
	return { status: 200 };

	// // Test error case
	// return {
	// 	status: 400,
	// 	errors: {
	// 		rss: {
	// 			contentBeforePost: [ "Please enter valid text to display before your RSS post." ],
	// 		},
	// 		contentTypes: {
	// 			0: {
	// 				schema: {
	// 					pageType: [ "Please enter a valid pageType." ],
	// 				},
	// 			},
	// 		},
	// 		schema: {
	// 			siteRepresentation: {
	// 				organizationOrPerson: [ "Please enter a valid organizationOrPerson." ],
	// 				organizationName: [ "Please enter a valid organizationName.", "An extra error on this field" ],
	// 				organizationLogo: [ "Please enter a valid organizationLogo." ],
	// 				personName: [ "Please enter a valid personName." ],
	// 				personAvatar: [ "Please enter a valid personAvatar." ],
	// 			},
	// 			socialProfiles: {
	// 				other: { 1: [ "Please enter a valid URL for your social profile." ] },
	// 			},
	// 		},
	// 	},
	// };
}

/**
 * An example async apply theme modifications function.
 *
 * @returns {Object} The mocked response from the server.
 */
async function exampleApplyThemeModificationsFunction() {
	console.warn( "you are trying to apply theme modifications" );
	await new Promise( resolve => setTimeout( resolve, 500 ) );

	return { status: 200 };
}

/**
 * An example async remove theme modifications function.
 *
 * @returns {Object} The mocked response from the server.
 */
async function exampleRemoveThemeModificationsFunction() {
	console.warn( "you are trying to remove theme modifications" );
	await new Promise( resolve => setTimeout( resolve, 500 ) );

	return { status: 200 };
}

export const exampleContentTypesConfig = {
	pages: {
		slug: "pages",
		label: "Pages",
		hasCustomFields: true,
		hasSchemaArticleTypes: true,
		priority: 90,
		customFieldsAnalysisInfoLink: "https://example.com/custom-fields-analysis-info",
		singleSupportedVariables: [ "sep", "title", "sitename" ],
		archiveSupportedVariables: [ "sitename", "focus_keyphrase", "sep" ],
		defaults: {
			schema: {
				pageType: "WebPage",
				articleType: "Article",
			},
		},
	},
	locations: {
		slug: "locations",
		label: "Locations",
		hasArchive: true,
		hasCustomFields: true,
		hasBreadcrumbs: true,
		singleSupportedVariables: [ "sep", "title", "sitename" ],
		archiveSupportedVariables: [ "testeroni", "sitename", "focus_keyphrase", "sep" ],
		hasAutomaticSchemaTypes: true,
		contentTypeSchemaInfoLink: "https://example.com/schema-info",
		defaults: {
			schema: {
				pageType: "ItemPage",
			},
		},
	},
};

const exampleConfig = mergeWithArrayReplace(
	{},
	initialState,
	{
		notifications: [
			{
				type: "success",
				title: "Something has gone right!",
				description: "Something appears to have gone right.",
			},
		],
		navigation: {},
		imagePicker: exampleImagePickerFunction,
		handleSave: exampleSaveFunction,
		applyThemeModifications: exampleApplyThemeModificationsFunction,
		removeThemeModifications: exampleRemoveThemeModificationsFunction,
		data: {
			schema: {
				siteRepresentation: {
					personName: "John Doe",
				},
			},
			integrations: {
				semRush: true,
				ryte: true,
				zapier: false,
			},
		},
		options: {
			dashboard: {
				cmsName: "WordPress",
				info: true,
				themeModifications: true,
				themeModificationsActive: false,
				themeModificationsInfoLink: "https://yoast.com",
			},
			integrations: {
				semRush: true,
				ryte: true,
				zapier: true,
				zapierApiKey: "1234_zapierApiKey",
			},
			siteDefaults: {
				siteTitleValue: "Beautiful site",
				siteTitleLink: "/admin/settings/general",
			},
			schema: {
				users: [
					{ id: 1, value: "John Doe", label: "John Doe", profileEditLink: "http://example.com/john" },
					{ id: 2, value: "Roger Federer", label: "Roger Federer", profileEditLink: "http://example.com/roger" },
				],
				organizationInfoIsMissingLink: "https://example.com/organization-info",
				knowledgeGraphInfoLink: "https://example.com/knowledge-graph-info",
			},
			contentTypes: exampleContentTypesConfig,
		},
	},
);

export default exampleConfig;
