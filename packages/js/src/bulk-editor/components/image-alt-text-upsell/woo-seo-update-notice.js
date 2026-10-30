import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, useSvgAria } from "@yoast/ui-library";
import { STORE_NAME } from "../../constants";

/**
 * The "Image alt text" tab content while the active Yoast WooCommerce SEO predates the tab.
 *
 * A notice in the panel rather than a modal: the tabs activate on arrow-key focus, so a modal that opens with the
 * tab would trap keyboard users moving through the tabs.
 *
 * @returns {JSX.Element} The update notice.
 */
export const WooSeoUpdateNotice = () => {
	const ariaProps = useSvgAria();
	const updateUrl = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "wooSeoUpdateUrl", "" ), [] );

	// The button sits below the notice rather than in it: the notice's text color would override the button's.
	return (
		<div className="yst-flex yst-flex-col yst-items-start yst-gap-4">
			<Alert variant="warning" as="div" role="status" className="yst-max-w-screen-sm">
				<div className="yst-flex yst-flex-col yst-gap-1">
					<span className="yst-block yst-font-medium">{ __( "Your plugin needs an update", "wordpress-seo" ) }</span>
					<span className="yst-font-normal">
						{ sprintf(
							/* translators: %1$s expands to "Yoast WooCommerce SEO", %2$s expands to "MyYoast". */
							__( "To manage the alt text of your product images here, please update %1$s to the latest version. Updates need an active %1$s subscription in %2$s.", "wordpress-seo" ),
							"Yoast WooCommerce SEO",
							"MyYoast"
						) }
					</span>
				</div>
			</Alert>
			{ updateUrl && <Button
				id="yst-bulk-editor-woo-seo-update"
				className="yst-pe-2.5 yst-flex yst-gap-1.5 yst-items-center"
				href={ updateUrl }
				target="_blank"
				rel="noopener noreferrer"
				as="a"
			>
				{ __( "Update now", "wordpress-seo" ) }
				<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
				<ArrowNarrowRightIcon className="yst-h-4 yst-w-4 rtl:yst-rotate-180 yst-shrink-0" { ...ariaProps } />
			</Button> }
		</div>
	);
};
