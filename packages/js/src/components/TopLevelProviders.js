import { LocationProvider } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";

/**
 * A collection of top level providers that are used by multiple parts of the application.
 *
 * @param {object} theme    The styled-components theme.
 * @param {string} location The place where the wrapped component is rendered.
 * @param {React.ReactNode} children The content that should be wrapped.
 *
 * @returns {JSX.Element} The wrapped element.
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
	children: PropTypes.node.isRequired,
};

export default TopLevelProviders;
