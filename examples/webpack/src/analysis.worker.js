import "babel-polyfill";
import AnalysisWebWorker from "yoastseo/worker/AnalysisWebWorker";

const worker = new AnalysisWebWorker( self );
worker.register();
