import React from "react";
import InsightsSection from "./SEMRushInsights";
import KeyphraseTable from "./KeyphraseTable";
import CountrySelector from "./CountrySelector";

const RelatedKeyphrasesWrapper = ( props ) => (
	<React.Fragment>
		<CountrySelector
			{ ...props }
		/>
		<KeyphraseTable
			{ ...props }
		/>
		<InsightsSection
			title={ "Insights link will come here" }
		/>
	</React.Fragment>
);

export default RelatedKeyphrasesWrapper;
