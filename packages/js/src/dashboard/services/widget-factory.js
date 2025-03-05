/* eslint-disable complexity */
import { OrganicSessionsWidget } from "../widgets/organic-sessions-widget";
import { ScoreWidget } from "../widgets/score-widget";
import { SiteKitSetupWidget } from "../widgets/site-kit-setup-widget";
import { TopPagesWidget } from "../widgets/top-pages-widget";
import { TopQueriesWidget } from "../widgets/top-queries-widget";
import { OrganicSessionsCompareWidget } from "../widgets/organic-sessions-compare-widget";

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

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 * @param {object} dataFormatters
	 */
	constructor( dataProvider, remoteDataProvider, dataFormatters ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
		this.#dataFormatters = dataFormatters;
	}

	/**
	 * The widget types, also determines the order in which they are displayed.!
	 *
	 * @returns {Object} The widget types.
	 */
	static get types() {
		return {
			siteKitSetup: "siteKitSetup",
			organicSessions: "organicSessions",
			organicSessionsCompare: "organicSessionsCompare",
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
		const { isFeatureEnabled, isSetupWidgetDismissed, isAnalyticsConnected } = this.#dataProvider.getSiteKitConfiguration();
		const isSiteKitConnectionCompleted = this.#dataProvider.isSiteKitConnectionCompleted();
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
				if ( ! isFeatureEnabled || ! isSiteKitConnectionCompleted ) {
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
				/>;
			case WidgetFactory.types.topQueries:
				if ( ! isFeatureEnabled || ! isSiteKitConnectionCompleted ) {
					return null;
				}
				return <TopQueriesWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.plainMetricsDataFormatter }
				/>;
			case WidgetFactory.types.organicSessionsCompare:
				if ( ! isFeatureEnabled || ! isConnected ) {
					return null;
				}
				return <OrganicSessionsCompareWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.comparisonMetricsDataFormatter }
				/>;
			case WidgetFactory.types.organicSessions:
				if ( ! isFeatureEnabled || ! isSiteKitConnectionCompleted || ! isAnalyticsConnected ) {
					return null;
				}
				return <OrganicSessionsWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatters.icsaDataFormatter }
				/>;
			default:
				return null;
		}
	}
}
