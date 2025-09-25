import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { PremiumCard } from "./components/cards/premium-card";
import { WooCard } from "./components/cards/woo-card";
import { AiPlusCard } from "./components/cards/ai-plus-card";

/**
 * @returns {JSX.Element} The app component.
 */
export const App = () => (
	<div className="yst-p-4 min-[783px]:yst-p-8 yst-mb-8 xl:yst-mb-0">
		<Paper as="main" className="yst-max-w-page">
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ __( "Plans", "wordpress-seo" ) }</Title>
					<p className="yst-text-tiny yst-mt-3">
						{ __( "Compare plans and find the perfect fit for your site - from essential SEO features to advanced automation.", "wordpress-seo" ) }
					</p>
				</div>
			</header>
			<div className="yst-h-full yst-p-8">
				<div className="yst-max-w-6xl yst-flex yst-gap-6 yst-flex-wrap">
					<PremiumCard />
					<WooCard />
					<AiPlusCard />
				</div>
			</div>
		</Paper>
	</div>
);
