import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import Wizard from "./components/wizard";

/**
 * The main App component.
 *
 * @param {Object} props The props.
 * @param {function} props.navigateWhenDone The function to call when the wizard done.
 * @param {Object} props.options The options.
 *
 * @returns {JSX.Element} The main App.
 */
export default function App( { navigateWhenDone, options } ) {
	return (
		<main className="yst-p-4 md:yst-p-8 yst-w-full yst-flex yst-flex-col yst-h-screen yst-justify-center yst-items-center">
			<Wizard navigateWhenDone={ navigateWhenDone } options={ options } />
			<button onClick={ navigateWhenDone } role="link" className="yst-skip-link yst-text-blue-700">{ __( "Skip all steps", "admin-ui" ) }</button>
		</main>
	);
}

App.propTypes = {
	navigateWhenDone: PropTypes.func,
	options: PropTypes.object,
};

App.defaultProps = {
	navigateWhenDone: () => {},
	options: {},
};
