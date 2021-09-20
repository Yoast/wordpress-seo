import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} Step 2.
 */
export default function Step2( { navigation } ) {
	return (
		<>
			<div className="yst-max-w-450 yst-flex-grow">
				<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-min-h-360 yst-flex yst-flex-col">
					<div>
						<h1 className="yst-text-lg yst-mb-2">{ __( "Instantly improved theme and increased chance of getting rich results", "admin-ui" ) }</h1>
						<p>
							{ /* translators: %1$s is replaced by Yoast SEO. */ }
							{ sprintf(
								__( "By installing %1$s, the SEO of your online shop is already improved! Easy, right? %1$s automatically adds structured data to your site, which helps Google understand your product pages, blogs, and business information better. This increases your chances of getting rich results! Adding structured data manually can be really difficult, but you’re in luck! Because we’re family now, we’ll do it automatically for you.", "admin-ui" ),
								"Yoast SEO",
							) }
						</p>
					</div>
					{ navigation }
				</div>
			</div>
			<div className="yst-flex yst-items-center yst-welcome-container">
				<img src="build/images/product_rich_results.gif" alt={ __( "Animated gif of an example of rich results for products", "admin-ui" ) } className="yst-welcome-gif" />
			</div>
		</>
	);
}

Step2.propTypes = {
	navigation: PropTypes.element,
};

Step2.defaultProps = {
	navigation: "",
};
