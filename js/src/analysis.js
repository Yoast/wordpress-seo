window.yoast = window.yoast || {};
import * as analysis from "yoastseo";
import getL10nObject from "./analysis/getL10nObject";
import getContentLocale from "./analysis/getContentLocale";
import { refreshDelay } from "./analysis/constants";
import { sortResultsByIdentifier } from "./analysis/refreshAnalysis";
import getIndicatorForScore from "./analysis/getIndicatorForScore";

window.yoast.analysis = analysis;
window.yoast.plugin = window.yoast.plugin || {};
window.yoast.plugin.analysis = {};
window.yoast.plugin.analysis.getL10nObject = getL10nObject;
window.yoast.plugin.analysis.getContentLocale = getContentLocale;
window.yoast.plugin.analysis.refreshDelay = refreshDelay;
window.yoast.plugin.analysis.sortResultsByIdentifier = sortResultsByIdentifier;
window.yoast.plugin.analysis.getIndicatorForScore = getIndicatorForScore;
