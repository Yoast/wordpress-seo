import { LocationConsumer, LocationContext, LocationProvider } from "@yoast/externals/contexts";
import * as constants from "./analysis/constants";
import getContentLocale from "./analysis/getContentLocale";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import getL10nObject from "./analysis/getL10nObject";
import * as refreshAnalysis from "./analysis/refreshAnalysis";
import * as mapResults from "./components/contentAnalysis/mapResults";
import HelpLink from "./components/HelpLink";
import withYoastSidebarPriority from "./components/higherorder/withYoastSidebarPriority";
import MetaboxCollapsible from "./components/MetaboxCollapsible";
import Modal from "./components/modals/Modal";
import ImageSelectPortal from "./components/portals/ImageSelectPortal";
import SidebarCollapsible from "./components/SidebarCollapsible";
import SidebarItem from "./components/SidebarItem";
import TopLevelProviders from "./components/TopLevelProviders";
import EditorModal from "./containers/EditorModal";
import PersistentDismissableAlert from "./containers/PersistentDismissableAlert";
import Results from "./containers/Results";
import SEMrushRelatedKeyphrases from "./containers/SEMrushRelatedKeyphrases";
import WincherSEOPerformance from "./containers/WincherSEOPerformance";
import * as ajaxHelper from "./helpers/ajaxHelper";
import createWatcher from "./helpers/create-watcher";
import createInterpolateElement from "./helpers/createInterpolateElement";
import * as i18n from "./helpers/i18n";
import isBlockEditor from "./helpers/isBlockEditor";
import * as replacementVariableHelpers from "./helpers/replacementVariableHelpers";

window.yoast = window.yoast || {};
window.yoast.editorModules = {
	analysis: {
		getL10nObject,
		getContentLocale,
		getIndicatorForScore,
		constants,
		refreshAnalysis,
	},
	components: {
		HelpLink,
		TopLevelProviders,
		higherorder: {
			withYoastSidebarPriority,
		},
		contentAnalysis: {
			mapResults,
		},
		contexts: {
			location: {
				LocationContext,
				LocationProvider,
				LocationConsumer,
			},
		},
		SidebarItem,
		SidebarCollapsible,
		MetaboxCollapsible,
		Modal,
		portals: {
			ImageSelectPortal,
		},
	},
	containers: {
		EditorModal,
		PersistentDismissableAlert,
		Results,
		SEMrushRelatedKeyphrases,
		WincherSEOPerformance,
	},
	helpers: {
		ajaxHelper,
		createInterpolateElement,
		createWatcher,
		isBlockEditor,
		i18n,
		replacementVariableHelpers,
	},
};
