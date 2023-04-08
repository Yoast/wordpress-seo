import { Fill, Slot } from "@wordpress/components";
import { ErrorBoundary } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteErrorFallback, Topbar } from "./components";
import { useSelectAdmin } from "./hooks";

/**
 * @param {string} id The ID.
 * @returns {string} The name of the slot/fill.
 */
const getRouteSlotFillName = id => `yoast/admin/route/${ id }`;

/**
 * @param {{key: string, value: JSX.Element}[]} routeCollection The registered elements belonging to the routes.
 * @returns {JSX.Element} The app.
 */
const App = ( { routeCollection } ) => {
	const routes = useSelectAdmin( "selectAllRoutes" );

	return (
		<>
			<Topbar />
			<Routes>
				{ routes.map( ( { id, path } ) => (
					<Route
						key={ `route-${ id }` }
						path={ path }
						element={ (
							<ErrorBoundary FallbackComponent={ RouteErrorFallback }>
								<Slot name={ getRouteSlotFillName( id ) } />
							</ErrorBoundary>
						) }
					/>
				) ) }
				{ routes[ 0 ]?.path && (
					<Route path="*" element={ <Navigate to={ routes[ 0 ].path } replace={ true } /> } />
				) }
			</Routes>
			{ routeCollection.map( ( { key, value } ) => (
				<Fill key={ `route-${ key }` } name={ getRouteSlotFillName( key ) }>
					{ value }
				</Fill>
			) ) }
		</>
	);
};

App.propTypes = {
	routeCollection: PropTypes.arrayOf( PropTypes.shape( {
		key: PropTypes.string.isRequired,
		value: PropTypes.node.isRequired,
	} ) ).isRequired,
};

export default App;
