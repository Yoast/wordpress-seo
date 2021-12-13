import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { LocationProvider } from "@yoast/externals/contexts";

/**
 * A collection of top level providers that are used by multiple parts of the application.
 *
 * @param {Object} props The props.
 * @param {object} props.theme    The styled-components theme.
 * @param {string} props.location The place where the wrapped component is rendered.
 * @param {wp.Element} props.children The element that should be wrapped.
 *
 * @returns {wp.Element} The wrapped element.
 */
const TopLevelProviders = ( { theme, location, children } ) => {
	return (
		<LocationProvider value={ location }>
			<ThemeProvider theme={ theme }>
				{ children }
			</ThemeProvider>
		</LocationProvider>
	);
};

TopLevelProviders.propTypes = {
	theme: PropTypes.object.isRequired,
	location: PropTypes.oneOf( [ "sidebar", "metabox", "modal" ] ).isRequired,
	children: PropTypes.element.isRequired,
};

export default TopLevelProviders;
