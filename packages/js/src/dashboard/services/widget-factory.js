/* eslint-disable complexity */
import { noop } from "lodash";
import { ScoreWidget } from "../widgets/score-widget";
import { SiteKitSetupWidget } from "../widgets/site-kit-setup-widget";
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
	#dataFormatter;

	/**
	 * @param {import("./data-provider").DataProvider} dataProvider
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider
	 * @param {import("./data-formatter").DataFormatter} dataFormatter
	 */
	constructor( dataProvider, remoteDataProvider, dataFormatter ) {
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
		this.#dataFormatter = dataFormatter;
	}

	/**
	 * @returns {WidgetTypeInfo[]}
	 */
	static get widgetTypes() {
		return [
			{ type: "seoScores" },
			{ type: "readabilityScores" },
			{ type: "topPages" },
			{ type: "siteKitSetup" },
		];
	}

	/**
	 * @param {WidgetInstance} widget The widget to create.
	 * @param {function} onRemove The remove handler.
	 * @returns {JSX.Element|null} The widget or null.
	 */
	createWidget( widget, onRemove ) {
		switch ( widget.type ) {
			case "seoScores":
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "seoAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widget.id }
					analysisType="seo"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case "readabilityScores":
				if ( ! ( this.#dataProvider.hasFeature( "indexables" ) && this.#dataProvider.hasFeature( "readabilityAnalysis" ) ) ) {
					return null;
				}
				return <ScoreWidget
					key={ widget.id }
					analysisType="readability"
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
				/>;
			case "topPages":
				return <TopPagesWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatter }
				/>;
			case "siteKitSetup":
				// This check here makes sure we don't render the setup anymore if the user connected and then switches away from the dashboard.
				// Then switches back to the dashboard, but does not refresh.
				if ( this.#dataProvider.getSiteKitConfiguration().isConnected ) {
					return null;
				}
				return <SiteKitSetupWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					onRemove={ onRemove }
				/>;
			default:
				return null;
		}
	}
}
