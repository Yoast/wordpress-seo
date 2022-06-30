import React from "react";

/**
 * The Yoast SEO traffic light icon.
 *
 * @param {object} props The props object.
 *
 * @returns {ReactElement} The svg icon.
 */
const YoastSeoIcon = ( props ) => (
	<svg { ...props } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 488.22">
		<path d="M80,0H420a80,80,0,0,1,80,80V500a0,0,0,0,1,0,0H80A80,80,0,0,1,0,420V80A80,80,0,0,1,80,0Z" fill="#a4286a" />
		<path d="M437.61,2,155.89,500H500V80A80,80,0,0,0,437.61,2Z" fill="#6c2548" />
		<path
			d="M74.4,337.3v34.9c21.6-.9,38.5-8,52.8-22.5s27.4-38,39.9-72.9l92.6-248H214.9L140.3,
			236l-37-116.2h-41l54.4,139.8a57.54,57.54,0,0,1,0,41.8C111.2,315.6,101.3,332.3,74.4,337.3Z"
			fill="#fff"
		/>
		<circle cx="368.33" cy="124.68" r="97.34" transform="translate(19.72 296.97) rotate(-45)" fill="#9fda4f" />
		<path d="M416.2,39.93,320.46,209.44A97.34,97.34,0,1,0,416.2,39.93Z" fill="#77b227"/>
		<path d="M294.78,254.75h0l-.15-.08-.13-.07h0a63.6,63.6,0,0,0-62.56,110.76h0l.07,0,.06,0h0a63.6,63.6,0,0,0,62.71-110.67Z" fill="#fec228" />
		<path d="M294.5,254.59,231.94,365.35A63.6,63.6,0,1,0,294.5,254.59Z" fill="#f49a00" />
		<path d="M222.31,450.07A38.16,38.16,0,0,0,203,416.83h0l0,0h0a38.18,38.18,0,1,0,19.41,33.27Z" fill="#ff4e47" />
		<path d="M202.9,416.8l-37.54,66.48A38.17,38.17,0,0,0,202.9,416.8Z" fill="#ed261f" />
	</svg>
);

export default YoastSeoIcon;
