import { register } from "@wordpress/data";
import { identity } from "lodash";
import createSeoStore from "./store";

export { STORE_NAME as SEO_STORE_NAME } from "./constants";

export { default as useAnalyze } from "./hooks/use-analyze";

const registerSeoStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	register( createSeoStore( { analyze, preparePaper, processResults } ) );
