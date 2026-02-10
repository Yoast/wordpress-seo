import React from "react";

/**
 *
 * @param {object} props - Props to apply to the emoji neutral icon.
 * @returns {JSX.Element} The EmojiNeutralIcon component that displays a neutral emoji icon.
 */
export const EmojiNeutralIcon = ( props ) => (
	<svg
		aria-hidden="true" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"
		fill="#ee7c1b"
		{ ...props }
	>
		<path d="M248 8c137 0 248 111 248 248S385 504 248 504S0 393 0 256S111 8 248 8z M360 208c0-17.7-14.3-32-32-32 s-32 14.3-32 32s14.3 32 32 32S360 225.7 360 208z M344 368c21.2 0 21.2-32 0-32H152c-21.2 0-21.2 32 0 32H344z M200 208 c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32S200 225.7 200 208z" />
	</svg>
);
