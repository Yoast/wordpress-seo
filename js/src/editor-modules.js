import getL10nObject from "./analysis/getL10nObject";
import getContentLocale from "./analysis/getContentLocale";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import * as constants from "./analysis/constants";
import * as refreshAnalysis from "./analysis/refreshAnalysis";
import HelpLink from "./components/help-link";
import TopLevelProviders from "./components/top-level-providers";
import * as i18n from "./helpers/i18n";
import withYoastSidebarPriority from "./components/higherorder/with-yoast-sidebar-priority";
import * as mapResults from "./components/contentAnalysis/map-results";
import MetaboxCollapsible from "./components/metabox-collapsible";
import SEMrushRelatedKeyphrases from "./containers/SEMrushRelatedKeyphrases";
import SidebarCollapsible from "./components/sidebar-collapsible";
import Results from "./containers/Results";
import createInterpolateElement from "./helpers/createInterpolateElement";
import isBlockEditor from "./helpers/isBlockEditor";
import * as replacementVariableHelpers from "./helpers/replacementVariableHelpers";
import * as location from "./components/contexts/location";
import Modal from "./components/modals/modal";
import SidebarItem from "./components/sidebar-item";
import * as ajaxHelper from "./helpers/ajaxHelper";
import EditorModal from "./containers/EditorModal";
import ImageSelectPortal from "./components/portals/image-select-portal";
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
