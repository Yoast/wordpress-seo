import { __ } from "@wordpress/i18n";
import { TopbarNavigation, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { YoastLogo } from "../../settings/components";
import { useSelectAdmin } from "../hooks";

/**
 * @returns {JSX.Element} The topbar.
 */
const Topbar = () => {
	const isPremium = useSelectAdmin( "selectFromShared", [], "isPremium", false );
	const links = useSelectAdmin( "selectLinksFromRoutes" );
	const svgAriaProps = useSvgAria();
	const { pathname } = useLocation();

	return (
		<TopbarNavigation activePath={ pathname }>
			<TopbarNavigation.Container>
				<TopbarNavigation.Topbar>
					<TopbarNavigation.Start>
						<TopbarNavigation.MobileMenuButton
							openButtonScreenReaderText={ __( "Open top bar navigation menu", "wordpress-seo" ) }
							closeButtonScreenReaderText={ __( "Close top bar navigation menu", "wordpress-seo" ) }
						/>
					</TopbarNavigation.Start>

					<TopbarNavigation.Center>
						<TopbarNavigation.LogoContainer>
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
						</TopbarNavigation.LogoContainer>
						<TopbarNavigation.LinksContainer>
							{ links.map( ( { children, ...props }, index ) => (
								<TopbarNavigation.Link
									key={ `link-${ index }` }
									as={ Link }
									hrefProp="to"
									{ ...props }
								>
									{ children }
								</TopbarNavigation.Link>
							) ) }
						</TopbarNavigation.LinksContainer>
					</TopbarNavigation.Center>
				</TopbarNavigation.Topbar>

				<TopbarNavigation.MobileContainer>
					{ links.map( ( { children, ...props }, index ) => (
						<TopbarNavigation.MobileLink
							key={ `link-mobile-${ index }` }
							as={ Link }
							hrefProp="to"
							{ ...props }
						>
							{ children }
						</TopbarNavigation.MobileLink>
					) ) }
				</TopbarNavigation.MobileContainer>
			</TopbarNavigation.Container>
		</TopbarNavigation>
	);
};

export default Topbar;
