/* eslint-disable complexity, react/jsx-max-depth */
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { createInterpolateElement, Fragment, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { Badge, Button, FeatureUpsell, Link, Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "../shared-admin/components";
import { FieldsetLayout } from "./components/fieldset-layout";
import { ResourceCard } from "./components/resource-card";
import { useSelectSupport } from "./hooks";

/**
 * Opens the HelpScout beacon.
 *
 * By "clicking" on the button inside the button iframe (there can be more).
 *
 * @returns {void}
 */
const openHelpScoutBeacon = () => {
	document.querySelector( "#beacon-container .BeaconFabButtonFrame iframe" )
		?.contentWindow
		?.document
		?.querySelector( "button[aria-controls='HSBeaconContainerFrame']" )
		?.click();
};

/**
 * @returns {JSX.Element} The app component.
 */
export const App = () => {
	const isPremium = useSelectSupport( "selectPreference", [], "isPremium", false );
	const premiumUpsellConfig = useSelectSupport( "selectUpsellSettingsAsProps" );
	const pluginUrl = useSelectSupport( "selectPreference", [], "pluginUrl", "" );
	const linkParams = useSelectSupport( "selectLinkParams" );

	const premiumLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );
	const academyLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );
	const helpCenterLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );
	const supportForumsLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );
	const githubLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );
	const contactSupportLink = useSelectSupport( "selectLink", [], "https://yoa.st/" );

	const faq = useMemo( () => ( [
		{
			text: "What are transition words in my own language?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "How do I set up canonical URLs in Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "How to use  XML sitemaps in Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "How do I implement breadcrumbs in Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "Where can I find an overview of essential SEO terms and vocabulary?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "How do I customize the breadcrumbs title setting in Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "What are the meta robots advanced settings in Yoast SEO and what can I do with these settings?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "Why do I get a notification telling me that I am not receiving updates or support for Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
		{
			text: "How do I edit robots.txt through Yoast SEO?",
			link: addQueryArgs( "https://yoa.st/", linkParams ),
		},
	] ), [] );

	return (
		<div className="yst-p-4 min-[783px]:yst-p-8">
			<div className={ classNames( "yst-flex yst-flex-grow yst-flex-wrap", ! isPremium && "xl:yst-pr-[17.5rem]" ) }>
				<Paper as="main" className="yst-flex-grow yst-mb-8 xl:yst-mb-0">
					<Paper.Header>
						<div className="yst-max-w-screen-sm">
							<Title>{ __( "Support", "wordpress-seo" ) }</Title>
							<p className="yst-text-tiny yst-mt-3">
								{ __( "If you have any questions, need a hand with a technical issue, or just want to say hi, we've got you covered. Get in touch with us and we'll be happy to assist you!", "wordpress-seo" ) }
							</p>
						</div>
					</Paper.Header>
					<Paper.Content>
						<div className="yst-max-w-6xl">
							<FieldsetLayout
								title={ __( "Frequently asked questions", "wordpress-seo" ) }
								description={ sprintf(
									/* translators: %1$s expands to Yoast SEO. */
									__( "Here, you'll find answers to commonly asked questions about using %1$s. If you don't see your question listed, you can have a look at the section below.", "wordpress-seo" ),
									"Yoast SEO"
								) }
							>
								<ul>
									{ faq.map( ( { text, link }, index ) => (
										<Fragment key={ `faq-${ index }` }>
											{ index > 0 && <hr className="yst-my-3" /> }
											<li>
												<Link href={ link } className="yst-flex yst-items-center yst-font-medium yst-no-underline">
													{ text }
													<ArrowNarrowRightIcon className="yst-inline-block yst-ml-1.5 yst-h-3 yst-w-3 yst-icon-rtl" />
												</Link>
											</li>
										</Fragment>
									) ) }
								</ul>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								title={ __( "Additional resources", "wordpress-seo" ) }
								description={ sprintf(
									/* translators: %1$s expands to Yoast SEO. */
									__( "Need help with %1$s? These resources are a great place to start!", "wordpress-seo" ),
									"Yoast SEO"
								) }
							>
								<div className="yst-grid yst-gap-6 yst-grid-cols-3 max-sm:yst-grid-cols-1">
									<ResourceCard
										imageSrc={ `${ pluginUrl }/images/support/help_center.png` }
										title={ sprintf(
											/* translators: %1$s expands to Yoast. */
											__( "%1$s's help center", "wordpress-seo" ),
											"Yoast"
										) }
										description={ sprintf(
											/* translators: %1$s expands to Yoast SEO. */
											__( "Have a look at our help center to find articles, tutorials, and other resources to help you get the most out of %1$s!", "wordpress-seo" ),
											"Yoast SEO"
										) }
										linkHref={ helpCenterLink }
										linkText={ __( "Visit our help center", "wordpress-seo" ) }
									/>
									<ResourceCard
										imageSrc={ `${ pluginUrl }/images/support/support_forums.png` }
										title={ sprintf(
											/* translators: %1$s expands to Yoast SEO. */
											__( "WordPress support forum for %1$s", "wordpress-seo" ),
											"Yoast SEO"
										) }
										description={ sprintf(
											/* translators: %1$s expands to Yoast SEO. */
											__( "In the WordPress support forum for %1$s you can find answers or ask for help from %1$s users in the WordPress community.", "wordpress-seo" ),
											"Yoast SEO"
										) }
										linkHref={ supportForumsLink }
										linkText={ __( "Visit WordPress forum", "wordpress-seo" ) }
									/>
									<ResourceCard
										imageSrc={ `${ pluginUrl }/images/support/github.png` }
										title={ __( "Raise a bug report on GitHub", "wordpress-seo" ) }
										description={ sprintf(
											/* translators: %1$s expands to Yoast SEO. */
											__( "Have you stumbled upon a bug while using %1$s? Please raise a bug report on our GitHub repository to let us know about the issue!", "wordpress-seo" ),
											"Yoast SEO"
										) }
										linkHref={ githubLink }
										linkText={ __( "Visit our GitHub repo", "wordpress-seo" ) }
									/>
								</div>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								title={ (
									<div className="yst-flex yst-items-center yst-gap-1.5">
										<span>{ __( "Contact our support team", "wordpress-seo" ) }</span>
										{ isPremium && <Badge variant="upsell">Premium</Badge> }
									</div>
								) }
								description={ (
									<>
										<span>{ __( "If you don't find the answers you're looking for and need personalized help, you can get 24/7 support from one of our support engineers.", "wordpress-seo" ) }</span>
										<span className="yst-block yst-mt-4">{ createInterpolateElement(
											sprintf(
												/* translators: %1$s expands to an opening span tag, %2$s expands to a closing span tag. */
												__( "%1$sSupport languages:%2$s English & Spanish", "wordpress-seo" ),
												"<span>",
												"</span>"
											),
											{
												span: <span className="yst-font-medium yst-text-slate-800" />,
											}
										) }</span>
									</>
								) }
							>
								<FeatureUpsell
									shouldUpsell={ ! isPremium }
									variant="card"
									cardLink={ contactSupportLink }
									cardText={ sprintf(
										/* translators: %1$s expands to Premium. */
										__( "Unlock with %1$s", "wordpress-seo" ),
										"Premium"
									) }
									{ ...premiumUpsellConfig }
								>
									<div className={ classNames( "yst-flex", ! isPremium && "yst-opacity-50" ) }>
										<div className="yst-mr-6">
											<p>{ __( "Our support team is here to answer any questions you may have. Fill out the (pop-up) contact form, and we'll get back to you as soon as possible!", "wordpress-seo" ) }</p>
											<Button
												variant="secondary"
												className="yst-mt-4"
												onClick={ openHelpScoutBeacon }
											>
												{ __( "Contact our support team", "wordpress-seo" ) }
												<ArrowNarrowRightIcon className="yst-inline-block yst-ml-1.5 yst-h-3 yst-w-3 yst-icon-rtl" />
											</Button>
										</div>
										<img
											src={ `${ pluginUrl }/images/support-team.svg` }
											alt=""
											width={ 125 }
											height={ 100 }
											loading="lazy"
											decoding="async"
										/>
									</div>
								</FeatureUpsell>
							</FieldsetLayout>
						</div>
					</Paper.Content>
				</Paper>
				{ ! isPremium && (
					<RecommendationsSidebar>
						<PremiumUpsellCard link={ premiumLink } linkProps={ premiumUpsellConfig } />
						<AcademyUpsellCard link={ academyLink } />
					</RecommendationsSidebar>
				) }
			</div>
		</div>
	);
};