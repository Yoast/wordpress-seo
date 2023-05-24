/* eslint-disable complexity */
import { __, sprintf } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
import { AcademyUpsellCard, PremiumUpsellCard, RecommendationsSidebar } from "../shared-admin/components";
import { FieldsetLayout } from "./components/fieldset-layout";
import { useSelectSupport } from "./hooks";

/**
 * @returns {JSX.Element} The app component.
 */
export const App = () => {
	const isPremium = useSelectSupport( "selectPreference", [], "isPremium", false );
	const premiumLink = useSelectSupport( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectSupport( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectSupport( "selectLink", [], "https://yoa.st/3t6" );

	return (
		<div className="yst-p-4 min-[783px]:yst-p-8">
			<div className={ classNames( "yst-flex yst-flex-grow yst-flex-wrap", ! isPremium && "xl:yst-pr-[17.5rem]" ) }>
				<Paper as="main" className="yst-flex-grow yst-mb-8 xl:yst-mb-0">
					<header className="yst-p-8 yst-border-b yst-border-slate-200">
						<div className="yst-max-w-screen-sm">
							<Title>{ __( "Support", "wordpress-seo" ) }</Title>
							<p className="yst-text-tiny yst-mt-3">
								{ __( "If you have any questions, need a hand with a technical issue, or just want to say hi, we've got you covered. Get in touch with us and we'll be happy to assist you!", "wordpress-seo" ) }
							</p>
						</div>
					</header>
					<div className="yst-flex yst-flex-col yst-h-full">
						<div className="yst-flex-grow yst-p-8">
							<div className="yst-max-w-5xl">
								<FieldsetLayout
									title={ __( "Frequently asked questions", "wordpress-seo" ) }
									description={ sprintf(
										/* translators: %1$s expands to Yoast SEO. */
										__( "Here, you'll find answers to commonly asked questions about using %1$s. If you don't see your question listed, you can have a look at the section below.", "wordpress-seo" ),
										"Yoast SEO"
									) }
								>
									FAQ
								</FieldsetLayout>
							</div>
						</div>
					</div>
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
