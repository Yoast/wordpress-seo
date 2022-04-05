// AR: Arabic papers
import arabicPaper from "./ar/arabicPaper";

// CA: Catalan papers
import catalanPaper from "./ca/catalanPaper";

// CS: Czech papers
import czechPaper from "./cs/czechPaper";

// DE: German papers
import germanPaper from "./de/germanPaper";

// EL: Greek paper
import greekPaper from "./el/greekPaper";

// EN: English papers
import englishPaper from "./en/englishPaper";

// ES: Spanish papers
import spanishPaper from "./es/spanishPaper";

// FA: Farsi papers
import farsiPaper from "./fa/farsiPaper";

// FR: French papers
import frenchPaper from "./fr/frenchPaper";
// Import frenchPaper1 from "./fr/frenchPaper1";

// HE: Hebrew papers
import hebrewPaper from "./he/hebrewPaper";

// HU: Hungarian papers
import hungarianPaper from "./hu/hungarianPaper";

// ID: Indonesian papers
import indonesianPaper from "./id/indonesianPaper";

// IT: Italian papers
import italianPaper from "./it/italianPaper";

// JA: Japanese paper
import japanesePaper from "./ja/japanesePaper";

// NB: Norwegian papers
import norwegianPaper from "./nb/norwegianPaper";

// NL: Dutch papers
import dutchPaper from "./nl/dutchPaper";

// PL: Polish papers
import polishPaper from "./pl/polishPaper";

// PT: Portuguese papers
import portuguesePaper from "./pt/portuguesePaper";
// Import portuguesePaper3 from "./pt/portuguesePaper3";

// RU: Russian papers
import russianPaper from "./ru/russianPaper";

// SK: Slovak papers
import slovakPaper from "./sk/slovakPaper";

// SV: Swedish papers
import swedishPaper from "./sv/swedishPaper";

// TR: Turkish papers
import turkishPaper from "./tr/turkishPaper";

// Papers for comparing performance of stemmers in different languages in the content analysis app.
import englishPaperForPerformanceTest from "./en/englishPaperForPerformanceTest";
import spanishPaperForPerformanceTest from "./es/spanishPaperForPerformanceTest";
import polishPaperForPerformanceTest from "./pl/polishPaperForPerformanceTest";

/**
 * FrenchPaper1 & portuguesePaper3 are temporarily disabled until we figure out why there are small differences
 * in passive voice detection since upgrading from node v10 to the lts version.
 * Once the node version issue is solved, these two papers should be removed.
 */
export default [
	englishPaper,
	arabicPaper,
	catalanPaper,
	czechPaper,
	germanPaper,
	greekPaper,
	spanishPaper,
	farsiPaper,
	frenchPaper,
	hebrewPaper,
	hungarianPaper,
	indonesianPaper,
	italianPaper,
	japanesePaper,
	norwegianPaper,
	dutchPaper,
	polishPaper,
	portuguesePaper,
	russianPaper,
	slovakPaper,
	swedishPaper,
	turkishPaper,
	englishPaperForPerformanceTest,
	spanishPaperForPerformanceTest,
	polishPaperForPerformanceTest,
	// FrenchPaper1,
	// PortuguesePaper3
];

