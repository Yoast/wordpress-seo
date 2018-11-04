import React from "react";
import styled from "styled-components";
import { colors, SvgIcon } from "yoast-components";
import scoreToRating from "yoastsrc/interpreters/scoreToRating";


// Grid is 24px. Ensure the next item starts there.
const iconSize = "16px";
const StyledSvgIcon = styled( SvgIcon )`
	margin-right: calc( 24px - ${ iconSize } );
`;

export default function ScoreIcon( { score } ) {
	const rating = scoreToRating( score );
	let icon = "circle";
	let color = colors.$color_bad;

	switch ( rating ) {
		case "feedback":
			icon = "seo-score-none";
			color = colors.$color_score_icon;
			break;
		case "bad":
			icon = "seo-score-bad";
			color = colors.$color_bad;
			break;
		case "ok":
			icon = "seo-score-ok";
			color = colors.$color_ok;
			break;
		case "good":
			icon = "seo-score-good";
			color = colors.$color_good;
			break;
	}

	return <StyledSvgIcon
		icon={ icon }
		color={ color }
		size={ iconSize }
	/>;
}
