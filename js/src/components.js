import * as styleGuide from "@yoast/style-guide";
import * as helpers from "@yoast/helpers";
import * as componentsNew from "@yoast/components";
import * as configurationWizard from "@yoast/configuration-wizard";
import * as searchMetadataPreviews from "@yoast/search-metadata-previews";
import * as analysisReport from "@yoast/analysis-report";
// This is the only file where components is imported from the index. Everywhere else the external is used.
import * as components from "yoast-components/index";
import Collapsible from "./components/SidebarCollapsible";
import SidebarItem from "./components/SidebarItem";
import withSidebarPriority from "./components/higherorder/withYoastSidebarPriority";
import HelpLink from "./components/contentAnalysis/HelpLink";
import TopLevelProviders from "./components/TopLevelProviders";
import { getIconForScore } from "./components/contentAnalysis/mapResults";
import Results from "./components/contentAnalysis/Results";
import { LocationConsumer } from "./components/contexts/location";
import SidebarCollapsible from "./components/SidebarCollapsible";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import { setTextdomainL10n, setYoastComponentsL10n } from "./helpers/i18n";

// Don't change this order because some packages depend on each other.
window.yoast = window.yoast || {};
window.yoast.styleGuide = styleGuide;
window.yoast.helpers = helpers;
window.yoast.componentsNew = componentsNew;
window.yoast.configurationWizard = configurationWizard;
window.yoast.searchMetadataPreviews = searchMetadataPreviews;
window.yoast.analysisReport = analysisReport;
window.yoast.components = components;

window.yoast.plugin = window.yoast.plugin || {};
window.yoast.plugin.components = {};
window.yoast.plugin.components.Collapsible = Collapsible;
window.yoast.plugin.components.SidebarItem = SidebarItem;
window.yoast.plugin.components.withSidebarPriority = withSidebarPriority;
window.yoast.plugin.components.HelpLink = HelpLink;
window.yoast.plugin.components.TopLevelProviders = TopLevelProviders;
window.yoast.plugin.components.getIconForScore = getIconForScore;
window.yoast.plugin.components.Results = Results;
window.yoast.plugin.components.LocationConsumer = LocationConsumer;
window.yoast.plugin.components.SidebarCollapsible = SidebarCollapsible;

window.yoast.plugin.helpers = {};
window.yoast.plugin.helpers.isGutenbergDataAvailable = isGutenbergDataAvailable;
window.yoast.plugin.helpers.setTextdomainL10n = setTextdomainL10n;
window.yoast.plugin.helpers.setYoastComponentsL10n = setYoastComponentsL10n;
