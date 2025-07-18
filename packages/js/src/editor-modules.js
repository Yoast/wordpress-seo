import { LocationConsumer, LocationContext, LocationProvider } from "@yoast/externals/contexts";
import * as constants from "./analysis/constants";
import getContentLocale from "./analysis/getContentLocale";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import getL10nObject from "./analysis/getL10nObject";
import * as refreshAnalysis from "./analysis/refreshAnalysis";
import KeywordInput from "./components/contentAnalysis/KeywordInputComponent";
import * as mapResults from "./components/contentAnalysis/mapResults";
import HelpLink from "./components/HelpLink";
import withYoastSidebarPriority from "./components/higherorder/withYoastSidebarPriority";
import MetaboxCollapsible from "./components/MetaboxCollapsible";
import Modal from "./components/modals/Modal";
import ImageSelectPortal from "./components/portals/ImageSelectPortal";
import Portal from "./components/portals/Portal";
import ScoreIconPortal from "./components/portals/ScoreIconPortal";
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
import { setTextdomainL10n, safeCreateInterpolateElement } from "./helpers/i18n";
import isBlockEditor from "./helpers/isBlockEditor";
import * as replacementVariableHelpers from "./helpers/replacementVariableHelpers";
import { update as updateAdminBar } from "./ui/adminBar";
import { createScoresInPublishBox, scrollToCollapsible, updateScore } from "./ui/publishBox";
import { update as updateTrafficLight } from "./ui/trafficLight";
import { Introduction, SuggestionError, SparksLimitNotification, FeatureError } from "./ai-generator/components";
import { removesLocaleVariantSuffixes, fetchSuggestions } from "./ai-generator/helpers";

window.yoast = window.yoast || {};
window.yoast.editorModules = {
	analysis: {
		getL10nObject,
		getContentLocale,
		getIndicatorForScore,
		constants,
		refreshAnalysis,
	},
	aiGenerator: {
		components: {
			Introduction,
			SuggestionError,
			SparksLimitNotification,
			FeatureError,
		},
		helpers: {
			removesLocaleVariantSuffixes,
			fetchSuggestions,
		},
	},
	components: {
		HelpLink,
		TopLevelProviders,
		higherorder: {
			withYoastSidebarPriority,
		},
		contentAnalysis: {
			KeywordInput,
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
			Portal,
			ImageSelectPortal,
			ScoreIconPortal,
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
		// To support the legacy code, we need to use the old function name.
		createInterpolateElement: safeCreateInterpolateElement,
		createWatcher,
		isBlockEditor,
		i18n: {
			setTextdomainL10n,
		},
		replacementVariableHelpers,
		publishBox: {
			updateScore,
			createScoresInPublishBox,
			scrollToCollapsible,
		},
		updateAdminBar,
		updateTrafficLight,
	},
};
