import { Transition } from "@headlessui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { RouteErrorFallback } from "../components";
import { Redirects } from "./redirects";
import { ROUTES } from "../constants";
import { SidebarLayout } from "../../shared-admin/components";

/**
 * Renders the application's route configuration with animated transitions.
 *
 * @returns {JSX.Element} The routed application layout with transitions.
 */
export const AppRoutes = () => {
	const { pathname } = useLocation();

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
							<Redirects />
						</SidebarLayout>
					}
					errorElement={ <RouteErrorFallback /> }
				/>

				<Route path="*" element={ <Navigate to="" replace={ true } /> } />
			</Routes>
		</Transition>
	);
};
