import { LocationConsumer, LocationContext, LocationProvider } from "../components/contexts/location";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.contexts = {
	LocationContext,
	LocationProvider,
	LocationConsumer,
};
