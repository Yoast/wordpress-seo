import { Slot } from "@wordpress/components";
import { ErrorBoundary } from "@yoast/ui-library";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisteredElements from "./components/registered-elements";
import RouteErrorFallback from "./components/route-error-fallback";
import Topbar from "./components/topbar";
import { useSelectAdmin } from "./hooks";

/**
 * @returns {JSX.Element} The app.
 */
const App = () => {
	const menu = useSelectAdmin( "selectMenuArray" );

	return (
		<>
			<Topbar />
			<Routes>
				{ menu.map( ( { id, route } ) => (
					<Route
						key={ `route-${ id }` }
						path={ route }
						element={ (
							<ErrorBoundary FallbackComponent={ RouteErrorFallback }>
								<Slot name={ `yoast/admin/route/${ id }` } />
							</ErrorBoundary>
						) }
					/>
				) ) }
				{ menu?.[ 0 ]?.route && <Route path="*" element={ <Navigate to={ menu[ 0 ].route } replace={ true } /> } /> }
			</Routes>
			<RegisteredElements />
		</>
	);
};

export default App;
