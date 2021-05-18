/* External dependencies */
import React from "react";
import styled from "styled-components";
import transform from "lodash/transform";

/* Internal dependencies */
import { colors } from "@yoast/style-guide";
import { SvgIcon, icons } from "@yoast/components";
import { createSvgIconComponent } from "@yoast/helpers";

/* eslint-disable quote-props, max-len */
const iconToAdd = {
	"icon-added-to-default-set": {
		viewbox: "0 0 448 512",
		path: "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z",
	},
};
/* eslint-enable */

const augmentedIcons = Object.assign( iconToAdd, icons );

/* eslint-disable quote-props, max-len */
const alternativeIcons = {
	"download": { viewbox: "0 0 512 512", path: "M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z" },
	"logout": { viewbox: "0 0 1792 1792", path: "M704 1440q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-119 0-203.5-84.5t-84.5-203.5v-704q0-119 84.5-203.5t203.5-84.5h320q13 0 22.5 9.5t9.5 22.5q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-66 0-113 47t-47 113v704q0 66 47 113t113 47h312l11.5 1 11.5 3 8 5.5 7 9 2 13.5zm928-544q0 26-19 45l-544 544q-19 19-45 19t-45-19-19-45v-288h-448q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h448v-288q0-26 19-45t45-19 45 19l544 544q19 19 19 45z" },
	"home": { viewbox: "0 0 576 512", path: "M488 312.7V456c0 13.3-10.7 24-24 24H348c-6.6 0-12-5.4-12-12V356c0-6.6-5.4-12-12-12h-72c-6.6 0-12 5.4-12 12v112c0 6.6-5.4 12-12 12H112c-13.3 0-24-10.7-24-24V312.7c0-3.6 1.6-7 4.4-9.3l188-154.8c4.4-3.6 10.8-3.6 15.3 0l188 154.8c2.7 2.3 4.3 5.7 4.3 9.3zm83.6-60.9L488 182.9V44.4c0-6.6-5.4-12-12-12h-56c-6.6 0-12 5.4-12 12V117l-89.5-73.7c-17.7-14.6-43.3-14.6-61 0L4.4 251.8c-5.1 4.2-5.8 11.8-1.6 16.9l25.5 31c4.2 5.1 11.8 5.8 16.9 1.6l235.2-193.7c4.4-3.6 10.8-3.6 15.3 0l235.2 193.7c5.1 4.2 12.7 3.5 16.9-1.6l25.5-31c4.2-5.2 3.4-12.7-1.7-16.9z" },
};
/* eslint-enable */

export const SvgIconsContainer = styled.div`
	max-width: 1024px;
	margin: 0 auto;
	padding: 16px;
	box-sizing: border-box;
	background-color: ${ colors.$color_white };

	svg {
		margin: 0 auto;
		background: ${ colors.$color_white };
	}
`;

const SingleSvgContainer = styled.span`
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	margin: 8px;
	padding: 8px;
	background: lightblue;
	text-align: center;
	background: ${ colors.$color_grey };

	span {
		white-space: nowrap;
		font-size: 12px;
	}
`;

/**
 * Returns the SvgIconsWrapper component.
 *
 * @returns {ReactElement} The SvgIconsWrapper component.
 */
export default function SvgIconsWrapper() {
	/**
	 * Returns the icons.
	 *
	 * @returns {array} result An array of SingleSvgContainer components.
	 */
	const getIcons = ( iconSet = null ) => {
		let IconComponent = SvgIcon;

		if ( iconSet ) {
			IconComponent = createSvgIconComponent( iconSet );
		} else {
			iconSet = icons;
		}

		return transform( iconSet, ( result, value, key ) => {
			let color = colors.$color_black;

			if ( key === "seo-score-ok" ) {
				color = colors.$color_ok;
			}

			if ( key === "loading-spinner" ) {
				color = colors.$color_green_medium_light;
			}

			return result.push(
				<SingleSvgContainer key={ key }>
					<IconComponent icon={ key } size="40px" color={ color } />
					<span title={ key }>{ key }</span>
				</SingleSvgContainer>
			);
		}, [] );
	};

	return (
		<SvgIconsContainer>
			<h2>Default icon set</h2>
			{ getIcons() }

			<h2>Default icon set with added icon</h2>
			{ getIcons( augmentedIcons ) }

			<h2>Alternative icon set</h2>
			{ getIcons( alternativeIcons ) }
		</SvgIconsContainer>
	);
}
