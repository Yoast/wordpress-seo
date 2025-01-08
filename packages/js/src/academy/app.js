import { ExternalLinkIcon, LockOpenIcon } from "@heroicons/react/outline";
import { ArrowSmRightIcon } from "@heroicons/react/solid";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { Badge, Button, Card, Link, Paper, Title, useSvgAria } from "@yoast/ui-library";
import { isEmpty } from "lodash";
import { useSelectAcademy } from "./hooks";

/**
 * @param {Object} [dependencies] The dependencies of a course specified as DEPENDENCY_NAME : value.
 * @param {boolean} [isPremium] Whether the user has a premium subscription.
 * @returns {boolean} Whether course dependencies are met.
 */
const areDependenciesMet = ( dependencies, isPremium ) => {
	if ( isEmpty( dependencies ) || isPremium ) {
		return true;
	}

	return Object.values( dependencies ).every( item => item === true );
};

/**
 * @param {Object} [dependencies] The dependencies of a course specified as DEPENDENCY_NAME : value.
 * @param {boolean} [isPremium] Whether the user has a premium subscription.
 * @returns {boolean} Whether a premium badge should be shown.
 */
const shouldShowPremiumBadge = ( dependencies, isPremium ) => {
	if ( isEmpty( dependencies ) ) {
		return false;
	}

	return isPremium || dependencies.WOO || dependencies.LOCAL;
};

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const linkParams = useSelectAcademy( "selectLinkParams" );
	const pluginUrl = useSelectAcademy( "selectPreference", [], "pluginUrl", "" );
	const isPremium = useSelectAcademy( "selectPreference", [], "isPremium", "" );
	const isWooActive = useSelectAcademy( "selectPreference", [], "isWooActive", "" );
	const isLocalActive = useSelectAcademy( "selectPreference", [], "isLocalActive", "" );
	const premiumUpsellConfig = useSelectAcademy( "selectUpsellSettingsAsProps" );
	const svgAriaProps = useSvgAria();

	const courses = useMemo( () => ( [
		{
			id: "ai_for_seo",
			title: "AI for SEO",
			description: __( "Join the Yoast team to learn how to harness the power of AI to revolutionize your SEO approach. Gain a competitive edge, future-proof your keyword strategies, and soar to the top of search rankings – all designed to empower busy small business owners.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/ai_for_seo_icon_my_yoast.png`,
			startLink: addQueryArgs( "https://yoa.st/ai-for-seo-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/ai-for-seo-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "seo_for_beginners",
			title: "SEO for beginners",
			description: __( "In this free course, you'll get quick wins to make your site rank higher in Google, Bing, and Yahoo.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/seo_for_beginners.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-seo-beginners-start", linkParams ),
			dependencies: {},
			hasTrial: true,
		},
		{
			id: "seo_for_wp",
			title: "Yoast SEO for WordPress (block editor)",
			description: sprintf(
				/* translators: %1$s expands to Yoast SEO. */
				__( "In this course, you'll learn about how to set up and use the %1$s for WordPress plugin so it makes SEO even easier. This course is meant for users of the block editor.", "wordpress-seo" ),
				"Yoast SEO"
			),
			image: `${ pluginUrl }/images/academy/seo_for_wp.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-seo-wordpress-block-editor-start", linkParams ),
			dependencies: {},
			hasTrial: true,
		},
		{
			id: "all_around_seo",
			title: "All-around SEO",
			description: __( "In this course, you'll learn practical SEO skills on every key aspect of SEO, to make your site stand out.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/all_around_seo.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-all-around-seo-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-all-around-seo-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "wp_for_beginners",
			title: "WordPress for beginners",
			description: __( "Do you want to set up your own WordPress site? This course will teach you the ins and outs of creating and maintaining a WordPress website!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/wp_for_beginners.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-wordpress-beginners-start", linkParams ),
			dependencies: {},
			hasTrial: true,
		},
		{
			id: "copywriting",
			title: "SEO copywriting",
			description: __( "In this course, you'll learn how to write awesome copy that is optimized for ranking in search engines.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/copywriting.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-seo-copywriting-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-seo-copywriting-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "structured_data_for_beginners",
			title: "Structured data for beginners",
			description: __( "Learn how to make your site stand out from the crowd by adding structured data!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/structured_data_for_beginners.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-structured-data-beginners-start", linkParams ),
			dependencies: {},
			hasTrial: true,
		},

		{
			id: "keyword_research",
			title: "Keyword research",
			description: __( "Do you know the essential first step of good SEO? It's keyword research. In this training, you'll learn how to research and select the keywords that will guide searchers to your pages.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/keyword_research.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-keyword-research-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-keyword-research-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "block_editor",
			title: "Block editor training",
			description: __( "Start creating block-tastic content with the new WordPress block editor! Learn all about the block editor and what you can do with it.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/block_editor.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-block-editor-start", linkParams ),
			dependencies: {},
			hasTrial: true,
		},
		{
			id: "site_structure",
			title: "Site structure",
			description: __( "A clear site structure benefits your users and is of great importance for SEO. Still, most people seem to forget about this. Get ahead of your competition and learn how to improve your site structure!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/site_structure.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-site-structure-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-site-structure-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "local",
			title: "Local SEO",
			description: __( "Do you own a local business? This course will teach you how to make sure your local audience can find you in the search results and on Google Maps!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/local.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-local-seo-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-local-seo-unlock", linkParams ),
			dependencies: { LOCAL: isLocalActive },
			hasTrial: true,
		},
		{
			id: "ecommerce",
			title: "Ecommerce SEO",
			description: __( "Learn how to optimize your online shop for your customers and for search engines!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/ecommerce.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-ecommerce-seo-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-ecommerce-seo-unlock", linkParams ),
			dependencies: { WOO: isWooActive },
			hasTrial: true,
		},
		{
			id: "understanding_structured_data",
			title: "Understanding structured data",
			description: __( "Do you want to take a deep dive into structured data? In this course, you'll learn the theory related to structured data in detail.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/understanding_structured_data.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-understanding-structured-data-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-understanding-structured-data-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: false,
		},
		{
			id: "multilingual",
			title: "International SEO",
			description: __( "Are you selling in countries all over the world? In this course, you’ll learn all about setting up and managing a site that targets people in different languages and locales.", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/multilingual.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-international-seo-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-international-seo-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "crawlability",
			title: "Technical SEO: Crawlability and indexability",
			description: __( "You have to make it possible for search engines to find your site, so they can display it in the search results. We'll tell you all about how that works in this course!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/crawlability.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-technical-seo-crawlability-indexability-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-technical-seo-crawlability-indexability-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: true,
		},
		{
			id: "hosting_and_server",
			title: "Technical SEO: Hosting and server configuration",
			description: __( "Choosing the right type of hosting for your site is the basis of a solid Technical SEO strategy. Learn all about it in this course!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/hosting_and_server.png`,
			startLink: addQueryArgs( "https://yoa.st/academy-technical-seo-hosting-server-configuration-start", linkParams ),
			upsellLink: addQueryArgs( "https://yoa.st/academy-technical-seo-hosting-server-configuration-unlock", linkParams ),
			dependencies: { PREMIUM: isPremium },
			hasTrial: false,
		},
	] ), [ linkParams ] );

	return (
		<div className="yst-p-4 min-[783px]:yst-p-8 yst-mb-8 xl:yst-mb-0">
			<Paper as="main">
				<header className="yst-p-8 yst-border-b yst-border-slate-200">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Academy", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">
							{ isPremium &&
								sprintf(
									// translators: %s for Yoast SEO Premium.
									__( "Learn vital SEO skills that you can apply at once! Let us take you by the hand and give you practical SEO tips to help you outrank your competitors. Maximize your SEO game! Because your %s subscription gives you unlimited access to all courses.", "wordpress-seo" ),
									"Yoast SEO Premium"
								)
							}

							{ ! isPremium && <>
								{ sprintf(
									// translators: %s for Yoast SEO.
									__( "Learn vital SEO skills that you can apply at once! Let us take you by the hand and give you practical SEO tips to help you outrank your competitors. %s comes with five free courses.", "wordpress-seo" ),
									"Yoast SEO"
								) }
								{ " " }
								<Link
									href={ addQueryArgs( "https://yoa.st/academy-page-upsell/", linkParams ) }
									target="_blank"
									{ ...premiumUpsellConfig }
								>
									{ sprintf(
										// translators: %s for Yoast SEO Premium.
										__( "Maximize your SEO game by purchasing %s, which grants you unlimited access to all courses.", "wordpress-seo" ),
										"Yoast SEO Premium"
									)
									}
								</Link>
							</>
							}

						</p>
					</div>
				</header>
				<div className="yst-h-full yst-p-8">
					<div
						className="yst-max-w-6xl yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-4"
					>
						{ courses.map( ( course ) => (
							<Card key={ `card-course-${ course.id }` }>
								<Card.Header className="yst-h-auto yst-p-0">
									<img
										className="yst-w-full yst-transition yst-duration-200"
										src={ course.image }
										alt=""
										width={ 500 }
										height={ 250 }
										loading="lazy"
										decoding="async"
									/>

									{ shouldShowPremiumBadge( course.dependencies, isPremium ) && (
										<div className="yst-absolute yst-top-2 yst-end-2 yst-flex yst-gap-1.5">
											<Badge size="small" variant="upsell">{ __( "Premium", "wordpress-seo" ) }</Badge>
										</div>
									) }
								</Card.Header>
								<Card.Content className="yst-flex yst-flex-col yst-gap-3">
									<Title as="h3">{ course.title }</Title>

									{ course.description }

									{
										! areDependenciesMet( course.dependencies, isPremium ) &&
										<Link
											href={ course.startLink }
											className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium yst-text-primary-500"
											target="_blank"
										>
											{ __( "Start free trial lesson", "wordpress-seo" ) }
											<span className="yst-sr-only">
												{
													/* translators: Hidden accessibility text. */
													__( "(Opens in a new browser tab)", "wordpress-seo" )
												}
											</span>
											<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ms-1 yst-icon-rtl" />
										</Link> }
								</Card.Content>
								<Card.Footer>
									<>
										{
											! areDependenciesMet( course.dependencies, isPremium ) &&
											(
												<Button
													as="a"
													id={ `button-get-course-${ course.id }` }
													className="yst-gap-2 yst-w-full yst-px-2"
													variant="upsell"
													href={ course?.upsellLink }
													target="_blank"
													rel="noopener"
													{ ...premiumUpsellConfig }
												>
													<LockOpenIcon className="yst-w-5 yst-h-5 yst--ms-1 yst-shrink-0" { ...svgAriaProps } />
													{ sprintf(
														/* translators: %1$s expands to Premium. */
														__( "Unlock with %1$s", "wordpress-seo" ),
														"Premium"
													) }
												</Button>
											)
										}
										{
											areDependenciesMet( course.dependencies, isPremium ) &&
											(
												<Button
													as="a"
													id={ `button-start-course-${ course.id }` }
													className="yst-gap-2 yst-w-full yst-px-2 yst-leading-5"
													variant="primary"
													href={ course.startLink }
													target="_blank"
													rel="noopener"
												>
													{ __( "Start the course", "wordpress-seo" ) }
													<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-white rtl:yst-rotate-[270deg]" />
												</Button>
											)
										}
									</>
								</Card.Footer>
							</Card>
						) ) }
					</div>
				</div>
			</Paper>
		</div>
	);
};

export default App;
