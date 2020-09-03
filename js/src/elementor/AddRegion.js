import PanelSeoView from "./PanelSeoView";

export default ( regions ) => {
	console.log( "add region", regions );
	regions.yoast = {
		region: regions.global.region,
		view: PanelSeoView,
		options: {},
	};

	return regions;
};
