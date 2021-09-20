/**
 * Score icon for a certain result.
 *
 * @param {number} score The score for which to return the icon and color.
 *
 * @returns {JSX.Element} The icon with a color for the score.
 */
export default function ScoreIcon( { score } ) {
	if ( score > 7 ) {
		return <svg
			aria-hidden="true"
			role="img" focusable="false"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 496 512" fill="#008a00"
			className="yst-h-4 yst-w-4 yst-mr-2"
		>
			<path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M362.8 346.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5c22.4 26.9 55.2 42.2 90.2 42.2 s67.8-15.4 90.2-42.2C351.6 309.5 376.3 329.9 362.8 346.2L362.8 346.2z" />
		</svg>;
	} else if ( score > 4 && score <= 7 ) {
		return <svg
			aria-hidden="true"
			role="img"
			focusable="false"
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#ee7c1b"
			className="yst-h-4 yst-w-4 yst-mr-2"
		>
			<path d="M248 8c137 0 248 111 248 248S385 504 248 504S0 393 0 256S111 8 248 8z M360 208c0-17.7-14.3-32-32-32 s-32 14.3-32 32s14.3 32 32 32S360 225.7 360 208z M344 368c21.2 0 21.2-32 0-32H152c-21.2 0-21.2 32 0 32H344z M200 208 c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32S200 225.7 200 208z" />
		</svg>;
	} else if ( score === 0 ) {
		return <svg
			aria-hidden="true"
			role="img"
			focusable="false"
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#a0a5aa"
			className="yst-h-4 yst-w-4 yst-mr-2"
		>
			<path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z" />
		</svg>;
	} else if ( score <= 4 ) {
		return <svg
			aria-hidden="true"
			role="img"
			focusable="false"
			xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="#dc3232"
			className="yst-h-4 yst-w-4 yst-mr-2"
		>
			<path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M338.2 394.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320 s86.3 19.6 114.7 53.8C376.3 390 351.7 410.5 338.2 394.2L338.2 394.2z" />
		</svg>;
	}
}
