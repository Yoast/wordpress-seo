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
	#remoteCachedDataProviders;
	#dataFormatters;
	#dataTrackers;

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 * @param {Object<WidgetType,import("./remote-cached-data-provider").RemoteCachedDataProvider>} remoteCachedDataProviders
	 * @param {Object} dataFormatters
	 * @param {Object} dataTrackers
	 */
	constructor( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
		this.#remoteCachedDataProviders = remoteCachedDataProviders;
		this.#dataFormatters = dataFormatters;
		this.#dataTrackers = dataTrackers;
	}

	/**
	 * @param {WidgetType} widgetType The widget type.
	 * @returns {import("./remote-data-provider").RemoteDataProvider} The remote data provider for that widget type.
	 */
	getRemoteDataProvider( widgetType ) {
		return this.#remoteCachedDataProviders[ widgetType ] ?? this.#remoteDataProvider;
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
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
				/>;
			case this.types.readabilityScores:
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "readabilityAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widgetType }
					analysisType="readability"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
				/>;
			case this.types.topPages:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopPagesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.siteKitSetup:
				if ( ! isFeatureEnabled || isSetupWidgetDismissed ) {
					return null;
				}
				return <SiteKitSetupWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
					dataTracker={ this.#dataTrackers.setupWidgetDataTracker }
				/>;
			case this.types.topQueries:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopQueriesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.searchRankingCompare:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <SearchRankingCompareWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			case this.types.organicSessions:
				if ( ! isAnalyticsWidgetAllowed ) {
					return null;
				}
				return <OrganicSessionsWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.getRemoteDataProvider( widgetType ) }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			default:
				return null;
		}
	}
}
