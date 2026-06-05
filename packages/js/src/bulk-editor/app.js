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

export default App;
