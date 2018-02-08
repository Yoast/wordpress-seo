import React from "react";

/**
 * The Yoast SEO traffic light icon.
 *
 * @param {object} props The props object.
 *
 * @returns {ReactElement} The svg icon.
 */
const YoastSeoIcon = ( props ) => (
	<svg { ...props } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
		<g id="BG">
			<path fill="#7EADB9" d="M500,452.3H60c-33.1,0-60-26.9-60-60v-330c0-33.1,26.9-60,60-60h380c33.1,0,60,26.9,60,60V452.3z"/>
		</g>
		<g id="BG_dark">
			<path fill="#568591" d="M500,452.3H265V2.3h175c33.1,0,60,26.9,60,60V452.3z"/>
		</g>
		<g id="bg_light">
			<path fill="#5B2942" d="M325,497.7H175c-38.5,0-70-31.5-70-70v-320c0-38.5,31.5-70,70-70h150c38.5,0,70,31.5,70,70v320
				C395,466.2,363.5,497.7,325,497.7z"/>
			<path fill="none" stroke="#7EADB9" strokeWidth="13" strokeMiterlimit="10" d="M317,471.2H183c-27.5,0-50-22.5-50-50v-307
				c0-27.5,22.5-50,50-50h134c27.5,0,50,22.5,50,50v307C367,448.7,344.5,471.2,317,471.2z"/>
		</g>
		<g id="Layer_2">
			<g>
				<g>
					<g>
						<circle fill="#F49A00" cx="250" cy="267.7" r="55"/>
						<circle fill="#ED261F" cx="250" cy="144.4" r="55"/>
						<circle fill="#77B227" cx="250" cy="391" r="55"/>
					</g>
					<g display="none">
						<path display="inline" fill="#FEC228" d="M250,320.4c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
						<path display="inline" fill="#8BDA53" d="M250,197.1c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
						<path display="inline" fill="#FF443D" d="M250,443.7c-30.4,0-55-24.6-55-55s24.6-55,55-55"/>
					</g>
					<g>
						<path fill="#FEC228" d="M222.5,315.3c-26.3-15.2-35.3-48.8-20.1-75.1c15.2-26.3,48.8-35.3,75.1-20.1"/>
						<path fill="#FF4E47" d="M222.5,192c-26.3-15.2-35.3-48.8-20.1-75.1c15.2-26.3,48.8-35.3,75.1-20.1L222.5,192z"/>
						<path fill="#9FDA4F" d="M222.5,438.7c-26.3-15.2-35.3-48.8-20.1-75.1c15.2-26.3,48.8-35.3,75.1-20.1"/>
					</g>
				</g>
			</g>
		</g>
	</svg>
);

export default YoastSeoIcon;
