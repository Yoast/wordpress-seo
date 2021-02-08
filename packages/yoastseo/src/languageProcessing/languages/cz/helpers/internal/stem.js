/**
 * @author Ljiljana Dolamic  University of Neuchatel
 * -removes case endings form nouns and adjectives, possesive adj. endings from names,
 *  diminutive, augmentative, comparative suffixes and derivational suffixes from nouns,
 *  takes care of palatalisation
 */

/**
 * Removes derivational suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without derivational suffixes or the original word if no such suffix is found.
 */
const removeDerivational = function( word, morphologyData ) {
	const derivationalSuffixes = morphologyData.externalStemmer.derivationalSuffixes;
	let len = word.length;

	if ( ( len > 8 ) &&
		word.substring( len - 6, len ) === derivationalSuffixes.derivationalSuffixObinec ) {

		return word.slice( 0, -6 );
	}//len >8
	if ( len > 7 ) {
		if ( word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixIonar ) { // -ionář

			word = word.slice( 0, - 4 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvisk ||
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvstv ||
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvist ||  //-ovišt
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvnik ) { //-ovník

			return word.slice( 0, - 5 );
		}
	}//len>7
	if ( len > 6 ) {
		if ( word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixAsek || // -ásek
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixLoun ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixNost ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixTeln ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvec ||
			word.substring( len - 5, len ) === derivationalSuffixes.derivationalSuffixOvik || //-ovík
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvtv ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixOvin ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixStin ) { //-štin

			return word.slice( 0, - 4 );
		}
		if ( word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixEnic ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixInec ||
			word.substring( len - 4, len ) === derivationalSuffixes.derivationalSuffixItel ) {

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
	}//len>6
	if ( len > 5 ) {
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixArn ) { //-árn

			return word.slice( 0, - 3 );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixEnk ) { //-ěnk

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIan || //-ián
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIst ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIsk ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIstCaron || //-išt
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixItb ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixIrn ) {  //-írn

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOch ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOst ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOvn ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOun ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOut ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixOus ) {  //-ouš

			return word.slice( 0, - 3 );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixUsk ) { //-ušk

			return word.slice( 0, - 3 );
		}
		if ( word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixKyn ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixCan ||    //-čan
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixKar || //kář
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixNer || //néř
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixNik ||      //-ník
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixCtv ||
			word.substring( len - 3, len ) === derivationalSuffixes.derivationalSuffixStv  ) {

			return word.slice( 0, - 3 );
		}
	}//len>5
	if ( len > 4 ) {
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAcAccented || // -áč
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAc ||      //-ač
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAnAccented ||      //-án
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAn ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAr || //-ář
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixAs ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEc ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEn ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEnCaron ||   //-ěn
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixEr ) {  //-éř

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIr || //-íř
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIc ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIn ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixInAccented ||  //-ín
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIt ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixIv ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOb ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOt ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOv ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixOn ) { //-oň

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixUl ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixYn ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixCk || //-čk
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixCn ||  //-čn
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixDl ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixNk ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixTv ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixTk ||
			word.substring( len - 2, len ) === derivationalSuffixes.derivationalSuffixVk ) {

			return word.slice( 0, - 2 );
		}
	}//len>4
	if ( len > 3 ) {
		if ( word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixC ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixCCaron || //-č
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixK ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixL ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixN ||
			word.charAt( word.length - 1 ) === derivationalSuffixes.derivationalSuffixT ) {

			return word.slice( 0, - 1 );
		}
	}//len>3
	return word;
};

/**
 * Removes augmentative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without augmentative suffixes or the original word if no such suffix is found.
 */
const removeAugmentative = function( word, morphologyData ) {
	const augmentativeSuffixes = morphologyData.externalStemmer.augmentativeSuffixes;
	let len = word.length;

	if ( ( len > 6 ) &&
		word.substring( len - 4, len ) === augmentativeSuffixes.augmentativeSuffixAjzn ) {

		return word.slice( 0, - 4 );
	}
	if ( ( len > 5 ) &&
		( word.substring( len - 3, len ) === augmentativeSuffixes.augmentativeSuffixIzn ) ||
		word.substring( len - 3, len ) === augmentativeSuffixes.augmentativeSuffixIsk ) {

		word = word.slice( 0, - 2 );
		return palatalise( word, morphologyData );
	}
	if ( ( len > 4 ) &&
		word.substring( len - 2, len ) === augmentativeSuffixes.augmentativeSuffixAk ) { //-ák

		return word.slice( 0, - 2 );
	}
	return word;
};

