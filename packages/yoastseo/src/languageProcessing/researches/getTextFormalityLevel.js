export default function( paper, researcher ) {
	const checkTextFormality = researcher.getHelper( "checkTextFormality" );
	const text = paper.getText();
	return checkTextFormality( text );
}
