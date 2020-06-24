/* global yoastModalConfig */
import { render } from "@wordpress/element";
import ModalButtonContainer from "./components/ModalButtonContainer";

if ( window.yoastModalConfig ) {
	yoastModalConfig.forEach(
		( config ) => {
			if ( ! config.mountHook || ! config.content ) {
				return;
			}

			const element = document.querySelector( config.mountHook );

			if ( element ) {
				render(
					<ModalButtonContainer { ...config } />,
					element
				);
			}
		}
	);
}
