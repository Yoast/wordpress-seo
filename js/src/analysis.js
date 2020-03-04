window.yoast = window.yoast || {};
// This is the only file where yoastseo is imported from the index. Everywhere else the external is used.
import * as analysis from "yoastseo/index";
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
