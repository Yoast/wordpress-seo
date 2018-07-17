import React from "react";
import GutenbergToggle from "../Shared/components/GutenbergToggle";

export default function CornerstoneToggle() {
	return <GutenbergToggle
		key="toggle"
		checked={ true }
		onChange={ () => {} }
		id={ "CornerstoneToggleId" }
	/>;
}

