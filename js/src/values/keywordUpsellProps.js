/* global window, yoastPremiumBenefitsL10n, wpseoPostScraperL10n */
import React from "react";
import interpolateComponents from "interpolate-components";

import { utils } from "yoast-components";

const { makeOutboundLink } = utils;
const YesYouCanLink = makeOutboundLink();

let benefits = null;
if ( window.yoastPremiumBenefitsL10n ) {
	benefits = yoastPremiumBenefitsL10n.intl;
}

const upsellIntro = wpseoPostScraperL10n.addKeywordUpsell;

export default {
	benefits,
	infoParagraphs: [
		interpolateComponents( {
			mixedString: upsellIntro.intro,
			components: { link: <YesYouCanLink href={ upsellIntro.link } /> },
		} ),
		upsellIntro.other,
	],
	buttonLink: upsellIntro.buylink,
	buttonText: upsellIntro.buy,
	buttonLabel: upsellIntro.small,
};
