export default function( paper, researcher ) {
	const checkTextFormality = researcher.getHelper( "checkTextFormality" );
	// Not sure if we should calculate the passives in the research file or in language specific helper.
	// Not all languages might use passive constructions for calculating formality.
	const passiveSentences = researcher.getResearch( "getPassiveVoiceResult" )( paper, researcher ).total;
	const text = paper.getText();
	return checkTextFormality( text, passiveSentences );
}
