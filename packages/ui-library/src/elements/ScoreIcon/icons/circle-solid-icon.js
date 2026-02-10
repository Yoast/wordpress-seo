import React from "react";

/**
 *
 * @param {object} props - Props to apply to the circle icon.
 * @returns {JSX.Element} The CircleSolidIcon component that displays a solid circle icon.
 */
export const CircleSolidIcon = ( props ) => {
	return <svg
		xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" { ...props }
	>
		<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
	</svg>;
};
