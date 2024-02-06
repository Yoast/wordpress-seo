import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { doAction } from "@wordpress/hooks";
import { registerPlugin } from "@wordpress/plugins";
import initializeAnalysis, { collectData } from "../initializers/analysis";
import { applyModifications, pluginReady, pluginReloaded, registerModification } from "../initializers/pluggable";
import { YoastSeoApp } from "./components/yoast-seo-app";
import { initializeStore } from "./store";
import { syncFromMetadata, syncToMetadata } from "./sync";

const PLUGIN_NAME = "yoast-seo-for-woocommerce-products";

/**
 * Initializes Yoast SEO for the WooCommerce product (block) editor.
 *
 * @returns {void}
 */
domReady( () => {
	// Initialize the global YoastSEO object.
	window.YoastSEO = window.YoastSEO || {};

	// Initialize the editor store.
	window.YoastSEO.store = initializeStore();

	// Initialize the editor data watcher.
	const productId = Number.parseInt( window.wpseoScriptData.postId, 10 );
	syncFromMetadata( productId );
	syncToMetadata( productId );
	/**
	 * Can this concept be moved to selectors or hooks? Need to find the new place for this.
	 * Basic details block is defined here: woocommerce/src/Internal/Features/ProductBlockEditor/ProductTemplates/SimpleProductTemplate.php
	 * useEntityProp( "postType", postType, "slug" )
	 */

	// Initialize the analysis pluggable.
	window.YoastSEO.pluginReady = pluginReady;
	window.YoastSEO.pluginReloaded = pluginReloaded;
	window.YoastSEO.registerModification = registerModification;
	window.YoastSEO.registerPlugin = registerPlugin;
	window.YoastSEO.applyModifications = applyModifications;

	// Initialize the analysis.
	window.YoastSEO.analysis = window.YoastSEO.analysis || {};
	window.YoastSEO.analysis.run = dispatch( "yoast-seo/editor" ).runAnalysis;
	window.YoastSEO.analysis.worker = initializeAnalysis();
	window.YoastSEO.analysis.collectData = collectData;

	// Initialize the replacement variables.
	// Initialize the used keyphrase assessment.
	// Initialize the insights.
	// Initialize focus keyphrase forms highlighting.
	// Initialize the editor integration.
	// Initialize the WordProof integration.
	// Initialize the AI generator.

	// Initialize the Yoast SEO app.
	registerPlugin( PLUGIN_NAME, {
		name: PLUGIN_NAME,
		scope: "woocommerce-product-block-editor",
		render: YoastSeoApp,
	} );

	// Offer an action after our load.
	doAction( "yoast.loaded" );
} );
