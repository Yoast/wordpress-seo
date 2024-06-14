import propTypes from "prop-types";

/**
 * The AI Assessment Fixes button icon.
 * @param {boolean} pressed Whether the button is pressed.
 * @returns {JSX.Element} The AI Assessment Fixes button icon.
 */
export const SparklesIcon = ( { pressed = false } ) => {
	return (
		<>
			<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M3.33284 2.96991V5.63658M1.99951 4.30324H4.66618M3.99951 12.3032V14.9699M2.66618 13.6366H5.33284M8.66618 2.96991L10.19 7.54134L13.9995 8.96991L10.19 10.3985L8.66618 14.9699L7.14237 10.3985L3.33284 8.96991L7.14237 7.54134L8.66618 2.96991Z"
					stroke={ pressed ? "white" : "url(#paint0_linear_1538_754)" } strokeWidth="1.33333" strokeLinecap="round"
					strokeLinejoin="round"/>
				<defs>
					<linearGradient id="paint0_linear_1538_754" x1="1.99951" y1="2.96991" x2="15.3308" y2="4.69764"
									gradientUnits="userSpaceOnUse">
						<stop stopColor="#A61E69"/>
						<stop offset="1" stopColor="#6366F1"/>
					</linearGradient>
				</defs>
			</svg>
		</>
	);
};

SparklesIcon.propTypes = {
	pressed: propTypes.bool,
};
