/* eslint-disable complexity */
import { ScoreWidget } from "../widgets/score-widget";
import { TopPagesWidget } from "../widgets/top-pages-widget";

/**
 * @type {import("../index").WidgetType} WidgetType
 * @type {import("../index").WidgetTypeInfo} WidgetTypeInfo
 */

/**
 * Controls how to create a widget.
 */
export class WidgetFactory {
	#dataProvider;
	#remoteDataProvider;

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 */
	constructor( dataProvider, remoteDataProvider ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
	}

	/**
	 * @returns {WidgetTypeInfo[]}
	 */
	static get widgetTypes() {
		return [
			{ type: "seoScores" },
			{ type: "readabilityScores" },
			{ type: "topPages" },
		];
	}

	/**
	 * @param {WidgetInstance} widget The widget to create.
	 * @param {function} onRemove The remove handler.
	 * @returns {JSX.Element|null} The widget or null.
	 */
	// eslint-disable-next-line no-unused-vars
	createWidget( widget, onRemove ) {
		switch ( widget.type ) {
			case "seoScores":
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "seoAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget key={ widget.id } analysisType="seo" dataProvider={ this.#dataProvider } remoteDataProvider={ this.#remoteDataProvider } />;
			case "readabilityScores":
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "readabilityAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget key={ widget.id } analysisType="readability" dataProvider={ this.#dataProvider } remoteDataProvider={ this.#remoteDataProvider } />;
			case "topPages":
				return <TopPagesWidget key={ widget.id } dataProvider={ this.#dataProvider } remoteDataProvider={ this.#remoteDataProvider } />;
			default:
				return null;
		}
	}
}
