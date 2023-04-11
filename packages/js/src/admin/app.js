import { Fill, Slot } from "@wordpress/components";
import { ErrorBoundary } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Route, Routes } from "react-router-dom";
import { RouteErrorFallback, Topbar } from "./components";
import { useSelectAdmin } from "./hooks";

/**
 * @param {string} id The ID.
 * @returns {string} The name of the slot/fill.
 */
const getRouteSlotFillName = id => `yoast/admin/route/${ id }`;

/**
 * @param {{key: string, value: JSX.Element}[]} routeElements The registered elements belonging to the routes.
 * @returns {JSX.Element} The app.
 */
const App = ( { routeElements } ) => {
	const routes = useSelectAdmin( "selectAllRoutes" );

	return (
		<>
			<Topbar />
			<Routes>
				{ routes.map( ( { id, path } ) => (
					/**
					 * Changes the path to include a wildcard.
					 * Otherwise, the initial route does not handle the sub-routes correctly.
					 * There is more to this in the Topbar, to fix the active style.
					 */
					<Route
						key={ `route-${ id }` }
						path={ `${ path }/*` }
						element={ (
							<ErrorBoundary FallbackComponent={ RouteErrorFallback }>
								<Slot name={ getRouteSlotFillName( id ) } />
							</ErrorBoundary>
						) }
					/>
				) ) }
			</Routes>
			{ routeElements.map( ( { key, value } ) => (
				<Fill key={ `route-${ key }` } name={ getRouteSlotFillName( key ) }>
					{ value }
				</Fill>
			) ) }
		</>
	);
};

App.propTypes = {
	routeElements: PropTypes.arrayOf( PropTypes.shape( {
		key: PropTypes.string.isRequired,
		value: PropTypes.node.isRequired,
	} ) ).isRequired,
};

export default App;
