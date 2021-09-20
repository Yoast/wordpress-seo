import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} Step 3.
 */
export default function Step3( { navigation, options } ) {
	return (
		<>
			<div className="yst-max-w-450 yst-flex-grow">
				<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-min-h-360 yst-flex yst-flex-col">
					<div>
						<h1 className="yst-text-lg yst-mb-2">{ __( "Control how your product pages appear in the search results", "admin-ui" ) }</h1>
						<p>
							{ sprintf(
								// translators: %1$s is replaced by Yoast SEO, %2$s is replaced by the CMS name.
								__( "With %1$s you can edit and set defaults for your SEO title, slug, and meta description, and the app will give you real-time feedback, so you’ll know exactly what you can improve! This will make sure your pages always look amazing in the search results, even if you forget to edit one. We’ll automatically override the default %2$s data. No worries, this will only positively affect your online shop! And you can always go back to the default settings.", "admin-ui" ),
								"Yoast SEO",
								options?.cmsName ?? "",
							) }
						</p>
					</div>
					{ navigation }
				</div>
			</div>
			<div className="yst-flex yst-items-center yst-welcome-container">
				<img src="build/images/google_preview.gif" alt={ __( "Animated gif of how to control your product SEO in Yoast SEO", "admin-ui" ) }
				     className="yst-welcome-gif" />
			</div>
		</>
	);
}

Step3.propTypes = {
	navigation: PropTypes.element,
	options: PropTypes.object,
};

Step3.defaultProps = {
	navigation: "",
	options: {},
};

