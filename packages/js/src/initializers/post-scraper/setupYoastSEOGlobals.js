import { App } from "yoastseo";
import { debounce, isUndefined } from "lodash";
import { select } from "@wordpress/data";
import { createAnalysisWorker } from "../../analysis/worker";
import collectAnalysisData from "../../analysis/collectAnalysisData";
import getApplyMarks from "../../analysis/getApplyMarks";
import refreshAnalysis from "../../analysis/refreshAnalysis";
import Pluggable from "../../lib/Pluggable";
import handleWorkerError from "../../analysis/handleWorkerError";
import { refreshDelay } from "../../analysis/constants";

/**
 * Sets up the window.YoastSEO namespace, creates the App instance, and wires all
 * app-level overwrites (Pluggable, refresh, analysis worker, etc.).
 *
 * @param {Object} appArgs            The arguments for the App constructor.
 * @param {Object} store              The Yoast SEO Redux store.
 * @param {Object} editorData         The editor data.
 * @param {Object} customAnalysisData The custom analysis data collector.
 * @param {Object} postDataCollector  The PostDataCollector instance.
 *
 * @returns {Object} The created App instance.
 */
export function setupYoastSEOGlobals( appArgs, store, editorData, customAnalysisData, postDataCollector ) {
	const app = new App( appArgs );

	// Content analysis.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO.app = app;
	window.YoastSEO.store = store;
	window.YoastSEO.analysis = {};
	window.YoastSEO.analysis.worker = createAnalysisWorker();
	window.YoastSEO.analysis.collectData = () => collectAnalysisData(
		editorData,
		store,
		customAnalysisData,
		app.pluggable,
		select( "core/block-editor" ),
		select( "core/editor" )
	);
	window.YoastSEO.analysis.applyMarks = ( paper, marks ) => getApplyMarks()( paper, marks );

	// YoastSEO.app overwrites.
	window.YoastSEO.app.refresh = debounce( () => refreshAnalysis(
		window.YoastSEO.analysis.worker,
		window.YoastSEO.analysis.collectData,
		window.YoastSEO.analysis.applyMarks,
		store,
		postDataCollector
	), refreshDelay );
	window.YoastSEO.app.registerCustomDataCallback = customAnalysisData.register;
	window.YoastSEO.app.pluggable = new Pluggable( window.YoastSEO.app.refresh );
	window.YoastSEO.app.registerPlugin = window.YoastSEO.app.pluggable._registerPlugin;
	window.YoastSEO.app.pluginReady = window.YoastSEO.app.pluggable._ready;
	window.YoastSEO.app.pluginReloaded = window.YoastSEO.app.pluggable._reloaded;
	window.YoastSEO.app.registerModification = window.YoastSEO.app.pluggable._registerModification;
	window.YoastSEO.app.registerAssessment = ( name, assessment, pluginName ) => {
		if ( ! isUndefined( app.seoAssessor ) ) {
			return window.YoastSEO.app.pluggable._registerAssessment( app.defaultSeoAssessor, name, assessment, pluginName ) &&
				window.YoastSEO.app.pluggable._registerAssessment( app.cornerStoneSeoAssessor, name, assessment, pluginName );
		}
	};
	window.YoastSEO.app.changeAssessorOptions = function( assessorOptions ) {
		window.YoastSEO.analysis.worker.initialize( assessorOptions ).catch( handleWorkerError );
		window.YoastSEO.app.refresh();
	};

	// Backwards compatibility.
	window.YoastSEO.analyzerArgs = appArgs;

	return app;
}
