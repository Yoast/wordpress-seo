import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} Step 4.
 */
export default function Step4( { navigation } ) {
	return (
		<>
			<div className="yst-max-w-450 yst-flex-grow">
				<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-min-h-360 yst-flex yst-flex-col">
					<div>
						<h1 className="yst-text-lg yst-mb-2">{ __( "Make sure that your content meets best SEO practice!", "admin-ui" ) }</h1>
						<p>
							{ /* translators: %1$s is replaced by Yoast SEO, %2$s is replaced by Yoast. */ }
							{ sprintf(
								__( "%1$s also helps you with optimizing the content on all your pages. Having high-quality content on your site is crucial if you want to rank in the search results. The colored bullets in %2$s are like a teacher, it scans your text and gives you pointers on what to improve. You’ll end up with easy-to-read and well-optimized texts!", "admin-ui" ),
								"Yoast SEO",
								"Yoast",
							) }
						</p>
					</div>
					{ navigation }
				</div>
			</div>
			<div className="yst-flex yst-items-center yst-welcome-container">
				<img src="build/images/seo_bullets.gif" alt={ __( "Animated gif of the Yoast SEO Bullets", "admin-ui" ) } className="yst-welcome-gif" />
			</div>
		</>
	);
}

Step4.propTypes = {
	navigation: PropTypes.element,
};

Step4.defaultProps = {
	navigation: "",
};

