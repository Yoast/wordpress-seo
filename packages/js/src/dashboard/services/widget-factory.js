/* eslint-disable complexity */
import { OrganicSessionsWidget } from "../widgets/organic-sessions-widget";
import { ScoreWidget } from "../widgets/score-widget";
import { SiteKitSetupWidget } from "../widgets/site-kit-setup-widget";
import { TopPagesWidget } from "../widgets/top-pages-widget";
import { TopQueriesWidget } from "../widgets/top-queries-widget";
import { SearchRankingCompareWidget } from "../widgets/search-ranking-compare-widget";

/**
 * @type {import("../index").WidgetType} WidgetType
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
	static get types() {
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
	 * @param {WidgetInstance} widget The widget to create.
	 * @returns {JSX.Element|null} The widget or null.
	 */
	createWidget( widget ) {
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

		switch ( widget.type ) {
			case WidgetFactory.types.seoScores:
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "seoAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widget.id }
					analysisType="seo"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case WidgetFactory.types.readabilityScores:
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "readabilityAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widget.id }
					analysisType="readability"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case WidgetFactory.types.topPages:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopPagesWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case WidgetFactory.types.siteKitSetup:
				if ( ! isFeatureEnabled || isSetupWidgetDismissed ) {
					return null;
				}
				return <SiteKitSetupWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataTracker={ this.#dataTracker }
				/>;
			case WidgetFactory.types.topQueries:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <TopQueriesWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case WidgetFactory.types.searchRankingCompare:
				if ( ! isSearchConsoleWidgetAllowed ) {
					return null;
				}
				return <SearchRankingCompareWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			case WidgetFactory.types.organicSessions:
				if ( ! isAnalyticsWidgetAllowed ) {
					return null;
				}
				return <OrganicSessionsWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			default:
				return null;
		}
	}
}
