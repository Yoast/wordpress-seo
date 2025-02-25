import { __ } from "@wordpress/i18n";
import { OrganicSessionsChange, useOrganicSessionsChange } from "./organic-sessions/change";
import { OrganicSessionsDaily, useOrganicSessionsDaily } from "./organic-sessions/daily";
import { Widget, WidgetTooltip } from "./widget";

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
	const infoLink = dataProvider.getLink( "organicSessionsInfoLearnMore" );
	const daily = useOrganicSessionsDaily( dataProvider, remoteDataProvider, dataFormatter );
	const change = useOrganicSessionsChange( dataProvider, remoteDataProvider, dataFormatter );

	return (
		<Widget className="yst-paper__content yst-col-span-4">
			<div className="yst-flex yst-justify-between yst-mb-2">
				<OrganicSessionsChange data={ change.data } error={ change.error } isPending={ change.isPending } />
				<WidgetTooltip learnMoreLink={ infoLink }>
					{ __( "The number of organic sessions on your website.", "wordpress-seo" ) }
				</WidgetTooltip>
			</div>
			<OrganicSessionsDaily data={ daily.data } error={ daily.error } isPending={ daily.isPending } />
		</Widget>
	);
};
