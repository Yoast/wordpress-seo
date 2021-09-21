import initialize from "../src";
import exampleConfig from "../qa/example-config";
import "./index.css";

const app = initialize( exampleConfig );

// // Register a nav group via global API before render
// window.yoast.navigation.registerGroup( {
// 	icon: () => "icon",
// 	label: "Pre-render nav group",
// 	key: "pre-render-nav-group",
// 	priority: 90,
// 	isDefaultOpen: true,
// 	children: [
// 		{
// 			label: "First child",
// 			target: "child-target-1",
// 			key: "child-key-1",
// 			priority: 99,
// 			component: () => "renderstuff for the first child",
// 			props: {
// 				contentType: { label: "First child label" },
// 			},
// 		},
// 	],
// } );

app.render( document.getElementById( "app" ) );
