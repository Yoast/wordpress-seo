import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * Temporary placeholder page until the bulk editor UI lands.
 *
 * @param {import("../services").DataProvider} dataProvider The data provider.
 *
 * @returns {JSX.Element} The placeholder page.
 */
export const PlaceholderPage = ( { dataProvider } ) => {
	const contentTypes = dataProvider.getContentTypes();

	return (
		<Paper className="yst-m-8 yst-p-8 yst-space-y-4">
			<Title>{ __( "Bulk editor", "wordpress-seo" ) }</Title>
			<ul className="yst-list-disc yst-list-inside">
				{ contentTypes.map( ( contentType ) => (
					<li key={ contentType.name }>{ contentType.label }</li>
				) ) }
			</ul>
		</Paper>
	);
};

PlaceholderPage.propTypes = {
	dataProvider: PropTypes.object.isRequired,
};
