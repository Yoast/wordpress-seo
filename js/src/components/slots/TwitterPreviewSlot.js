import { Slot } from "@wordpress/components";
import React from "react";

/**
 * Renders a slot for the Twitter preview.
 *
 * @returns {null|ReactElement} The element.
 */
export default function TwitterPreviewSlot() {
	return ( <Slot name="YoastTwitterPreview" /> );
}
