/* eslint-disable complexity */
import { ScoreWidget } from "../widgets/score-widget";
import { SiteKitSetupWidget } from "../widgets/site-kit-setup-widget";
import { TopPagesWidget } from "../widgets/top-pages-widget";

/**
 * @type {import("../index").WidgetType} WidgetType
 * @type {import("../index").WidgetTypes} WidgetTypes
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
	 * @returns {WidgetTypes} The widget types.
	 */
	static get types() {
		return {
			seoScores: "seoScores",
			readabilityScores: "readabilityScores",
			topPages: "topPages",
			siteKitSetup: "siteKitSetup",
		};
	}

	/**
	 * @param {WidgetInstance} widget The widget to create.
	 * @param {function} onRemove The remove handler.
	 * @param {function} onAdd The add handler.
	 * @returns {JSX.Element|null} The widget or null.
	 */
	createWidget( widget, onRemove, onAdd ) {
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
				return <TopPagesWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					dataFormatter={ this.#dataFormatter }
				/>;
			case WidgetFactory.types.siteKitSetup:
				// This check here makes sure we don't render the setup anymore if the user connected and then switches away from the dashboard.
				// Then switches back to the dashboard, but does not refresh.
				if ( this.#dataProvider.getSiteKitConfiguration().isConnected ||
				this.#dataProvider.getSiteKitConfiguration().isConfigurationDismissed ) {
					return null;
				}
				return <SiteKitSetupWidget
					key={ widget.id }
					dataProvider={ this.#dataProvider }
					remoteDataProvider={ this.#remoteDataProvider }
					removeWidget={ onRemove }
					addWidget={ onAdd }
					siteKitWidgets={ [ widget.type, WidgetFactory.types.topPages ] }
				/>;
			default:
				return null;
		}
	}
}
