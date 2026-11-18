import { __ } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { get } from "lodash";
import { useBlocker } from "react-router-dom";
import FirstTimeConfigurationSteps from "../../first-time-configuration/first-time-configuration-steps";
import { UnsavedChangesModal } from "../../shared-admin/components";
import { RouteLayout } from "../components";

/**
 * @returns {JSX.Element} The site defaults route.
 */
export const FirstTimeConfiguration = () => {
	const blocker = useBlocker( ( { currentLocation, nextLocation } ) => {
		const isStepBeingEdited = get( window, "isStepBeingEdited", false );
		return isStepBeingEdited && currentLocation.pathname === "/first-time-configuration" && nextLocation.pathname !== "/first-time-configuration";
	} );

	return (
		<Paper>
			<RouteLayout
				title={ __( "First-time configuration", "wordpress-seo" ) }
				description={ __( "Tell us about your site, so we can get it ranked! Let's get your site in tip-top shape for the search engines. Follow these 5 steps to make Google understand what your site is about.", "wordpress-seo" ) }
			>
				<div id="yoast-configuration" className="yst-p-8 yst-max-w-[715px]">
					<FirstTimeConfigurationSteps />
				</div>
			</RouteLayout>
			<UnsavedChangesModal
				isOpen={ blocker.state === "blocked" }
				onClose={ blocker.reset }
				title={ __( "Unsaved changes", "wordpress-seo" ) }
				description={ __( "There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" ) }
				onDiscard={ blocker.proceed }
				dismissLabel={ __( "No, continue editing", "wordpress-seo" ) }
				discardLabel={ __( "Yes, leave page", "wordpress-seo" ) }
			/>
		</Paper>
	);
};
