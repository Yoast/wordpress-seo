import propTypes from "prop-types";

/**
 * The AI Assessment Fixes button icon.
 * @param {boolean} pressed Whether the button is pressed.
 * @returns {JSX.Element} The AI Assessment Fixes button icon.
 */
export const SparklesIcon = ( { pressed = false } ) => {
	return (
		<>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M3.33284 2V4.66667M1.99951 3.33333H4.66618M3.99951 11.3333V14M2.66618 12.6667H5.33284M8.66618 2L10.19 6.57143L13.9995 8L10.19 9.42857L8.66618 14L7.14237 9.42857L3.33284 8L7.14237 6.57143L8.66618 2Z"
					stroke={ pressed ? "white" : "url(#paint0_linear_1208_188)" } strokeWidth="1.33333" strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_1208_188" x1="0" y1="0" x2="16" y2="16"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#A61E69" />
						<stop offset="1" stopColor="#3B82F6" />
					</linearGradient>
				</defs>
			</svg>
		</>
	);
};

SparklesIcon.propTypes = {
	pressed: propTypes.bool,
};