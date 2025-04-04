/* eslint-disable complexity */
import { SiteKitSetupWidget } from "../widgets/site-kit-setup-widget";
import {
	TopPagesWidget,
	TopQueriesWidget,
	SearchRankingCompareWidget,
	ScoreWidget,
	OrganicSessionsWidget } from "@yoast/dashboard-frontend";

/**
 * @type {import("../index").WidgetType} The widget type.
 */

/**
 * Controls how to create a widget.
 */
export class WidgetFactory {
	#dataProvider;
	#remoteDataProvider;
	#dataFormatters;
	#dataTracker;

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 * @param {object} dataFormatters
	 * @param {import("./data-tracker").DataTracker} dataTracker
	 */
	constructor( dataProvider, remoteDataProvider, dataFormatters, dataTracker ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
		this.#dataFormatters = dataFormatters;
		this.#dataTracker = dataTracker;
	}

	/**
	 * The widget types, also determines the order in which they are displayed.!
	 *
	 * @returns {Object} The widget types.
	 */
	get types() {
		return {
			siteKitSetup: "siteKitSetup",
			searchRankingCompare: "searchRankingCompare",
			organicSessions: "organicSessions",
			topPages: "topPages",
			topQueries: "topQueries",
			seoScores: "seoScores",
			readabilityScores: "readabilityScores",
		};
	}

	/**
	 * @param {WidgetType} widgetType The widget type to create.
	 * @returns {JSX.Element|null} The widget or null.
	 */
	createWidget( widgetType ) {
		const {
			isFeatureEnabled,
			isSetupWidgetDismissed,
			isAnalyticsConnected,
			capabilities,
			isVersionSupported,
		} = this.#dataProvider.getSiteKitConfiguration();
		const isSiteKitConnectionCompleted = this.#dataProvider.isSiteKitConnectionCompleted();

		// Common checks for Site Kit widgets.
		const isSiteKitWidgetAllowed = isFeatureEnabled && isSiteKitConnectionCompleted && isVersionSupported;
		const isSearchConsoleWidgetAllowed = isSiteKitWidgetAllowed && capabilities.viewSearchConsoleData;
		const isAnalyticsWidgetAllowed = isSiteKitWidgetAllowed && isAnalyticsConnected && capabilities.viewAnalyticsData;

		switch ( widgetType ) {
			case this.types.seoScores:
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "seoAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widgetType }
					analysisType="seo"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case this.types.readabilityScores:
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "readabilityAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widgetType }
					analysisType="readability"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case this.types.topPages:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopPagesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.siteKitSetup:
				if ( ! isFeatureEnabled || isSetupWidgetDismissed ) {
					return null;
				}
				return <SiteKitSetupWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataTracker={ this.#dataTracker }
				/>;
			case this.types.topQueries:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopQueriesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.searchRankingCompare:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <SearchRankingCompareWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			case this.types.organicSessions:
				if ( ! isAnalyticsWidgetAllowed ) {
					return null;
				}
				return <OrganicSessionsWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			default:
				return null;
		}
	}
}
