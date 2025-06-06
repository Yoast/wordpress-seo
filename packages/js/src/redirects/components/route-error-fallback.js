import { useCallback } from "@wordpress/element";
import { Paper } from "@yoast/ui-library";
import { useRouteError } from "react-router-dom";
import { ErrorFallback } from "../../shared-admin/components";
import { useSelectRedirects } from "../hooks";

/**
 * Displays a fallback UI for route-level errors using React Router.
 * Includes error details, a refresh button, and a support link.
 *
 * @returns {JSX.Element} The element.
 */
export const RouteErrorFallback = () => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelectRedirects( "selectLink", [], "https://yoa.st/general-error-support" );
	const error = useRouteError();

	return (
		<Paper>
			<ErrorFallback error={ error }>
				<ErrorFallback.HorizontalButtons handleRefreshClick={ handleRefreshClick } supportLink={ supportLink } />
			</ErrorFallback>
		</Paper>
	);
};
