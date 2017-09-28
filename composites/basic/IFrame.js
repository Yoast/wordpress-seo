import React from "react";

/**
 * Creates an IFrame component.
 *
 * @param {Object} props The props to use with the component.
 *
 * @returns {ReactElement} The rendered IFrame component.
 *
 * @constructor
 */
export default function IFrame( props ) {
	return ( <iframe { ...props } /> );
}