/**
 * Removes diminutive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without diminutive suffixes or the original word if no such suffix is found.
 */
const removeDiminutive = function( word, morphologyData ) {
	const diminutiveSuffixes = morphologyData.externalStemmer.diminutiveSuffixes;
	let len = word.length;

	if ( ( len > 7 ) &&
		word.substring( len - 5, len ) === diminutiveSuffixes.diminutiveSuffixOusek ) {  //-oušek

		return word.slice( 0, - 5 );
	}
	if ( len > 6 ) {
		if ( word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEcek ||      //-eček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEcekAccented ||    //-éček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixIcek ||         //-iček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixIcekAccented ||    //íček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixEnekAccented ||      //-ének
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixInek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixInekAccented ) {      //-ínek

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAcekAccented || //áček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAcek ||   //aček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixOcek ||   //oček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixUcek ||   //uček
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixOnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixUnek ||
			word.substring( len - 4, len ) === diminutiveSuffixes.diminutiveSuffixAnekAccented ) {   //-ánek

			return word.slice( 0, - 4 );
		}
	}//len>6
	if ( len > 5 ) {
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEck ||   //-ečk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEckAccented ||  //-éčk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixIck ||   //-ičk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixIckAccented ||    //-íčk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEnk ||   //-enk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixEnkAccented ||  //-énk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixInk ||   //-ink
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixInkAccented ) {   //-ínk

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAckAccented ||  //-áčk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAck || //-ačk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixOck ||  //-očk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUck ||   //-učk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAnk ||
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixOnk ||
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUnk ) {

			return word.slice( 0, - 3 );

		}
		if ( word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAtk || //-átk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixAnkAccented ||  //-ánk
			word.substring( len - 3, len ) === diminutiveSuffixes.diminutiveSuffixUsk ) {   //-ušk

			return word.slice( 0, - 3 );
		}
	}//len>5
	if ( len > 4 ) {
		if ( word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixEk ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixEkAccented ||  //-ék
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixIkAccented ||  //-ík
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixIk ) {

			word = word.substring( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixAkAccented ||  //-ák
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixAk ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixOk ||
			word.substring( len - 2, len ) === diminutiveSuffixes.diminutiveSuffixUk ) {

			return word.slice( 0, - 1 );
		}
	}
	if ( ( len > 3 ) &&
		word.substring( len - 1, len ) === diminutiveSuffixes.diminutiveSuffixK ) {

		return word.slice( 0, - 1 );
	}
	return word;
};

/**
 * Removes comparative suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without comparative suffixes or the original word if no such suffix is found.
 */
const removeComparative = function( word, morphologyData ) {
	const comparativeSuffixes = morphologyData.externalStemmer.comparativeSuffixes;
	let len = word.length;

	if ( ( len > 5 ) &&
		( word.substring( len - 3, len ) ===  comparativeSuffixes.comparativeSuffixesEjs ) ||  //-ejš
		word.substring( len - 3, len ) === comparativeSuffixes.comparativeSuffixesEjsCaron ) {   //-ějš

		word = word.slice( 0, - 2 );
		return palatalise( word, morphologyData );
	}
	return word;
};

/**
 * Takes care of palatalisation.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The non-palatalised word or the original word if no such suffix is found.
 */
const palatalise = function( word, morphologyData ) {
	const palataliseSuffixes = morphologyData.externalStemmer.palataliseSuffixes;
	let len = word.length;

	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCi ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCe ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCiCaron ||      //-či
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixCeCaron ) {   //-če

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixK );
	}
	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZi ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZe ||
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZiCaron ||    //-ži
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixZeCaron ) {  //-že

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixH );
	}
	if ( word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCte ||     //-čtě
		word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCti ||   //-čti
		word.substring( len - 3, len ) === palataliseSuffixes.palataliseSuffixCtiAccented ) {   //-čtí

		return word.replace( len - 3, len, palataliseSuffixes.palataliseSuffixCk );
	}
	if ( word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixSte ||   //-ště
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixSti ||   //-šti
		word.substring( len - 2, len ) === palataliseSuffixes.palataliseSuffixStiAccented ) {  //-ští

		return word.replace( len - 2, len, palataliseSuffixes.palataliseSuffixSk );
	}
	return word.slice( 0, - 1 );
};

