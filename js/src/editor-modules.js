import getL10nObject from "./analysis/get-l10n-object";
import getContentLocale from "./analysis/get-content-locale";
import getIndicatorForScore from "./analysis/get-indicator-for-score";
import * as constants from "./analysis/constants";
import * as refreshAnalysis from "./analysis/refresh-analysis";
import HelpLink from "./components/HelpLink";
import TopLevelProviders from "./components/TopLevelProviders";
import * as i18n from "./helpers/i18n";
import withYoastSidebarPriority from "./components/higherorder/withYoastSidebarPriority";
import * as mapResults from "./components/contentAnalysis/mapResults";
import MetaboxCollapsible from "./components/MetaboxCollapsible";
import SEMrushRelatedKeyphrases from "./containers/SEMrushRelatedKeyphrases";
import SidebarCollapsible from "./components/SidebarCollapsible";
import Results from "./containers/Results";
import createInterpolateElement from "./helpers/createInterpolateElement";
import isBlockEditor from "./helpers/isBlockEditor";
import * as replacementVariableHelpers from "./helpers/replacementVariableHelpers";
import * as location from "./components/contexts/location";
import Modal from "./components/modals/Modal";
import SidebarItem from "./components/SidebarItem";
import * as ajaxHelper from "./helpers/ajaxHelper";
import EditorModal from "./containers/EditorModal";
import ImageSelectPortal from "./components/portals/ImageSelectPortal";
import PersistentDismissableAlert from "./containers/PersistentDismissableAlert";

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
			location,
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
	},
	helpers: {
		ajaxHelper,
		createInterpolateElement,
		isBlockEditor,
		i18n,
		replacementVariableHelpers,
	},
};
