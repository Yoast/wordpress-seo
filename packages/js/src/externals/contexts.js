import { LocationConsumer, LocationContext, LocationProvider } from "../components/contexts/location";
import Root, { RootContext } from "../components/contexts/root";
import useRootContext from "../components/contexts/use-root-context";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.contexts = {
	LocationContext,
	LocationProvider,
	LocationConsumer,
	RootContext,
	Root,
	useRootContext,
};
