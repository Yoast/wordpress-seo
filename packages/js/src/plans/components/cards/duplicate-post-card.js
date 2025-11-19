import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../../constants";
import { BaseCard } from "./base-card";
import { DuplicatePostSvg } from "../images/duplicate-post-svg";
import { CardLink } from "../actions/card-link";
import { useMemo } from "@wordpress/element";

/**
 * A card to present the Yoast SEO Duplicate Post plan.
 * @returns {JSX.Element} The element.
 */
export const DuplicatePostCard = () => {
	const {
		isDuplicatePostInstalled,
		isDuplicatePostActive,
		duplicatePostInstallationUrl,
		duplicatePostActivationUrl,
		userCanActivatePlugin,
		userCanInstallPlugin,
		learnMoreLink,
		isBlackFridayPromotionActive,
	} = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );

		return {
			isDuplicatePostInstalled: plansSelect.selectDuplicatePostParam( "isInstalled" ),
			isDuplicatePostActive: plansSelect.selectDuplicatePostParam( "isActivated" ),
			duplicatePostInstallationUrl: plansSelect.selectDuplicatePostParam( "installationUrl" ),
			duplicatePostActivationUrl: plansSelect.selectDuplicatePostParam( "activationUrl" ),
			userCanActivatePlugin: plansSelect.selectUserCan( "activatePlugin" ),
			userCanInstallPlugin: plansSelect.selectUserCan( "installPlugin" ),
			learnMoreLink: plansSelect.selectLink( "http://yoa.st/plans-duplicate-post-learn-more" ),
			isBlackFridayPromotionActive: plansSelect.isPromotionActive( "black-friday-promotion" ),
		};
	}, [] );

	const { buttonLink, buttonDisabled } = useMemo( () => {
		const disabledButton = { buttonLink: null, buttonDisabled: true };
		if ( isDuplicatePostActive ) {
			return disabledButton;
		}

		if ( isDuplicatePostInstalled ) {
			if ( userCanActivatePlugin ) {
				return { buttonLink: duplicatePostActivationUrl, buttonDisabled: false };
			}
			return disabledButton;
		}

		if ( userCanInstallPlugin ) {
			return { buttonLink: duplicatePostInstallationUrl, buttonDisabled: false };
		}

		return disabledButton;
	}, [
		isDuplicatePostInstalled,
		isDuplicatePostActive,
		duplicatePostInstallationUrl,
		duplicatePostActivationUrl,
		userCanActivatePlugin,
		userCanInstallPlugin,
	] );

	return (
		<BaseCard
			hasHighlight={ isDuplicatePostActive }
			isActiveHighlight={ isDuplicatePostActive }
			isManageAvailable={ false }
			isLicenseRequired={ false }
			header={ <DuplicatePostSvg /> }
			title="Yoast Duplicate Post"
			description={ __( "Easily copy posts and pages in one click to save time when reusing or updating content.", "wordpress-seo" ) }
			list={ [
				__( "Duplicate any post or page instantly", "wordpress-seo" ),
				__( "Perfect for creating templates or testing updates", "wordpress-seo" ),
				__( "Trusted by over 4+ million WordPress sites", "wordpress-seo" ),
			] }
			buttonOverride={ <CardLink href={ buttonLink } label={ __( "Install plugin", "wordpress-seo" ) } disabled={ buttonDisabled } /> }
			learnMoreLink={ learnMoreLink }
			isBlackFridayPromotionActive={ isBlackFridayPromotionActive }
		/>
	);
};
