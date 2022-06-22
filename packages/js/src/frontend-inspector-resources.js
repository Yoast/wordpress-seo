import { ReactComponent as YoastIcon } from "../images/Yoast_icon_kader.svg";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import AnalysisCheck from "./components/AnalysisCheck";

window.yoast = window.yoast || {};

window.yoast.frontend = {
	getIndicatorForScore,
	AnalysisCheck,
	YoastIcon,
};
