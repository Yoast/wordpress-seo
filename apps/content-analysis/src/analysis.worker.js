import "babel-polyfill";
import { AnalysisWebWorker } from "yoastseo";

const worker = new AnalysisWebWorker( self );
worker.register();
