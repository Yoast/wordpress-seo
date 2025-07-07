import { Transition } from "@headlessui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { RouteErrorFallback, SidebarLayout } from "../components";
import { Redirects } from "./redirects";
import { RegexRedirects } from "./regex-redirects";
import { ROUTES } from "../constants";
import { useSelectRedirects } from "../hooks";

/**
 * Renders the application's route configuration with animated transitions.
 *
 * Manages routing between different redirect management pages:
 * - Standard redirects (always available)
 * - Regex redirects (premium only)
 * - Redirect method settings (premium only)
 *
 * @param {Object} [redirectsProps={}] - Props to pass to the premium redirects page.
 * @param {Object} [regexProps={}] - Props to pass to the premium regex redirects page.
 * @param {Function} [redirectMethod] - Redirect method component
 * @returns {JSX.Element} The routed application layout with transitions.
 */
export const AppRoutes = ( { redirectsProps = {}, regexProps = {}, redirectMethod: RedirectMethod } ) => {
	const { pathname } = useLocation();
	const isPremium = useSelectRedirects( "selectPreference", [], "isPremium" );

	return (
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
							<Redirects { ...redirectsProps } />
						</SidebarLayout>
					}
					errorElement={ <RouteErrorFallback /> }
				/>

				{ isPremium && (
					<>
						<Route
							path={ ROUTES.regexRedirects }
							element={
								<SidebarLayout>
									<RegexRedirects { ...regexProps } />
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
					</>
				) }
				<Route path="*" element={ <Navigate to="" replace={ true } /> } />
			</Routes>
		</Transition>
	);
};