/**
 * Removes possessive suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without possessive suffixes or the original word if no such suffix is found.
 */
const removePossessives = function( word, morphologyData ) {
	const possessiveSuffixes = morphologyData.externalStemmer.possessiveSuffixes;
	let len = word.length;

	if ( len > 5 ) {
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixOv ) {

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixesUv ) { //-ův

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === possessiveSuffixes.possessiveSuffixIn ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
	}
	return word;
};

/**
 * Removes case suffixes.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The word without case suffixes or the original word if no such suffix is found.
 */
const removeCase = function( word, morphologyData ) {
	const caseSuffixes = morphologyData.externalStemmer.caseSuffixes;
	let len = word.length;

	if ( ( len > 7 ) &&
		word.substring( len - 5, len ) === caseSuffixes.caseSuffixAtech ) {

		return word.slice( 0, - 5 );
	}//len>7
	if ( len > 6 ) {
		if ( word.substring( len - 4, len ) === caseSuffixes.caseSuffixEtem ) {   //-ětem

			word = word.slice( 0, - 3 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 4, len ) === caseSuffixes.caseSuffixAtum ) {  //-atům
			return word.slice( 0, - 4 );
		}
	}
	if ( len > 5 ) {
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixEch ||
			word.substring( len - 3, len ) ===  caseSuffixes.caseSuffixIch ||
			word.substring( len - 3, len ) ===  caseSuffixes.caseSuffixIchAccented ) { //-ích

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixEho || //-ého
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmiCaron ||  // -ěmi
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmi ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEmuAccented ||  // -ému
			word.substring( len - 3,len ) === caseSuffixes.caseSuffixEte ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixEti ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixIho ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixIhoAccented ||  //-ího
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixImi ||  //-ími
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixImu ) {

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 3, len ) === caseSuffixes.caseSuffixAchAccented || //-ách
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAta ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAty ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixYch ||   //-ých
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAma ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixAmi ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixOve ||   //-ové
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixOvi ||
			word.substring( len - 3, len ) === caseSuffixes.caseSuffixYmi ) {  //-ými

			return word.slice( 0, - 3 );
		}
	}
	if ( len > 4 ) {
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixEm ) {

			word = word.slice( 0, - 1 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixEs ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixEmAccented ||    //-ém
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixIm ) {   //-ím

			word = word.slice( 0, - 2 );
			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixUm ) { // -ům

			return word.slice( 0, - 2 );
		}
		if ( word.substring( len - 2, len ) === caseSuffixes.caseSuffixAt ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixAm ||    //-ám
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixOs ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixUs ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixYm ||     //-ým
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixMi ||
			word.substring( len - 2, len ) === caseSuffixes.caseSuffixOu ) {

			return word.slice( 0, - 2 );
		}
	}//len>4
	if ( len > 3 ) {
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixE ||
			word.substring( len - 1, len ) ===  caseSuffixes.caseSuffixI ) {

			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixIAccented || //-é
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixECaron ) { //-ě

			return palatalise( word, morphologyData );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixU ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixY ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixURing ) { //-ů

			return word.slice( 0, - 1 );
		}
		if ( word.substring( len - 1, len ) === caseSuffixes.caseSuffixA ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixO ||
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixAAccented ||  //-á
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixEAccented ||  //-é
			word.substring( len - 1, len ) === caseSuffixes.caseSuffixYAccented ) { //-ý

			return word.slice( 0, - 1 );
		}
	}//len>3
	return word;
};

/**
 * Stems Czech words.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Czech morphology data.
 *
 * @returns {string}                The stemmed word.
 */
export default function stem( word, morphologyData ) {

	word = word.toLowerCase();
	//removes case endings from nouns and adjectives
	word = removeCase( word, morphologyData );
	//removes possessive endings from names -ov- and -in-
	word = removePossessives( word, morphologyData );
	//removes comparative endings
	word = removeComparative( word, morphologyData );
	//removes diminutive endings
	word = removeDiminutive( word, morphologyData );
	//removes augmentatives endings
	word = removeAugmentative( word, morphologyData );
	//removes derivational suffixes from nouns
	word = removeDerivational( word, morphologyData );

	return word;
}
