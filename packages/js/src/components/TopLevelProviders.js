import { LocationProvider } from "@yoast/externals/contexts";
import { ThemeProvider } from "styled-components";

/**
 * A collection of top level providers that are used by multiple parts of the application.
 *
 * @param {Object} props Component props.
 * @param {Object} props.theme The styled-components theme.
 * @param {("sidebar"|"metabox"|"modal")} props.location The place where the wrapped component is rendered.
 * @param {React.ReactNode} props.children The content that should be wrapped.
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

export default TopLevelProviders;
