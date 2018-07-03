const comparative = [

	[ /([^aeiou])y$/i, "$1ier" ],
	[ /(..)e$/i, "$1er" ],
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
	[ /([^aeiouy])([aeiouy])([bdfglmnpt])$/i, "$1$2$3$3est" ],
	[ /(.*)/i, "$1est" ],

].map( function(	 a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );


const comparativeToBase = [

	[ /(uer)$/i, "ue" ],
	[ /(.ut)er$/i, "$1e" ],
	[ /(us)er$/i, "$1e" ],
	[ /pper$/i, "p" ],
	[ /dder$/i, "d" ],
	[ /tter$/i, "t" ],
	[ /nner$/i, "n" ],
	[ /mmer$/i, "m" ],
	[ /gger$/i, "g" ],
	[ /([bpt])(le)r$/i, "$1$2" ],
	[ /(.)(ch|sh|zz|ll|th|ump|l)er$/i, "$1$2" ],
	[ /(.[aeiou]y)er$/i, "$1" ],
	[ /(..)(h|ion|n[dt]|ai.|[cs]t|pp|all|ss|tt|int|ail|ld|en|oo.|er|k|w|ou.|rt|ght|rm|ast|rd)er$/i, "$1$2" ],
	[ /(..[^aeiouy])er$/i, "$1e" ],
	[ /(..)ier$/i, "$1y" ],
	[ /(.*)er$/i, "$1" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const superlativeToBase = [

	[ /(uest)$/i, "ue" ],
	[ /(.ut)est$/i, "$1e" ],
	[ /(us)est$/i, "$1e" ],
	[ /ppest$/i, "p" ],
	[ /ddest$/i, "d" ],
	[ /ttest$/i, "t" ],
	[ /nnest$/i, "n" ],
	[ /mmest$/i, "m" ],
	[ /ggest$/i, "g" ],
	[ /([bpt])(le)st$/i, "$1$2" ],
	[ /(.)(ch|sh|zz|ll|th|ump|l)est$/i, "$1$2" ],
	[ /(.[aeiou]y)est$/i, "$1" ],
	[ /(..)(h|ion|n[dt]|ai.|[cs]t|pp|all|ss|tt|int|ail|ld|en|oo.|er|k|w|ou.|rt|ght|rm|ast|rd)est$/i, "$1$2" ],
	[ /(..[^aeiouy])est$/i, "$1e" ],
	[ /(..)iest$/i, "$1y" ],
	[ /(.*)est$/i, "$1" ],

].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

module.exports = {
	comparative: comparative,
	superlative: superlative,
	comparativeToBase: comparativeToBase,
	superlativeToBase: superlativeToBase,
};
