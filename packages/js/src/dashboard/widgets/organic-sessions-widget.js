import { __ } from "@wordpress/i18n";
import { OrganicSessionsChange, useOrganicSessionsChange } from "./organic-sessions/change";
import { OrganicSessionsDaily, useOrganicSessionsDaily } from "./organic-sessions/daily";
import { Widget } from "./widget";
import { ErrorAlert } from "../components/error-alert";
import { isEqual } from "lodash";


/**
 * @type {import("../services/data-provider")} DataProvider
 * @type {import("../services/remote-data-provider")} RemoteDataProvider
 * @type {import("../services/data-formatter")} DataFormatter
 */

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatter} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	const supportLink = dataProvider.getLink( "errorSupport" );
	const daily = useOrganicSessionsDaily( dataProvider, remoteDataProvider, dataFormatter );
	const change = useOrganicSessionsChange( dataProvider, remoteDataProvider, dataFormatter );
	const widgetProps = {
		className: "yst-paper__content yst-col-span-4",
		title: __( "Organic Sessions", "wordpress-seo" ),
		tooltip: __( "The number of organic sessions on your website.", "wordpress-seo" ),
		tooltipLearnMoreLink: dataProvider.getLink( "organicSessionsInfoLearnMore" ),
	};

	if ( change.error && daily.error && isEqual( change.error, daily.error ) ) {
		return <Widget { ...widgetProps }>
			<ErrorAlert error={ change.error } className="yst-mt-4" supportLink={ supportLink } />
		</Widget>;
	}

	return (
		<Widget { ...widgetProps }>
			<div className="yst-flex yst-justify-between yst-mt-4">
				<OrganicSessionsChange data={ change.data } error={ change.error } isPending={ change.isPending } supportLink={ supportLink } />
			</div>
			<OrganicSessionsDaily data={ daily.data } error={ daily.error } isPending={ daily.isPending } supportLink={ supportLink } />
		</Widget>
	);
};
