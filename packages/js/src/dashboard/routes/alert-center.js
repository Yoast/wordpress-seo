import { __ } from "@wordpress/i18n";
import { Paper, Title } from "@yoast/ui-library";
import { Notifications, Problems } from "../components";

/**
 * @returns {JSX.Element} The dashboard content placeholder.
 */
export const AlertCenter = () => {
	return <>
		<Paper>
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
					<p className="yst-text-tiny yst-mt-3">
						{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
					</p>
				</div>
			</header>
		</Paper>
		<div className="yst-grid lg:yst-grid-cols-2 yst-gap-8 yst-my-8 yst-items-start">
			<Problems />
			<Notifications />
		</div>
	</>;
};
