import { WooHeaderItem } from "@woocommerce/admin-layout";
import { Button, Fill, ToolbarItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { KeywordInput } from "@yoast/externals/components";
import { BlackFridayPromotion } from "../../components/BlackFridayPromotion";
import { BlackFridaySidebarChecklistPromotion } from "../../components/BlackFridaySidebarChecklistPromotion";
import SidebarItem from "../../components/SidebarItem";
import WebinarPromoNotification from "../../components/WebinarPromoNotification";
import PluginIcon from "../../containers/PluginIcon";
import Warning from "../../containers/Warning";
import { shouldShowWebinarPromotionNotificationInSidebar } from "../../helpers/shouldShowWebinarPromotionNotification";
import { SLOTS, STORES } from "../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const YoastSeoApp = () => {
	// TODO: Introduce product shortlink?
	const webinarIntroUrl = useSelect( select => select( STORES.editor ).selectLink( "https://yoa.st/webinar-intro-block-editor" ), [] );
	const {
		isKeywordAnalysisActive,
		isSEMrushIntegrationActive,
		isWooCommerceActive,
	} = useSelect( select => select( STORES.editor ).getPreferences(), [] );

	return (
		<>
			<WooHeaderItem name="product" order={ 10 }>
				<ToolbarItem
					as={ Button }
					variant="tertiary"
					icon={ <PluginIcon size={ 28 } /> }
				>
					{ __( "Analyze", "wordpress-seo" ) }
				</ToolbarItem>
			</WooHeaderItem>
			<Fill name={ SLOTS.seo }>
				<SidebarItem renderPriority={ 1 }>
					<Warning />
					{ shouldShowWebinarPromotionNotificationInSidebar()
						? <WebinarPromoNotification hasIcon={ false } image={ null } url={ webinarIntroUrl } />
						: null
					}
					{ isWooCommerceActive && <BlackFridaySidebarChecklistPromotion hasIcon={ false } /> }
					<BlackFridayPromotion image={ null } hasIcon={ false } />
				</SidebarItem>
				{ isKeywordAnalysisActive && <SidebarItem key="keyword-input" renderPriority={ 8 }>
					<KeywordInput isSEMrushIntegrationActive={ isSEMrushIntegrationActive } />
				</SidebarItem> }
			</Fill>
		</>
	);
};
