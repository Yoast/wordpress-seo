import { AdjustmentsIcon, DatabaseIcon, DesktopComputerIcon, ExclamationCircleIcon, HomeIcon, NewspaperIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { getValidContentTypes } from "@yoast/admin-ui-toolkit/helpers";
import { forEach, get, merge } from "lodash";
import ContentTypePage from "../components/pages/content-type";
import Dashboard from "../components/pages/dashboard";
import Integrations from "../components/pages/integrations";
import NotFound from "../components/pages/not-found";
import RSS from "../components/pages/rss";
import SchemaOutput from "../components/pages/schema-output";
import SearchPages from "../components/pages/search-pages";
import SiteDefaults from "../components/pages/site-defaults";
import SiteRepresentation from "../components/pages/site-representation";
import WebmasterTools from "../components/pages/webmaster-tools";

/**
 * Gets the groups configuration.
 * In a function to have access to the translation context.
 * @returns {Object} The groups configuration.
 */
const getGroupsConfig = () => ( {
	home: {
		key: "home",
		label: __( "Home", "admin-ui" ),
		icon: HomeIcon,
		isDefaultOpen: true,
		priority: 90,
		children: [
			{
				key: "dashboard",
				label: __( "Dashboard", "admin-ui" ),
				target: "dashboard",
				priority: 50,
				groupKey: "home",
				component: Dashboard,
			},
		],
	},
	schema: {
		key: "schema",
		label: __( "Schema", "admin-ui" ),
		icon: DatabaseIcon,
		isDefaultOpen: true,
		priority: 80,
		children: [
			{
				key: "schema-output",
				label: __( "Schema output", "admin-ui" ),
				target: "schema-output",
				priority: 40,
				groupKey: "schema",
				component: SchemaOutput,
			},
		],
	},
	siteSettings: {
		key: "siteSettings",
		label: __( "Site settings", "admin-ui" ),
		icon: DesktopComputerIcon,
		isDefaultOpen: true,
		priority: 70,
		children: [
			{
				// The Site defaults page is always shown.
				key: "site-defaults",
				label: __( "Site defaults", "admin-ui" ),
				target: "site-defaults",
				priority: 60,
				groupKey: "siteSettings",
				component: SiteDefaults,
			},
		],
	},
	contentTypes: {
		key: "contentTypes",
		label: __( "Content types", "admin-ui" ),
		icon: NewspaperIcon,
		isDefaultOpen: false,
		priority: 60,
		children: [],
	},
	advancedSettings: {
		key: "advancedSettings",
		label: __( "Advanced settings", "admin-ui" ),
		icon: AdjustmentsIcon,
		isDefaultOpen: false,
		priority: 50,
		children: [],
	},
} );

/**
 * Gets the pages configuration.
 * In a function to have access to the translation context.
 * @returns {Object} The pages configuration.
 */
const getPagesConfig = () => ( {
	siteRepresentation: {
		key: "site-representation",
		label: __( "Site representation", "admin-ui" ),
		target: "site-representation",
		priority: 50,
		groupKey: "schema",
		component: SiteRepresentation,
		optionPaths: [
			"schema.siteRepresentation",
		],
	},
	webmasterTools: {
		key: "webmaster-tools",
		label: __( "Webmaster tools", "admin-ui" ),
		target: "webmaster-tools",
		priority: 40,
		groupKey: "siteSettings",
		component: WebmasterTools,
		optionPaths: [
			"integrations.webmasterVerification.pinterest",
			"integrations.webmasterVerification.google",
			"integrations.webmasterVerification.bing",
			"integrations.webmasterVerification.yandex",
			"integrations.webmasterVerification.baidu",
		],
	},
	integrations: {
		key: "integrations",
		label: __( "Integrations", "admin-ui" ),
		target: "integrations",
		priority: 30,
		groupKey: "siteSettings",
		component: Integrations,
		optionPaths: [
			"integrations.semRush",
			"integrations.ryte",
			"integrations.zapier",
		],
	},
	searchPages: {
		key: "search-pages",
		label: __( "Search pages", "admin-ui" ),
		target: "search-pages",
		priority: 60,
		groupKey: "advancedSettings",
		component: SearchPages,
		optionPaths: [
			"advancedSettings.searchPages.isEnabled",
		],
	},
	notFoundPages: {
		key: "not-found-pages",
		label: __( "404 pages", "admin-ui" ),
		target: "not-found",
		priority: 50,
		groupKey: "advancedSettings",
		component: NotFound,
		optionPaths: [
			"advancedSettings.notFoundPages.isEnabled",
		],
	},
	rss: {
		key: "rss",
		label: __( "RSS", "admin-ui" ),
		target: "rss",
		priority: 20,
		groupKey: "advancedSettings",
		component: RSS,
		optionPaths: [
			"advancedSettings.rss.contentBeforePost",
			"advancedSettings.rss.contentAfterPost",
		],
	},
} );

/**
 * As a safety, adds placeholders to the incoming custom navgroups.
 *
 * @param {Object} navGroup The navGroup to add placeholders to.
 *
 * @returns {Object} The navgroup, enriched with placeholder icons and components.
 */
function addPlaceholderIconsAndComponents( navGroup ) {
	if ( ! navGroup.icon ) {
		navGroup.icon = ExclamationCircleIcon;
	}

	navGroup.children.forEach( ( child ) => {
		if ( typeof child.component !== "function" ) {
			child.component = () => "Oops! You have not provided a component to render at this target.";
		}
	} );

	return navGroup;
}

/**
 * Whether the content type has at least a single or archive page.
 *
 * @param {Object} contentTypeOptions The options for this content type.
 *
 * @returns {Boolean} True when this content type has at least single or archive pages.
 */
function hasAtLeastSingleOrArchive( contentTypeOptions ) {
	return contentTypeOptions.hasSinglePage || contentTypeOptions.hasArchive;
}

/**
 *
 * @param {ContentTypeOptions[]} contentTypesOptions Array of content type options from config.
 * @returns {Array} Content type navigation.
 */
function createContentTypesNavigation( contentTypesOptions ) {
	const childrenArray = [];
	forEach( getValidContentTypes( contentTypesOptions ), ( contentTypeOptions, contentTypeKey ) => {
		// Only add if there is at least a single or archive for this content type.
		if ( hasAtLeastSingleOrArchive( contentTypeOptions ) ) {
			childrenArray.push(
				{
					key: contentTypeOptions.slug,
					target: contentTypeOptions.slug,
					label: contentTypeOptions.label,
					priority: contentTypeOptions.priority || 50,
					component: ContentTypePage,
					props: {
						options: contentTypeOptions,
						contentTypeKey,
					},
				},
			);
		}
	} );

	return childrenArray;
}

/**
 * Generates an initial navigation object.
 *
 * @param {Object} options The options object from the config.
 *
 * @returns {Object} The initial navigation object.
 */
function createInitialNavigation( options ) {
	// Deep copy the groupsConfig to avoid reference errors.
	const initialNavigation = merge( {}, getGroupsConfig() );

	// Only add pages for which at least one of the options at the optionPaths return true
	forEach( getPagesConfig(), ( pageConfig ) => {
		if (
			pageConfig.optionPaths.some(
				optionPath => get( options, optionPath, false ),
			)
		) {
			initialNavigation[ pageConfig.groupKey ].children.push( pageConfig );
		}
	} );

	// Push the contentTypes.
	initialNavigation.contentTypes.children = createContentTypesNavigation( options.contentTypes );

	return initialNavigation;
}

/**
 * Creates the initial navigation object.
 *
 * @param {Object} customNavigation                   The navigation passed from the config.
 * @param {Object} options                            The options object from the config.
 * @param {ContentTypeOptions[]} options.contentTypes Array of content type options from config.
 *
 * @returns {void}
 */
export default function initializeNavigation( customNavigation, options ) {
	const initialNavigation = createInitialNavigation( options );

	// Merge the custom config with our initial config.
	const mergedNavigation = merge( {}, initialNavigation, customNavigation );

	// Find navgroups without icons and navgroup children without components.
	return forEach( mergedNavigation, addPlaceholderIconsAndComponents );
}
