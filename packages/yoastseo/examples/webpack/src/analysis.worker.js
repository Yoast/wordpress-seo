import "babel-polyfill";
import AnalysisWebWorker from "yoastsrc/worker/AnalysisWebWorker";

const worker = new AnalysisWebWorker( self );
worker.register();
