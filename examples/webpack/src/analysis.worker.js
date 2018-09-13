import "babel-polyfill";
import AnalysisWebWorker from "../../../src/worker/AnalysisWebWorker";

const worker = new AnalysisWebWorker( self );
worker.register();
