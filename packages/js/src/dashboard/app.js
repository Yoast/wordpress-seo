/* eslint-disable complexity */

import { __ } from "@wordpress/i18n";
import {  Paper, Title } from "@yoast/ui-library";

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	return (
		<div className="yst-p-4 min-[783px]:yst-p-8 yst-mb-8 xl:yst-mb-0">
			<Paper as="main">
				<header className="yst-p-8 yst-border-b yst-border-slate-200">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">
							{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
						</p>
					</div>
				</header>
				<div className="yst-h-full yst-p-8">
					<div className="yst-max-w-6xl yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-4">
						Content
					</div>
				</div>
			</Paper>
		</div>
	);
};

export default App;
