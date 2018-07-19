const noComparativeOrSuperlative = new RegExp( /(.)(ing|s|c|ful|ish|al|ive|like|ed|ble)$/, "i" );

const comparative = [
	[ /([^aeiou])y$/i, "$1ier" ],
	[ /(..)e$/i, "$1er" ],
	[ /([plgmrv]id)$/i, "$1er" ],
	[ /([^aeiouy])([aeiouy])([bdfglmnpt])$/i, "$1$2$3$3er" ],
	[ /(.*)/i, "$1er" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );


const superlative = [
	[ /([^aeiou])y$/i, "$1iest" ],
	[ /(..)e$/i, "$1est" ],
	[ /([plgmrv]id)$/i, "$1est" ],
	[ /([^aeiouy])([aeiouy])([bdfglmnpt])$/i, "$1$2$3$3est" ],
	[ /(.*)/i, "$1est" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const icallyAdverbs = [

	[ /(.)ically$/i, "$1ic", "$1ical" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl1: a[ 1 ],
		repl2: a[ 2 ],
	};
} );


const adverb = [

	[ /([^aeioul])y$/i, "$1ily" ],
	[ /(ic)$/i, "$1ally" ],
	[ /(ly)$/i, "$1" ],
	[ /(l)e$/i, "$1y" ],
	[ /(.*)/i, "$1ly" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const adverbToBase = [

	[ /(bl)y$/i, "$1e" ],
	[ /(.)ily$/i, "$1y" ],
	[ /(.)([^l])([^y])$/i, "$1$2$3" ],
	[ /(.)ly$/i, "$1" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const comparativeToBase = [

	[ /(uer)$/i, "ue" ],
	[ /(.)(ch|sh|o)er$/i, "$1$2" ],
	[ /([^aeiouy]a)([^aeiouy])er$/i, "$1$2e" ],
	[ /([eiou][aei])([^aeiouy])er$/i, "$1$2" ],
	[ /(ang)er$/i, "$1e" ],
	[ /(ng)er$/i, "$1" ],
	[ /([eiua])ller$/i, "$1ll" ],
	[ /(tl|gl|bl)er$/i, "$1e" ],
	[ /(um?pt?)er$/i, "$1" ],
	[ /([plgmrv]id)er$/i, "$1" ],
	[ /pper$/i, "p" ],
	[ /bber$/i, "b" ],
	[ /tter$/i, "t" ],
	[ /nner$/i, "n" ],
	[ /gger$/i, "g" ],
	[ /dder$/i, "d" ],
	[ /mmer$/i, "m" ],
	[ /([^aoeiuy]n)er$/i, "$1" ],
	[ /([^aeiouy][aeiou])ker$/i, "$1ke" ],
	[ /([^paoeiuy][aeiouy])der$/i, "$1de" ],
	[ /([^f][aeiou])ler$/i, "$1l" ],
	[ /(..)(h|n[dt]|ai.|[cs]t|all|tt|int|d|en|oo.|er|k|w|ou.|rt|ght|mb|ff|th|rm|ast|rd)er$/i, "$1$2" ],
	[ /(.ut)er$/i, "$1e" ],
	[ /(us)er$/i, "$1e" ],
	[ /(..[^aeiouy])er$/i, "$1e" ],
	[ /(..)ier$/i, "$1y" ],
	[ /(.o)er$/i, "$1o" ],
	[ /(..i)er$/i, "$1" ],
	[ /(.a[^aeiou])er$/i, "$1" ],
	[ /(.[aeiou]y)er$/i, "$1" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const superlativeToBase = [

	[ /(uest)$/i, "ue" ],
	[ /(.)(ch|sh|o)est$/i, "$1$2" ],
	[ /([^aeiouy]a)([^aeiouy])est$/i, "$1$2e" ],
	[ /([eiou][aei])([^aeiouy])est$/i, "$1$2" ],
	[ /(ang)est$/i, "$1e" ],
	[ /(ng)est$/i, "$1" ],
	[ /([auei])llest$/i, "$1ll" ],
	[ /(tl|gl|bl)est$/i, "$1e" ],
	[ /(um?pt?)est$/i, "$1" ],
	[ /([plgmrv]id)est$/i, "$1" ],
	[ /ppest$/i, "p" ],
	[ /bber$/i, "b" ],
	[ /ttest$/i, "t" ],
	[ /nnest$/i, "n" ],
	[ /ggest$/i, "g" ],
	[ /ddest$/i, "d" ],
	[ /mmest$/i, "m" ],
	[ /([^aoeiuy]n)est$/i, "$1" ],
	[ /([^aeiouy][aeiou])kest$/i, "$1ke" ],
	[ /([^paoeiuy][aeiouy])dest$/i, "$1de" ],
	[ /([^f][aeiou])lest$/i, "$1l" ],
	[ /(..)(h|n[dt]|ai.|[cs]t|all|tt|int|d|en|oo.|er|k|w|ou.|rt|ght|rm|mb|th|ff|ast|rd)est$/i, "$1$2" ],
	[ /(.ut)est$/i, "$1e" ],
	[ /(us)est$/i, "$1e" ],
	[ /(..[^aeiouy])est$/i, "$1e" ],
	[ /(..)iest$/i, "$1y" ],
	[ /(.o)est$/i, "$1o" ],
	[ /(..i)est$/i, "$1" ],
	[ /(.a[^aeiou])est$/i, "$1" ],
	[ /(.[aeiou]y)est$/i, "$1" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );


module.exports = {
	noComparativeOrSuperlative: noComparativeOrSuperlative,
	comparative: comparative,
	superlative: superlative,
	comparativeToBase: comparativeToBase,
	superlativeToBase: superlativeToBase,
	adverb: adverb,
	adverbToBase: adverbToBase,
	icallyAdverbs: icallyAdverbs,
};
