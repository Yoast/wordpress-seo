/* global yoastModalConfig */
import React from "react";
import ReactDOM from "react-dom";
import ModalButtonContainer from "./components/ModalButtonContainer";

if ( window.yoastModalConfig ) {
	yoastModalConfig.forEach(
		( config ) => {
			if ( ! config.mountHook || ! config.content ) {
				return;
			}

			const element = document.querySelector( config.mountHook );

			if ( element ) {
				ReactDOM.render(
					<ModalButtonContainer { ...config } />,
					element
				);
			}
		}
	);
}
