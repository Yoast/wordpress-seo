import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} Step 5.
 */
export default function Step5( { navigation } ) {
	return (
		<>
			<div className="yst-max-w-450 yst-flex-grow">
				<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-min-h-360 yst-flex yst-flex-col">
					<div>
						<h1 className="yst-text-lg yst-mb-2">{ __( "Introduce yourself to the search engines", "admin-ui" ) }</h1>
						<p className="yst-mb-4">
							{ /* translators: %1$s is replaced by Yoast SEO */ }
							{ sprintf(
								__( "If you want to be found for search terms like your name, brand, or a business name, you should introduce yourself to Google. %1$s can help you with that. If you fill in the site representation fields, we automatically add structured data code to your online shop. With this code, we tell Google all about your brand. That allows them to properly show your brand in the search results. With a knowledge panel, for example. Click ‘Get started!’, and we’ll send you to the page where you can fill this in directly. Don’t forget to do this! ", "admin-ui" ),
								"Yoast SEO",
							) }
						</p>
						<p>
							{ /* translators: %1$s is replaced by Yoast SEO Academy */ }
							{ sprintf(
								__( "Once that’s done, you’ve already improved your SEO greatly. But of course, your SEO adventure doesn’t stop there! If you want to rank high in the search results, you need to keep working on your SEO. Do you want to know how? Check out the online courses in %1$s!", "admin-ui" ),
								"Yoast SEO Academy",
							) }
						</p>
					</div>
					{ navigation }
				</div>
			</div>
			<div className="yst-flex yst-items-center yst-welcome-container">
				<img src="build/images/knowledge_graph_yoast.gif" alt={ __( "Animated gif of how to introduce yourself to Google", "admin-ui" ) } className="yst-welcome-gif" />
			</div>
		</>
	);
}

Step5.propTypes = {
	navigation: PropTypes.element,
};

Step5.defaultProps = {
	navigation: "",
};

