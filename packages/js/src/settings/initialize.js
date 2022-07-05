import { AdjustmentsIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { forEach, get, isObject } from "lodash";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import SidebarNavigation from "./components/sidebar-navigation";
import {
	AuthorArchives,
	Breadcrumbs,
	DateArchives,
	Formats,
	Media,
	NotFoundPages,
	Rss,
	SearchPages,
	SiteDefaults,
	SitePreferences,
	SiteRepresentation,
	WebmasterTools,
} from "./routes";

/**
 * Retrieves the initial settings.
 * @returns {Object} The settings.
 */
const getInitialValues = () => get( window, "wpseoScriptData.settings", {} );

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @returns {Promise<boolean>} Promise of save result.
 */
const handleSubmit = async( values ) => {
	const { endpoint, nonce } = get( window, "wpseoScriptData", {} );
	const formData = new FormData();

	formData.set( "option_page", "wpseo_settings" );
	formData.set( "action", "update" );
	formData.set( "_wpnonce", nonce );

	forEach( values, ( value, name ) => {
		if ( isObject( value ) ) {
			forEach( value, ( nestedValue, nestedName ) => formData.set( `${ name }[${ nestedName }]`, nestedValue ) );
			return;
		}
		formData.set( name, value );
	} );

	try {
		await fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );

		return true;
	} catch ( error ) {
		console.error( error.message );
		return false;
	}
};

domReady( () => {
	const root = document.getElementById( "yoast-seo-settings" );
	if ( ! root ) {
		return;
	}

	render(
		<Root>
			<HashRouter>
				<Formik
					initialValues={ getInitialValues() }
					onSubmit={ handleSubmit }
				>
					<div className="yst-flex md:yst-gap-4 yst-mt-16 md:yst-mt-0 yst-p-4 md:yst-p-8">
						<aside className="yst-hidden md:yst-block yst-flex-shrink-0 yst-w-56 lg:yst-w-64">
							<SidebarNavigation
								items={ [
									{
										icon: DesktopComputerIcon,
										label: __( "Site settings", "wordpress-seo" ),
										subItems: [
											{
												label: __( "Site representation", "wordpress-seo" ),
												linkProps: { as: Link, to: "site-representation" },
											},
											{
												label: __( "Site defaults", "wordpress-seo" ),
												linkProps: { as: Link, to: "site-defaults" },
											},
											{
												label: __( "Site preferences", "wordpress-seo" ),
												linkProps: { as: Link, to: "site-preferences" },
											},
											{
												label: __( "Webmaster tools", "wordpress-seo" ),
												linkProps: { as: Link, to: "webmaster-tools" },
											},
											{
												label: __( "Breadcrumbs", "wordpress-seo" ),
												linkProps: { as: Link, to: "breadcrumbs" },
											},
										],
									},
									{
										icon: NewspaperIcon,
										label: __( "Content settings", "wordpress-seo" ),
										subItems: [],
									},
									{
										icon: AdjustmentsIcon,
										label: __( "Advanced settings", "wordpress-seo" ),
										subItems: [
											{
												label: __( "Author archives", "wordpress-seo" ),
												linkProps: { as: Link, to: "author-archives" },
											},
											{
												label: __( "Date archives", "wordpress-seo" ),
												linkProps: { as: Link, to: "date-archives" },
											},
											{
												label: __( "Search pages", "wordpress-seo" ),
												linkProps: { as: Link, to: "search-pages" },
											},
											{
												label: __( "404 pages", "wordpress-seo" ),
												linkProps: { as: Link, to: "not-found-pages" },
											},
											{
												label: __( "Media", "wordpress-seo" ),
												linkProps: { as: Link, to: "media" },
											},
											{
												label: __( "Formats", "wordpress-seo" ),
												linkProps: { as: Link, to: "formats" },
											},
											{
												label: __( "RSS", "wordpress-seo" ),
												linkProps: { as: Link, to: "rss" },
											},
										],
										defaultOpen: false,
									},
								] }
							/>
						</aside>
						<main className="yst-flex-grow">
							<Routes>
								<Route path="author-archives" element={ <AuthorArchives /> } />
								<Route path="breadcrumbs" element={ <Breadcrumbs /> } />
								<Route path="date-archives" element={ <DateArchives /> } />
								<Route path="formats" element={ <Formats /> } />
								<Route path="media" element={ <Media /> } />
								<Route path="not-found-pages" element={ <NotFoundPages /> } />
								<Route path="rss" element={ <Rss /> } />
								<Route path="search-pages" element={ <SearchPages /> } />
								<Route path="site-defaults" element={ <SiteDefaults /> } />
								<Route path="site-representation" element={ <SiteRepresentation /> } />
								<Route path="site-preferences" element={ <SitePreferences /> } />
								<Route path="webmaster-tools" element={ <WebmasterTools /> } />
								<Route path="/" element={ <SitePreferences /> } />
							</Routes>
						</main>
					</div>
				</Formik>
			</HashRouter>
		</Root>,
		root
	);
} );
