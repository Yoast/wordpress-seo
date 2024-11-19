import { useSelect } from "@wordpress/data";
import classNames from "classnames";
import PropTypes from "prop-types";
import { SidebarRecommendations } from "../../shared-admin/components";
import { STORE_NAME } from "../constants";
import { useSelectGeneralPage } from "../hooks";

/**
 * @param {string} [contentClassName] Extra class name for the children container.
 * @param {JSX.node} children The children.
 * @returns {JSX.Element} The element.
 */
export const SidebarLayout = ( { contentClassName, children } ) => {
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );
	const premiumLinkSidebar = useSelectGeneralPage( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectGeneralPage( "selectUpsellSettingsAsProps" );
	const academyLink = useSelectGeneralPage( "selectLink", [], "https://yoa.st/3t6" );
	const { isPromotionActive } = useSelect( STORE_NAME );

	return (
		<div className="yst-flex yst-gap-6 xl:yst-flex-row yst-flex-col">
			<div className={ classNames( "yst-@container yst-flex yst-flex-grow yst-flex-col", contentClassName ) }>
				{ children }
			</div>
			{ ! isPremium &&
				<div className="yst-min-w-[16rem] xl:yst-max-w-[16rem]">
					<div className="yst-sticky yst-top-16">
						<SidebarRecommendations
							premiumLink={ premiumLinkSidebar }
							premiumUpsellConfig={ premiumUpsellConfig }
							academyLink={ academyLink }
							isPromotionActive={ isPromotionActive }
						/>
					</div>
				</div>
			}
		</div>
	);
};

SidebarLayout.propTypes = {
	contentClassName: PropTypes.string,
	children: PropTypes.node,
};
