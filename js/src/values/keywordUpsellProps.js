/* global window, yoastPremiumBenefitsL10n, yoastAddKeywordModalL10n */
import React from "react";
import interpolateComponents from "interpolate-components";

import { utils } from "yoast-components";

const { makeOutboundLink } = utils;
const YesYouCanLink = makeOutboundLink();

let benefits = null;
if ( window.yoastPremiumBenefitsL10n ) {
	benefits = yoastPremiumBenefitsL10n.intl;
}

let upsellIntro = { intro: "" };
if ( window.yoastAddKeywordModalL10n ) {
	upsellIntro = yoastAddKeywordModalL10n.intl;
}

export default {
	benefits,
	infoParagraphs: [
		interpolateComponents( {
			mixedString: upsellIntro.intro,
			components: { link: <YesYouCanLink href={ upsellIntro.link } /> },
		} ),
		upsellIntro.other
	],
	buttonLink: upsellIntro.buylink,
	buttonText: upsellIntro.buy,
	buttonLabel: upsellIntro.small,
};
