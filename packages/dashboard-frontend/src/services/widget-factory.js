/* eslint-disable complexity */
import { OrganicSessionsWidget } from "../widgets/organic-sessions-widget";
import { ScoreWidget } from "../widgets/score-widget";
import { TopPagesWidget } from "../widgets/top-pages-widget";
import { TopQueriesWidget } from "../widgets/top-queries-widget";
import { SearchRankingCompareWidget } from "../widgets/search-ranking-compare-widget";

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

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 * @param {object<import("./remote-cached-data-provider").RemoteCachedDataProvider>} remoteCachedDataProviders
	 * @param {object} dataFormatters
	 */
	constructor( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
		this.#remoteCachedDataProviders = remoteCachedDataProviders;
		this.#dataFormatters = dataFormatters;
	}

	/**
	 * The widget types, also determines the order in which they are displayed.!
	 *
	 * @returns {Object} The widget types.
	 */
	get types() {
		return {
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
				return <TopPagesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteCachedDataProviders[ widgetType ] }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.topQueries:
				return <TopQueriesWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteCachedDataProviders[ widgetType ] }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case this.types.searchRankingCompare:
				return <SearchRankingCompareWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteCachedDataProviders[ widgetType ] }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			case this.types.organicSessions:
				return <OrganicSessionsWidget
					key={ widgetType }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteCachedDataProviders[ widgetType ] }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			default:
				return null;
		}
	}
}
