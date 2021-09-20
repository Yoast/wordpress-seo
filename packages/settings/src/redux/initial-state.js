import { __, sprintf } from "@wordpress/i18n";
import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { createInitialImageState, getValidContentTypes, withId } from "@yoast/admin-ui-toolkit/helpers";
import { forEach, merge, omit } from "lodash";

export const defaultInitialState = {
	notifications: [],
	options: {
		dashboard: {
			cmsName: "",
			info: false,
			themeModifications: false,
			themeModificationsActive: false,
		},
		contentTypes: {},
		integrations: {
			semRush: false,
			ryte: false,
			zapier: false,
			zapierApiKey: "",
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
			users: [],
			socialProfiles: true,
			organizationInfoIsMissingLink: "",
			knowledgeGraphInfoLink: "",
		},
		advancedSettings: {
			notFoundPages: {
				isEnabled: true,
				supportedVariables: [],
			},
			searchPages: {
				isEnabled: true,
				supportedVariables: [],
			},
			rss: {
				contentBeforePost: true,
				contentAfterPost: true,
			},
		},
		siteDefaults: {
			tagLine: false,
			siteTitleValue: "",
			siteTitleLink: "",
		},
	},
	data: {
		contentTypes: {},
		integrations: {
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
				organizationLogo: createInitialImageState(),
				personName: "",
				personAvatar: "",
			},
			socialProfiles: {
				facebookPageUrl: "",
				twitterProfileUrl: "",
				instagramUrl: "",
				other: [],
			},
			outputControls: {
				schema: true,
				organization: true,
				website: true,
				webpage: true,
				product: true,
				article: true,
				breadcrumb: true,
			},
		},
		siteSettings: {
			siteDefaults: {
				separator: "-",
				siteImage: createInitialImageState(),
			},
		},
		advancedSettings: {
			notFoundPages: { title: "" },
			searchPages: { title: "" },
			rss: {
				contentBeforePost: "",
				// translators: %s is replaced with the %%POSTLINK%% variable, %s is replaced with the %%BLOGLINK%% variable.
				contentAfterPost: sprintf( __( "The post %s appeared first on %s.", "admin-ui" ), "%%POSTLINK%%", "%%BLOGLINK%%" ),
			},
		},
	},
	save: {
		status: ASYNC_STATUS.idle,
		errors: {},
	},
	themeModifications: {
		apply: ASYNC_STATUS.idle,
		remove: ASYNC_STATUS.idle,
	},
};

/**
 * Created an initial state for content type options.
 * @param {Object} contentTypeOptions Content type options to merge with defaults
 * @returns {Object} Initial content type options
 */
const createInitialContentTypeOptions = ( contentTypeOptions ) => merge(
	{},
	{
		hasSinglePage: true,
		hasArchive: false,
		hasBreadcrumbs: true,
		hasCustomFields: false,
		hasSchemaPageTypes: true,
		hasSchemaArticleTypes: true,
		hasAutomaticSchemaTypes: false,
		hasSocialAppearance: false,
		singleSupportedVariables: [],
		archiveSupportedVariables: [],
		defaults: {
			schema: {
				pageType: contentTypeOptions.hasSchemaPageTypes ? "WebPage" : "",
				articleType: contentTypeOptions.hasSchemaArticleTypes ? "Article" : "",
			},
		},
	},
	contentTypeOptions,
);


/**
 * Created an initial state for content type data.
 * @param {Object} contentTypeDataDefaults Content type data to merge with defaults
 * @returns {Object} Initial content type data
 */
const createInitialContentTypeData = ( contentTypeDataDefaults ) => merge(
	{},
	{
		showSingleInSearchResults: true,
		showArchiveInSearchResults: true,
		showSEOSettings: true,
		schema: {
			pageType: "",
			articleType: "",
		},
		templates: {
			seo: {
				single: {
					title: "",
					description: "",
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
					image: createInitialImageState(),
				},
				archive: {
					title: "",
					description: "",
					image: createInitialImageState(),
				},
			},
		},
		breadcrumbsTitle: "",
	},
	contentTypeDataDefaults,
);

/**
 * Creates an initial state for each supported content type.
 * @param {ContentType[]} contentTypesOptions Array of content type options
 * @returns {Object} Initial content type state
 */
const createInitialContentTypesState = ( contentTypesOptions ) => {
	const initialContentTypesState = {
		options: { contentTypes: {} },
		data: { contentTypes: {} },
	};

	forEach( contentTypesOptions, ( contentTypeOptions, key ) => {
		initialContentTypesState.options.contentTypes[ key ] = createInitialContentTypeOptions( contentTypeOptions );
		initialContentTypesState.data.contentTypes[ key ] = createInitialContentTypeData( contentTypeOptions.defaults );
	} );

	return initialContentTypesState;
};

/**
 * @param {Object} props The props object.
 * @param {Object} props.data Initial state for data.
 * @param {Object} props.options Initial state for options.
 * @param {Object[]} props.notifications Initial general messages.
 * @returns {Object} The initial state
 */
export const createInitialState = ( { data, options, notifications } ) => {
	const initialContentTypesState = createInitialContentTypesState( getValidContentTypes( options.contentTypes ) );
	const state = merge(
		{},
		defaultInitialState,
		initialContentTypesState,
		{
			notifications: notifications.map( withId ),
			data,
			options: omit( options, [ "contentTypes" ] ),
		},
	);

	// The initial data is the same as the saved data.
	state.savedData = merge( {}, state.data );

	return state;
};
