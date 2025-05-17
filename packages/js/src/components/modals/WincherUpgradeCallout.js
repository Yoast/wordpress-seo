/* global wpseoAdminGlobalL10n */

/* External dependencies */
import styled from "styled-components";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";

/* Yoast dependencies */
import { SvgIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import { checkLimit, getUpgradeCampaign } from "../../helpers/wincherEndpoints";

const USAGE_UPGRADE_THRESHOLD = 0.8;

const TitleContainer = styled.p`
	color: ${ colors.$color_pink_dark };
	font-size: 14px;
	font-weight: 700;
	margin: 13px 0 10px;
`;

const TitleIcon = styled( SvgIcon )`
	margin-right: 5px;
	vertical-align: middle;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 9px;
	right: 9px;
	border: none;
    background: none;
    cursor: pointer;
`;

const DescriptionContainer = styled.p`
	font-size: 13px;
	font-weight: 500;
	margin: 10px 0 13px;
`;

const CalloutContainer = styled.div`
	position: relative;
	background: ${ props => props.isTitleShortened ? "#F5F7F7" : "transparent" };
	border: 1px solid #C7C7C7;
	border-left: 4px solid${ colors.$color_pink_dark };
	padding: 0 16px;
	margin-bottom: 1.5em;
`;

/**
 * Hook to fetch the account tracking info.
 *
 * @param {boolean} isLoggedIn Whether the use is logged in.
 *
 * @returns {object} The Wincher account tracking info.
 */
export const useTrackingInfo = ( isLoggedIn ) => {
	const [ trackingInfo, setTrackingInfo ] = useState( null );

	useEffect( ()=>{
		if ( isLoggedIn && ! trackingInfo ) {
			checkLimit().then( data => setTrackingInfo( data ) );
		}
	}, [ trackingInfo ] );

	return trackingInfo;
};

useTrackingInfo.propTypes = {
	limit: PropTypes.bool.isRequired,
};

/**
 * Hook to fetch the upgrade campaign.
 *
 * @returns {object | null} The upgrade campaign.
 */
const useUpgradeCampaign = () => {
	const [ upgradeCampaign, setUpgradeCampaign ] = useState( null );

	useEffect( ()=>{
		if ( ! upgradeCampaign ) {
			getUpgradeCampaign().then( data => setUpgradeCampaign( data ) );
		}
	}, [ upgradeCampaign ] );

	return upgradeCampaign;
};

/**
 * Displays the wincher upgrade callout title.
 *
 * @param {number} limit The account keywords limit.
 * @param {number} usage The account tracked keywords.
 * @param {boolean} isTitleShortened Whether the title is shortened.
 *
 * @returns {wp.Element | null} The Wincher upgrade callout title.
 */
const WincherUpgradeCalloutTitle = ( { limit, usage, isTitleShortened, isFreeAccount } ) => {
	const freeExtended = sprintf(
		/* Translators: %1$s expands to the number of used keywords.
		 * %2$s expands to the account keywords limit.
		 */
		__(
			"Your are tracking %1$s out of %2$s keyphrases included in your free account.",
			"wordpress-seo"
		),
		usage,
		limit
	);

	const paidExtended = sprintf(
		/* Translators: %1$s expands to the number of used keywords.
		 * %2$s expands to the account keywords limit.
		 */
		__(
			"Your are tracking %1$s out of %2$s keyphrases included in your account.",
			"wordpress-seo"
		),
		usage,
		limit
	);

	const extended = isFreeAccount ? freeExtended : paidExtended;

	const shortened = sprintf(
		/* Translators: %1$s expands to the number of used keywords.
		 * %2$s expands to the account keywords limit.
		 */
		__(
			"Keyphrases tracked: %1$s/%2$s",
			"wordpress-seo"
		),
		usage,
		limit
	);

	const title = isTitleShortened ? shortened : extended;

	return (
		<TitleContainer>
			{ isTitleShortened && <TitleIcon icon="exclamation-triangle" color={ colors.$color_pink_dark } size="14px" /> }
			{ title }
		</TitleContainer>
	);
};

WincherUpgradeCalloutTitle.propTypes = {
	limit: PropTypes.number.isRequired,
	usage: PropTypes.number.isRequired,
	isTitleShortened: PropTypes.bool,
	isFreeAccount: PropTypes.bool,
};

const WincherAccountUpgradeLink = makeOutboundLink();

/**
 * Displays the wincher upgrade callout description.
 *
 * @param {number} discount The upgrade discount value.
 * @param {number} months The upgrade discount duration.
 *
 * @returns {wp.Element | null} The Wincher upgrade callout description.
 */
const WincherUpgradeCalloutDescription = ( { discount, months } ) => {
	const wincherAccountUpgradeLink = (
		<WincherAccountUpgradeLink href={ wpseoAdminGlobalL10n[ "links.wincher.upgrade" ] } style={ { fontWeight: 600 } }>
			{
				sprintf(
					/* Translators: %s : Expands to "Wincher". */
					__( "Click here to upgrade your %s plan", "wordpress-seo" ),
					"Wincher"
				)
			}
		</WincherAccountUpgradeLink>
	);

	if ( ! discount || ! months ) {
		return <DescriptionContainer>
			{ wincherAccountUpgradeLink }
		</DescriptionContainer>;
	}

	const discountPercentage = discount * 100;
	const description = sprintf(
		/* Translators: %1$s expands to upgrade account link.
		 * %2$s expands to the upgrade discount value.
		 * %3$s expands to the upgrade discount duration e.g. 2 months.
		 */
		__(
			"%1$s and get an exclusive %2$s discount for %3$s month(s).",
			"wordpress-seo"
		),
		"{{wincherAccountUpgradeLink/}}",
		discountPercentage + "%",
		months
	);

	return <DescriptionContainer>
		{
			interpolateComponents( {
				mixedString: description,
				components: {
					wincherAccountUpgradeLink,
				},
			} )
		}
	</DescriptionContainer>;
};

WincherUpgradeCalloutDescription.propTypes = {
	discount: PropTypes.number,
	months: PropTypes.number,
};

/**
 * Displays a wincher upgrade callout.
 *
 * @param {Function} onClose The close callback.
 * @param {boolean} isTitleShortened Whether the title is shortened.
 *
 * @returns {wp.Element | null} The Wincher upgrade callout.
 */
const WincherUpgradeCallout = ( { onClose, isTitleShortened, trackingInfo } ) => {
	const upgradeCampaign = useUpgradeCampaign();

	if ( trackingInfo === null ) {
		return null;
	}

	const { limit, usage } = trackingInfo;
	const displayUpgradeCallout = limit && ( usage / limit ) >= USAGE_UPGRADE_THRESHOLD;

	if ( ! displayUpgradeCallout ) {
		return null;
	}

	// Wincher API returns an upgrade campaign only for free accounts.
	const isFreeAccount = Boolean( upgradeCampaign?.discount );

	return (
		<CalloutContainer isTitleShortened={ isTitleShortened }>
			{ onClose && (
				<CloseButton type="button" aria-label={ __( "Close the upgrade callout", "wordpress-seo" ) } onClick={ onClose }>
					<SvgIcon icon="times-circle" color={ colors.$color_pink_dark } size="14px" />
				</CloseButton>
			) }

			<WincherUpgradeCalloutTitle { ...trackingInfo } isTitleShortened={ isTitleShortened } isFreeAccount={ isFreeAccount } />

			<WincherUpgradeCalloutDescription discount={ upgradeCampaign?.discount } months={ upgradeCampaign?.months } />
		</CalloutContainer>
	);
};

WincherUpgradeCallout.propTypes = {
	onClose: PropTypes.func,
	isTitleShortened: PropTypes.bool,
	trackingInfo: PropTypes.object,
};

export default WincherUpgradeCallout;
