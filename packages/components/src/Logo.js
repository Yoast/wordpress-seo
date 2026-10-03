import React from "react";

/**
 * The Yoast logo.
 *
 * @param {object} props The props object.
 *
 * @returns {ReactElement} The svg icon.
 */
const Logo = ( props ) => (
	<svg { ...props } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 240">
		<linearGradient id="a" gradientUnits="userSpaceOnUse" x1="476.05" y1="194.48" x2="476.05" y2="36.513">
			<stop offset="0" style={ { stopColor: "#570732" } } />
			<stop offset=".038" style={ { stopColor: "#610b39" } } />
			<stop offset=".155" style={ { stopColor: "#79164b" } } />
			<stop offset=".287" style={ { stopColor: "#8c1e59" } } />
			<stop offset=".44" style={ { stopColor: "#9a2463" } } />
			<stop offset=".633" style={ { stopColor: "#a22768" } } />
			<stop offset="1" style={ { stopColor: "#a4286a" } } />
		</linearGradient>
		<path fill="url(#a)" d="M488.7 146.1v-56h20V65.9h-20V36.5h-30.9v29.3h-15.7v24.3h15.7v52.8c0 30 20.9 47.8 43 51.5l9.2-24.8c-12.9-1.6-21.2-11.2-21.3-23.5z" />
		<linearGradient id="b" gradientUnits="userSpaceOnUse" x1="287.149" y1="172.553" x2="287.149" y2="61.835">
			<stop offset="0" style={ { stopColor: "#570732" } } />
			<stop offset=".038" style={ { stopColor: "#610b39" } } />
			<stop offset=".155" style={ { stopColor: "#79164b" } } />
			<stop offset=".287" style={ { stopColor: "#8c1e59" } } />
			<stop offset=".44" style={ { stopColor: "#9a2463" } } />
			<stop offset=".633" style={ { stopColor: "#a22768" } } />
			<stop offset="1" style={ { stopColor: "#a4286a" } } />
		</linearGradient>
		<path fill="url(#b)" d="M332.8 137.3V95.2c0-1.5-.1-3-.2-4.4-2.7-34-51-33.9-88.3-20.9L255 91.7c24.3-11.6 38.9-8.6 44-2.9l.4.4v.1c2.6 3.5 2 9 2 13.4-31.8 0-65.7 4.2-65.7 39.1 0 26.5 33.2 43.6 68 18.3l5.2 12.4h29.8c-2.8-14.5-5.9-27-5.9-35.2zm-31.2-.3c-24.5 27.4-46.9 1.6-23.9-9.6 6.8-2.3 15.9-2.4 23.9-2.4v12z" />
		<linearGradient id="c" gradientUnits="userSpaceOnUse" x1="390.54" y1="172.989" x2="390.54" y2="61.266">
			<stop offset="0" style={ { stopColor: "#570732" } } />
			<stop offset=".038" style={ { stopColor: "#610b39" } } />
			<stop offset=".155" style={ { stopColor: "#79164b" } } />
			<stop offset=".287" style={ { stopColor: "#8c1e59" } } />
			<stop offset=".44" style={ { stopColor: "#9a2463" } } />
			<stop offset=".633" style={ { stopColor: "#a22768" } } />
			<stop offset="1" style={ { stopColor: "#a4286a" } } />
		</linearGradient>
		<path fill="url(#c)" d="M380.3 92.9c0-10.4 16.6-15.2 42.8-3.3l9.1-22C397 57 348.9 56 348.6 92.8c-.1 17.7 11.2 27.2 27.5 33.2 11.3 4.2 27.6 6.4 27.6 15.4-.1 11.8-25.3 13.6-48.4-2.3l-9.3 23.8c31.4 15.6 89.7 16.1 89.4-23.1-.4-38.5-55.1-31.9-55.1-46.9z" />
		<linearGradient id="d" gradientUnits="userSpaceOnUse" x1="76.149" y1="3.197" x2="76.149" y2="178.39">
			<stop offset="0" style={ { stopColor: "#77b227" } } />
			<stop offset=".467" style={ { stopColor: "#75b027" } } />
			<stop offset=".635" style={ { stopColor: "#6eab27" } } />
			<stop offset=".755" style={ { stopColor: "#63a027" } } />
			<stop offset=".852" style={ { stopColor: "#529228" } } />
			<stop offset=".934" style={ { stopColor: "#3c7f28" } } />
			<stop offset="1" style={ { stopColor: "#246b29" } } />
		</linearGradient>
		<path fill="url(#d)" d="M108.2 9.2L63.4 133.6 41.9 66.4H10l35.7 91.8c3 7.8 3 16.5 0 24.3-4 10.2-10.6 19-26.8 21.2v27.2c31.5 0 48.6-19.4 63.8-61.9L142.3 9.2h-34.1z" />
		<linearGradient id="e" gradientUnits="userSpaceOnUse" x1="175.228" y1="172.923" x2="175.228" y2="62.17">
			<stop offset="0" style={ { stopColor: "#570732" } } />
			<stop offset=".038" style={ { stopColor: "#610b39" } } />
			<stop offset=".155" style={ { stopColor: "#79164b" } } />
			<stop offset=".287" style={ { stopColor: "#8c1e59" } } />
			<stop offset=".44" style={ { stopColor: "#9a2463" } } />
			<stop offset=".633" style={ { stopColor: "#a22768" } } />
			<stop offset="1" style={ { stopColor: "#a4286a" } } />
		</linearGradient>
		<path fill="url(#e)" d="M175.2 62.2c-38.6 0-54 27.3-54 56.2 0 30 15.1 54.6 54 54.6 38.7 0 54.1-27.6 54-54.6-.1-33-16.8-56.2-54-56.2zm0 87.1c-15.7 0-23.4-11.7-23.4-30.9s8.3-32.9 23.4-32.9c15 0 23.2 13.7 23.2 32.9s-7.5 30.9-23.2 30.9z" />
	</svg>
);

export default Logo;
