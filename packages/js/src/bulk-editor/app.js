import PropTypes from "prop-types";
import { PlaceholderPage } from "./components";

/**
 * The bulk editor app.
 *
 * @param {import("./services").DataProvider} dataProvider The data provider.
 * @param {import("@yoast/dashboard-frontend").RemoteDataProvider} remoteDataProvider The remote data provider.
 *
 * @returns {JSX.Element} The app.
 */
const App = ( { dataProvider } ) => {
	return <PlaceholderPage dataProvider={ dataProvider } />;
};

App.propTypes = {
	dataProvider: PropTypes.object.isRequired,
};

export default App;
