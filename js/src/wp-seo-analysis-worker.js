import "babel-polyfill";
import AnalysisWebWorker from "yoastseo/src/worker/AnalysisWebWorker";

const worker = new AnalysisWebWorker( self );
worker.register();
