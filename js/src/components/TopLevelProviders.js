/* External dependencies */
import PropTypes from "prop-types";
import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "styled-components";

/* Internal dependencies */
import { LocationProvider } from "../components/contexts/location";

/**
 * A collection of top level providers that are used by multiple parts of the application.
 *
 * @param {object}       store    The redux store.
 * @param {object}       theme    The styled-components theme.
 * @param {string}       location The place where the wrapped component is rendered.
 * @param {ReactElement} children The element that should be wrapped.
 *
 * @returns {ReactElement} The wrapped element.
 */
const TopLevelProviders = ( { store, theme, location, children } ) => {
	return (
		<LocationProvider value={ location }>
			<ThemeProvider theme={ theme }>
				<StoreProvider store={ store }>
					{ children }
				</StoreProvider>
			</ThemeProvider>
		</LocationProvider>
	);
};

TopLevelProviders.propTypes = {
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	location: PropTypes.oneOf( [ "sidebar", "metabox" ] ).isRequired,
	children: PropTypes.element.isRequired,
};

export default TopLevelProviders;
