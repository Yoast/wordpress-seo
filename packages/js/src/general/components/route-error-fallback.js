import { useCallback } from "@wordpress/element";
import { Paper } from "@yoast/ui-library";
import { useRouteError } from "react-router-dom";
import { ErrorFallback } from "../../shared-admin/components";
import { useSelectGeneralPage } from "../hooks";

/**
 * @param {Object} props Component props.
 * @param {string} [props.className=""] The class name.
 *
 * @returns {React.ReactNode} The element.
 */
export const RouteErrorFallback = ( { className = "" } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelectGeneralPage( "selectLink", [], "https://yoa.st/general-error-support" );
	const error = useRouteError();

	return (
		<Paper className={ className }>
			<ErrorFallback error={ error }>
				<ErrorFallback.HorizontalButtons handleRefreshClick={ handleRefreshClick } supportLink={ supportLink } />
			</ErrorFallback>
		</Paper>
	);
};
