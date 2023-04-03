import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { ErrorBoundary, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { YoastLogo } from "../settings/components";
import RegisteredElements from "./components/registered-elements";
import RouteErrorFallback from "./components/route-error-fallback";
import Topbar from "./components/topbar";
import { useSelectAdmin } from "./hooks";

/**
 * @returns {JSX.Element} The app.
 */
const App = () => {
	const isPremium = useSelectAdmin( "selectFromShared", [], "isPremium", false );
	const menu = useSelectAdmin( "selectMenuArray" );
	const links = useSelectAdmin( "selectLinksFromMenu" );
	const svgAriaProps = useSvgAria();
	const { pathname } = useLocation();

	return (
		<>
			<Topbar
				activePath={ pathname }
				links={ links }
				logo={ (
					<Link
						id="link-yoast-logo-topbar"
						to="/"
						className={ classNames(
							"yst-block yst-py-2.5 yst-border-b-2 yst-border-transparent focus:yst-ring-primary-500",
							pathname === "/" && "yst-border-primary-500"
						) }
						aria-label={ isPremium ? "Yoast SEO Premium" : "Yoast SEO" }
					>
						<YoastLogo className="yst-w-40" { ...svgAriaProps } />
					</Link>
				) }
				openButtonScreenReaderText={ __( "Open top bar navigation menu", "wordpress-seo" ) }
				closeButtonScreenReaderText={ __( "Close top bar navigation menu", "wordpress-seo" ) }
			/>
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
