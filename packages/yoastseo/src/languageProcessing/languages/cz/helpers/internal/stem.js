/**
 * @author Ljiljana Dolamic  University of Neuchatel
 * -removes case endings form nouns and adjectives, possesive adj. endings from names,
 *  diminutive, augmentative, comparative suffixes and derivational suffixes from nouns,
 *  takes care of palatalisation
 */
(function (factory) {
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined' && typeof require !== 'undefined') {
		// CommonJS
		module.exports = factory(require('./stringbuffer'));
	} else {
		// running in browser
		window.czech_stem = factory(StringBuffer);
	}
})(function(StringBuffer) {

	function stem(input){

		var sb = new StringBuffer();

		input=input.toLowerCase();
		//reset string buffer
		sb.delete(0,sb.length());
		sb.insert(0,input);
		// stemming...
		//removes case endings from nouns and adjectives
		removeCase(sb);
		//removes possesive endings from names -ov- and -in-
		removePossessives(sb);
		//removes comparative endings
		removeComparative(sb);
		//removes diminutive endings
		removeDiminutive(sb);
		//removes augmentatives endings
		removeAugmentative(sb);
		//removes derivational sufixes from nouns
		removeDerivational(sb);

		result = sb.toString();
		return result;
	}

	function removeDerivational(buffer) {
		var len=buffer.length();
		//
		if( (len > 8 )&&
			buffer.substring( len-6 ,len).equals("obinec")){

			buffer.delete( len- 6 , len);
			return;
		}//len >8
		if(len > 7){
			if(buffer.substring( len-5 ,len).equals("ion\u00e1\u0159")){ // -ionář

				buffer.delete( len- 4 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-5 ,len).equals("ovisk")||
				buffer.substring( len-5 ,len).equals("ovstv")||
				buffer.substring( len-5 ,len).equals("ovi\u0161t")||  //-ovišt
				buffer.substring( len-5 ,len).equals("ovn\u00edk")){ //-ovník

				buffer.delete( len- 5 , len);
				return;
			}
		}//len>7
		if(len > 6){
			if(	buffer.substring( len-4 ,len).equals("\u00e1sek")|| // -ásek
				buffer.substring( len-4 ,len).equals("loun")||
				buffer.substring( len-4 ,len).equals("nost")||
				buffer.substring( len-4 ,len).equals("teln")||
				buffer.substring( len-4 ,len).equals("ovec")||
				buffer.substring( len-5 ,len).equals("ov\u00edk")|| //-ovík
				buffer.substring( len-4 ,len).equals("ovtv")||
				buffer.substring( len-4 ,len).equals("ovin")||
				buffer.substring( len-4 ,len).equals("\u0161tin")){ //-štin

				buffer.delete( len- 4 , len);
				return;
			}
			if(buffer.substring( len-4 ,len).equals("enic")||
				buffer.substring( len-4 ,len).equals("inec")||
				buffer.substring( len-4 ,len).equals("itel")){

				buffer.delete( len- 3 , len);
				palatalise(buffer);
				return;
			}
		}//len>6
		if(len > 5){
			if(buffer.substring( len-3 ,len).equals("\u00e1rn")){ //-árn

				buffer.delete( len- 3 , len);
				return;
			}
			if(buffer.substring( len-3 ,len).equals("\u011bnk")){ //-ěnk

				buffer.delete( len- 2 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-3 ,len).equals("i\u00e1n")|| //-ián
				buffer.substring( len-3 ,len).equals("ist")||
				buffer.substring( len-3 ,len).equals("isk")||
				buffer.substring( len-3 ,len).equals("i\u0161t")|| //-išt
				buffer.substring( len-3 ,len).equals("itb")||
				buffer.substring( len-3 ,len).equals("\u00edrn")){  //-írn

				buffer.delete( len- 2 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-3 ,len).equals("och")||
				buffer.substring( len-3 ,len).equals("ost")||
				buffer.substring( len-3 ,len).equals("ovn")||
				buffer.substring( len-3 ,len).equals("oun")||
				buffer.substring( len-3 ,len).equals("out")||
				buffer.substring( len-3 ,len).equals("ou\u0161")){  //-ouš

				buffer.delete( len- 3 , len);
				return;
			}
			if(buffer.substring( len-3 ,len).equals("u\u0161k")){ //-ušk

				buffer.delete( len- 3 , len);
				return;
			}
			if(buffer.substring( len-3 ,len).equals("kyn")||
				buffer.substring( len-3 ,len).equals("\u010dan")||    //-čan
				buffer.substring( len-3 ,len).equals("k\u00e1\u0159")|| //kář
				buffer.substring( len-3 ,len).equals("n\u00e9\u0159")|| //néř
				buffer.substring( len-3 ,len).equals("n\u00edk")||      //-ník
				buffer.substring( len-3 ,len).equals("ctv")||
				buffer.substring( len-3 ,len).equals("stv")){

				buffer.delete( len- 3 , len);
				return;
			}
		}//len>5
		if(len > 4){
			if(buffer.substring( len-2 ,len).equals("\u00e1\u010d")|| // -áč
				buffer.substring( len-2 ,len).equals("a\u010d")||      //-ač
				buffer.substring( len-2 ,len).equals("\u00e1n")||      //-án
				buffer.substring( len-2 ,len).equals("an")||
				buffer.substring( len-2 ,len).equals("\u00e1\u0159")|| //-ář
				buffer.substring( len-2 ,len).equals("as")){

				buffer.delete( len- 2 , len);
				return;
			}
			if(buffer.substring( len-2 ,len).equals("ec")||
				buffer.substring( len-2 ,len).equals("en")||
				buffer.substring( len-2 ,len).equals("\u011bn")||   //-ěn
				buffer.substring( len-2 ,len).equals("\u00e9\u0159")){  //-éř

				buffer.delete( len-1 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-2 ,len).equals("\u00ed\u0159")|| //-íř
				buffer.substring( len-2 ,len).equals("ic")||
				buffer.substring( len-2 ,len).equals("in")||
				buffer.substring( len-2 ,len).equals("\u00edn")||  //-ín
				buffer.substring( len-2 ,len).equals("it")||
				buffer.substring( len-2 ,len).equals("iv")){

				buffer.delete( len- 1 , len);
				palatalise(buffer);
				return;
			}

			if(buffer.substring( len-2 ,len).equals("ob")||
				buffer.substring( len-2 ,len).equals("ot")||
				buffer.substring( len-2 ,len).equals("ov")||
				buffer.substring( len-2 ,len).equals("o\u0148")){ //-oň

				buffer.delete( len- 2 , len);
				return;
			}
			if(buffer.substring( len-2 ,len).equals("ul")){

				buffer.delete( len- 2 , len);
				return;
			}
			if(buffer.substring( len-2 ,len).equals("yn")){

				buffer.delete( len- 2 , len);
				return;
			}
			if(buffer.substring( len-2 ,len).equals("\u010dk")||              //-čk
				buffer.substring( len-2 ,len).equals("\u010dn")||  //-čn
				buffer.substring( len-2 ,len).equals("dl")||
				buffer.substring( len-2 ,len).equals("nk")||
				buffer.substring( len-2 ,len).equals("tv")||
				buffer.substring( len-2 ,len).equals("tk")||
				buffer.substring( len-2 ,len).equals("vk")){

				buffer.delete( len-2 , len);
				return;
			}
		}//len>4
		if(len > 3){
			if(buffer.charAt(buffer.length()-1)=='c'||
				buffer.charAt(buffer.length()-1)=='\u010d'|| //-č
				buffer.charAt(buffer.length()-1)=='k'||
				buffer.charAt(buffer.length()-1)=='l'||
				buffer.charAt(buffer.length()-1)=='n'||
				buffer.charAt(buffer.length()-1)=='t'){

				buffer.delete( len-1 , len);
			}
		}//len>3

	}//removeDerivational

	function removeAugmentative(buffer) {
		var len=buffer.length();
		//
		if( (len> 6 )&&
			buffer.substring( len- 4 ,len).equals("ajzn")){

			buffer.delete( len- 4 , len);
			return;
		}
		if( (len> 5 )&&
			(buffer.substring( len- 3 ,len).equals("izn")||
				buffer.substring( len- 3 ,len).equals("isk"))){

			buffer.delete( len- 2 , len);
			palatalise(buffer);
			return;
		}
		if( (len> 4 )&&
			buffer.substring( len- 2 ,len).equals("\00e1k")){ //-ák

			buffer.delete( len- 2 , len);
			return;
		}

	}

	function removeDiminutive(buffer) {
		var len=buffer.length();
		//
		if( (len> 7 )&&
			buffer.substring( len- 5 ,len).equals("ou\u0161ek")){  //-oušek

			buffer.delete( len- 5 , len);
			return;
		}
		if( len> 6){
			if(buffer.substring( len-4,len).equals("e\u010dek")||      //-eček
				buffer.substring( len-4,len).equals("\u00e9\u010dek")||    //-éček
				buffer.substring( len-4,len).equals("i\u010dek")||         //-iček
				buffer.substring( len-4,len).equals("\u00ed\u010dek")||    //íček
				buffer.substring( len-4,len).equals("enek")||
				buffer.substring( len-4,len).equals("\u00e9nek")||      //-ének
				buffer.substring( len-4,len).equals("inek")||
				buffer.substring( len-4,len).equals("\u00ednek")){      //-ínek

				buffer.delete( len- 3 , len);
				palatalise(buffer);
				return;
			}
			if( buffer.substring( len-4,len).equals("\u00e1\u010dek")|| //áček
				buffer.substring( len-4,len).equals("a\u010dek")||   //aček
				buffer.substring( len-4,len).equals("o\u010dek")||   //oček
				buffer.substring( len-4,len).equals("u\u010dek")||   //uček
				buffer.substring( len-4,len).equals("anek")||
				buffer.substring( len-4,len).equals("onek")||
				buffer.substring( len-4,len).equals("unek")||
				buffer.substring( len-4,len).equals("\u00e1nek")){   //-ánek

				buffer.delete( len- 4 , len);
				return;
			}
		}//len>6
		if( len> 5){
			if(buffer.substring( len-3,len).equals("e\u010dk")||   //-ečk
				buffer.substring( len-3,len).equals("\u00e9\u010dk")||  //-éčk
				buffer.substring( len-3,len).equals("i\u010dk")||   //-ičk
				buffer.substring( len-3,len).equals("\u00ed\u010dk")||    //-íčk
				buffer.substring( len-3,len).equals("enk")||   //-enk
				buffer.substring( len-3,len).equals("\u00e9nk")||  //-énk
				buffer.substring( len-3,len).equals("ink")||   //-ink
				buffer.substring( len-3,len).equals("\u00ednk")){   //-ínk

				buffer.delete( len- 3 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-3,len).equals("\u00e1\u010dk")||  //-áčk
				buffer.substring( len-3,len).equals("au010dk")|| //-ačk
				buffer.substring( len-3,len).equals("o\u010dk")||  //-očk
				buffer.substring( len-3,len).equals("u\u010dk")||   //-učk
				buffer.substring( len-3,len).equals("ank")||
				buffer.substring( len-3,len).equals("onk")||
				buffer.substring( len-3,len).equals("unk")){

				buffer.delete( len- 3 , len);
				return;

			}
			if(buffer.substring( len-3,len).equals("\u00e1tk")|| //-átk
				buffer.substring( len-3,len).equals("\u00e1nk")||  //-ánk
				buffer.substring( len-3,len).equals("u\u0161k")){   //-ušk

				buffer.delete( len- 3 , len);
				return;
			}
		}//len>5
		if( len> 4){
			if(buffer.substring( len-2,len).equals("ek")||
				buffer.substring( len-2,len).equals("\u00e9k")||  //-ék
				buffer.substring( len-2,len).equals("\u00edk")||  //-ík
				buffer.substring( len-2,len).equals("ik")){

				buffer.delete( len- 1 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-2,len).equals("\u00e1k")||  //-ák
				buffer.substring( len-2,len).equals("ak")||
				buffer.substring( len-2,len).equals("ok")||
				buffer.substring( len-2,len).equals("uk")){

				buffer.delete( len- 1 , len);
				return;
			}
		}
		if( (len> 3 )&&
			buffer.substring( len- 1 ,len).equals("k")){

			buffer.delete( len- 1, len);
			return;
		}
	}//removeDiminutives

	function removeComparative(buffer) {
		var len=buffer.length();
		//
		if( (len> 5)&&
			(buffer.substring( len-3,len).equals("ej\u0161")||  //-ejš
				buffer.substring( len-3,len).equals("\u011bj\u0161"))){   //-ějš

			buffer.delete( len- 2 , len);
			palatalise(buffer);
			return;
		}

	}

	function palatalise(buffer){
		var len=buffer.length();

		if( buffer.substring( len- 2 ,len).equals("ci")||
			buffer.substring( len- 2 ,len).equals("ce")||
			buffer.substring( len- 2 ,len).equals("\u010di")||      //-či
			buffer.substring( len- 2 ,len).equals("\u010de")){   //-če

			buffer.replace(len- 2 ,len, "k");
			return;
		}
		if( buffer.substring( len- 2 ,len).equals("zi")||
			buffer.substring( len- 2 ,len).equals("ze")||
			buffer.substring( len- 2 ,len).equals("\u017ei")||    //-ži
			buffer.substring( len- 2 ,len).equals("\u017ee")){  //-že

			buffer.replace(len- 2 ,len, "h");
			return;
		}
		if( buffer.substring( len- 3 ,len).equals("\u010dt\u011b")||     //-čtě
			buffer.substring( len- 3 ,len).equals("\u010dti")||   //-čti
			buffer.substring( len- 3 ,len).equals("\u010dt\u00ed")){   //-čtí

			buffer.replace(len- 3 ,len, "ck");
			return;
		}
		if( buffer.substring( len- 2 ,len).equals("\u0161t\u011b")||   //-ště
			buffer.substring( len- 2 ,len).equals("\u0161ti")||   //-šti
			buffer.substring( len- 2 ,len).equals("\u0161t\u00ed")){  //-ští

			buffer.replace(len- 2 ,len, "sk");
			return;
		}
		buffer.delete( len- 1 , len);
		return;
	}//palatalise

	function removePossessives(buffer) {
		var len=buffer.length();

		if( len> 5 ){
			if( buffer.substring( len- 2 ,len).equals("ov")){

				buffer.delete( len- 2 , len);
				return;
			}
			if(buffer.substring( len-2,len).equals("\u016fv")){ //-ův

				buffer.delete( len- 2 , len);
				return;
			}
			if( buffer.substring( len- 2 ,len).equals("in")){

				buffer.delete( len- 1 , len);
				palatalise(buffer);
				return;
			}
		}
	}//removePossessives

	function removeCase(buffer) {
		var len=buffer.length();
		//
		if( (len> 7 )&&
			buffer.substring( len- 5 ,len).equals("atech")){

			buffer.delete( len- 5 , len);
			return;
		}//len>7
		if( len> 6 ){
			if(buffer.substring( len- 4 ,len).equals("\u011btem")){   //-ětem

				buffer.delete( len- 3 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len- 4 ,len).equals("at\u016fm")){  //-atům
				buffer.delete( len- 4 , len);
				return;
			}

		}
		if( len> 5 ){
			if(buffer.substring( len-3,len).equals("ech")||
				buffer.substring( len-3,len).equals("ich")||
				buffer.substring( len-3,len).equals("\u00edch")){ //-ích

				buffer.delete( len-2 , len);
				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-3,len).equals("\u00e9ho")|| //-ého
				buffer.substring( len-3,len).equals("\u011bmi")||  //-ěmu
				buffer.substring( len-3,len).equals("emi")||
				buffer.substring( len-3,len).equals("\u00e9mu")||  // -ému				                                                                buffer.substring( len-3,len).equals("ete")||
				buffer.substring( len-3,len).equals("eti")||
				buffer.substring( len-3,len).equals("iho")||
				buffer.substring( len-3,len).equals("\u00edho")||  //-ího
				buffer.substring( len-3,len).equals("\u00edmi")||  //-ími
				buffer.substring( len-3,len).equals("imu")){

				buffer.delete( len- 2 , len);
				palatalise(buffer);
				return;
			}
			if( buffer.substring( len-3,len).equals("\u00e1ch")|| //-ách
				buffer.substring( len-3,len).equals("ata")||
				buffer.substring( len-3,len).equals("aty")||
				buffer.substring( len-3,len).equals("\u00fdch")||   //-ých
				buffer.substring( len-3,len).equals("ama")||
				buffer.substring( len-3,len).equals("ami")||
				buffer.substring( len-3,len).equals("ov\u00e9")||   //-ové
				buffer.substring( len-3,len).equals("ovi")||
				buffer.substring( len-3,len).equals("\u00fdmi")){  //-ými

				buffer.delete( len- 3 , len);
				return;
			}
		}
		if( len> 4){
			if(buffer.substring( len-2,len).equals("em")){

				buffer.delete( len- 1 , len);
				palatalise(buffer);
				return;

			}
			if( buffer.substring( len-2,len).equals("es")||
				buffer.substring( len-2,len).equals("\u00e9m")||    //-ém
				buffer.substring( len-2,len).equals("\u00edm")){   //-ím

				buffer.delete( len- 2 , len);
				palatalise(buffer);
				return;
			}
			if( buffer.substring( len-2,len).equals("\u016fm")){

				buffer.delete( len- 2 , len);
				return;
			}
			if( buffer.substring( len-2,len).equals("at")||
				buffer.substring( len-2,len).equals("\u00e1m")||    //-ám
				buffer.substring( len-2,len).equals("os")||
				buffer.substring( len-2,len).equals("us")||
				buffer.substring( len-2,len).equals("\u00fdm")||     //-ým
				buffer.substring( len-2,len).equals("mi")||
				buffer.substring( len-2,len).equals("ou")){

				buffer.delete( len- 2 , len);
				return;
			}
		}//len>4
		if( len> 3){
			if(buffer.substring( len-1,len).equals("e")||
				buffer.substring( len-1,len).equals("i")){

				palatalise(buffer);
				return;
			}
			if(buffer.substring( len-1,len).equals("\u00ed")||    //-é
				buffer.substring( len-1,len).equals("\u011b")){   //-ě

				palatalise(buffer);
				return;
			}
			if( buffer.substring( len-1,len).equals("u")||
				buffer.substring( len-1,len).equals("y")||
				buffer.substring( len-1,len).equals("\u016f")){   //-ů

				buffer.delete( len- 1 , len);
				return;
			}
			if( buffer.substring( len-1,len).equals("a")||
				buffer.substring( len-1,len).equals("o")||
				buffer.substring( len-1,len).equals("\u00e1")||  // -á
				buffer.substring( len-1,len).equals("\u00e9")||  //-é
				buffer.substring( len-1,len).equals("\u00fd")){   //-ý

				buffer.delete( len- 1 , len);
				return;
			}
		}//len>3
	}

	return stem;
});
