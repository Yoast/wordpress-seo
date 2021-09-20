import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * @returns {JSX.Element} Step 1.
 */
export default function Step1( { navigation } ) {
	return (
		<>
			<div className="yst-bg-white yst-rounded-lg yst-shadow yst-p-8 yst-max-w-450 yst-min-h-360 yst-flex yst-flex-col yst-flex-grow">
				<div>
					<h1 className="yst-text-lg yst-mb-2">{ __( "Yoast SEO is installed succesfully!", "admin-ui" ) }</h1>
					<p>
						{ /* translators: %1$s is replaced by Yoast, %2$s is replaced by Yoast SEO. */ }
						{ sprintf(
							__( "Welcome to the %1$s family! And now that we’re family, we’d like to help you out. You’ve got amazing products or services, and we’d like to help you sell (more of) them! This starts with finding the right customers and attracting them to your online shop. That’s where %2$s comes in! In the next steps, we’ll show how.", "admin-ui" ),
							"Yoast",
							"Yoast SEO",
						) }
					</p>
				</div>
				{ navigation }
			</div>
			<div className="yst-flex yst-items-center">
				<img src="build/images/welcome.png" alt={ __( "Drawing of a man with his arms open", "admin-ui" ) } className="yst-max-h-280 lg:yst-ml-44 yst-mt-4 lg:yst-mt-0" />
			</div>
		</>
	);
}

Step1.propTypes = {
	navigation: PropTypes.element,
};

Step1.defaultProps = {
	navigation: "",
};
