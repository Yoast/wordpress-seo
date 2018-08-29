import "babel-polyfill";
import AnalysisWebWorker from "yoastseo/js/worker/AnalysisWebWorker";

const worker = new AnalysisWebWorker( self );
worker.register();
