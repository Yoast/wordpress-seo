import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import { RouteErrorFallback, SidebarLayout } from "../components";
import { Redirects } from "./redirects";
import { RegexRedirects } from "./regex-redirects";
import { RedirectMethod } from "./redirect-method";
import { ROUTES } from "../constants";

/**
 * Renders the application's route configuration with animated transitions.
 *
 * @component
 * @param {string} props.pathname - The current location pathname used as a key to re-trigger transitions.
 * @returns {JSX.Element} The routed application layout with transitions.
 */
export const AppRoutes = ( { pathname } ) => (
	<Transition
		key={ pathname }
		appear={ true }
		show={ true }
		enter="yst-transition-opacity yst-delay-100 yst-duration-300"
		enterFrom="yst-opacity-0"
		enterTo="yst-opacity-100"
	>
		<Routes>
			<Route
				path={ ROUTES.redirects }
				element={
					<SidebarLayout>
						<Redirects />
					</SidebarLayout>
				}
				errorElement={ <RouteErrorFallback /> }
			/>
			<Route
				path={ ROUTES.regexRedirects }
				element={
					<SidebarLayout>
						<RegexRedirects />
					</SidebarLayout>
				}
				errorElement={ <RouteErrorFallback /> }
			/>
			<Route
				path={ ROUTES.redirectMethod }
				element={
					<SidebarLayout>
						<RedirectMethod />
					</SidebarLayout>
				}
				errorElement={ <RouteErrorFallback /> }
			/>
			<Route path="*" element={ <Navigate to="" replace={ true } /> } />
		</Routes>
	</Transition>
);

AppRoutes.propTypes = {
	pathname: PropTypes.string.isRequired,
};
