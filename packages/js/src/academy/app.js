import { LockOpenIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { Badge, Button, Card, Title, useSvgAria } from "@yoast/ui-library";
import { useSelectAcademy } from "./hooks";

const AVAILABILITY = {
	premium: "premium",
	free: "free",
	sample: "sample",
};

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const linkParams = useSelectAcademy( "selectLinkParams" );
	const pluginUrl = useSelectAcademy( "selectPreference", [], "pluginUrl", "" );
	const isPremium = useSelectAcademy( "selectPreference", [], "isPremium", "" );
	const premiumUpsellConfig = useSelectAcademy( "selectUpsellSettingsAsProps" );
	const svgAriaProps = useSvgAria();

	const courses = useMemo( () => ( [
		{
			id: "crawlability",
			title: __( "Technical SEO: Crawlability and indexability", "wordpress-seo" ),
			description: __( "You have to make it possible for search engines to find your site, so they can display it in the search results. We'll tell you all about how that works in this course!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/crawlability.png`,
			imageAlt: __( "Logo with a spider", "wordpress-seo" ),
			startLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			upsellLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			availability: AVAILABILITY.premium,
		},
		{
			id: "crawlability_free",
			title: __( "free", "wordpress-seo" ),
			description: __( "You have to make it possible for search engines to find your site, so they can display it in the search results. We'll tell you all about how that works in this course!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/crawlability.png`,
			imageAlt: __( "Logo with a spider", "wordpress-seo" ),
			startLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			upsellLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			availability: AVAILABILITY.free,
		},
		{
			id: "crawlability_sample",
			title: __( "sample", "wordpress-seo" ),
			description: __( "You have to make it possible for search engines to find your site, so they can display it in the search results. We'll tell you all about how that works in this course!", "wordpress-seo" ),
			image: `${ pluginUrl }/images/academy/crawlability.png`,
			imageAlt: __( "Logo with a spider", "wordpress-seo" ),
			startLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			upsellLink: addQueryArgs( "https://academy.yoast.com/courses/technical-seo-crawlability-and-indexability/", linkParams ),
			availability: AVAILABILITY.sample,
		},
	] ), [ linkParams ] );

	return (
		<div className="yst-p-4 min-[783px]:yst-p-8 yst-mb-8 xl:yst-mb-0">
			<main className="yst-rounded-lg yst-bg-white yst-shadow">
				<header className="yst-p-8 yst-border-b yst-border-slate-200">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Academy", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">{ __( "Descriptive text", "wordpress-seo" ) }</p>
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
										alt={ course.imageAlt ?? "" }
										width={ 500 }
										height={ 250 }
										loading="lazy"
										decoding="async"
									/>
									{ ( course.availability === AVAILABILITY.free || course.availability === AVAILABILITY.sample ) && (
										<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
											{ course.availability === AVAILABILITY.free &&
												<Badge size="small" variant="primary">{ __( "Free", "wordpress-seo" ) }</Badge>
											}
											{ course.availability === AVAILABILITY.sample &&
												<Badge size="small" variant="primary">{ __( "Free sample available", "wordpress-seo" ) }</Badge>
											}
										</div>
									) }
								</Card.Header>
								<Card.Content className="yst-flex yst-flex-col yst-gap-3">
									<Title as="h3">{ course.title }</Title>
									{ course.description }
								</Card.Content>
								<Card.Footer>
									<>
										{ course.availability === AVAILABILITY.premium && ! isPremium && (
											<Button
												as="a"
												id={ `button-get-course-${ course.id }` }
												className="yst-gap-2 yst-w-full yst-px-2"
												variant="upsell"
												href={ course.upsellLink }
												target="_blank"
												rel="noopener"
												{ ...premiumUpsellConfig }
											>
												<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1 yst-shrink-0" { ...svgAriaProps } />
												{ sprintf(
													/* translators: %1$s expands to Premium. */
													__( "Unlock with %1$s", "wordpress-seo" ),
													"Premium"
												) }
											</Button>
										) }
										{ ( course.availability === AVAILABILITY.free || ( course.availability === AVAILABILITY.premium && isPremium ) || course.availability === AVAILABILITY.sample ) && (
											<Button
												as="a"
												id={ `button-start-course-${ course.id }` }
												className="yst-gap-2 yst-w-full yst-px-2"
												variant="primary"
												href={ course.startLink }
												target="_blank"
												rel="noopener"
											>
												{ __( "Start the course", "wordpress-seo" ) }
											</Button>
										) }
									</>
								</Card.Footer>
							</Card>
						) ) }
					</div>
				</div>
			</main>
		</div>
	);
};

export default App;
