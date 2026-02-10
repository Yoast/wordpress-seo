import React from "react";

/**
 *
 * @param {object} props - Props to apply to the emoji sad icon.
 * @returns {JSX.Element} The EmojiSadIcon component that displays a sad emoji icon.
 */
export const EmojiSadIcon = ( props ) => {
	return <svg
		aria-hidden="true" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"
		fill="#dc3232"
		{ ...props }
	><path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M338.2 394.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320 s86.3 19.6 114.7 53.8C376.3 390 351.7 410.5 338.2 394.2L338.2 394.2z" />
	</svg>;
};
