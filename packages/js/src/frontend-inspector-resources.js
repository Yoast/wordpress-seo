import { renderReactRoot } from "./helpers/reactRoot";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import AnalysisCheck from "./components/AnalysisCheck";
import { ReactComponent as YoastIcon } from "../images/Yoast_icon_kader.svg";

window.yoast = window.yoast || {};

window.yoast.frontend = {
	renderReactRoot,
	getIndicatorForScore,
	AnalysisCheck,
	YoastIcon,
};
