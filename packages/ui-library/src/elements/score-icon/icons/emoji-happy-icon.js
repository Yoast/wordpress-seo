import React from "react";

/**
 *
 * @param {object} props - Props to apply to the emoji happy icon.
 * @returns {JSX.Element} The EmojiHappyIcon component that displays a happy emoji icon.
 */
export const EmojiHappyIcon = ( props ) => {
	return <svg
		xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#008a00" { ...props }
	>
		<path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M362.8 346.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5c22.4 26.9 55.2 42.2 90.2 42.2 s67.8-15.4 90.2-42.2C351.6 309.5 376.3 329.9 362.8 346.2L362.8 346.2z" />
	</svg>;
};
