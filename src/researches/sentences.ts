const getSentences = require( "../stringProcessing/getSentences" );

/**
 * @param {Paper} paper The paper to analyze.
 */
export default function( paper: any ) {
    return getSentences( paper.getText() );
}
