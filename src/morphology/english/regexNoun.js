const singularize = [
	[ /([^v])ies$/i, "$1y" ],
	[ /ises$/i, "isis" ],
	[ /(kn|[^o]l|w)ives$/i, "$1ife" ],
	[ /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f" ],
	[ /^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f" ],
	[ /i$/i, "us" ],
	[ /(analy|diagno|parenthe|progno|synop|the)ses$/i, "$1sis" ],
	[ /(..[aeiou]s)es$/i, "$1" ],

	[ /(ap|caud|cod|col|cul|cort|ib|imbr|ind|lat|narth|orthopl|pontif|sympl|vert|vib|vort)(ices)$/i, "$1ex" ],
	[ /(append|cerv|forn|phoen|hel|r|red|scol|spad)(ices)$/i, "$1ix" ],
	[ /(cal)(yces)$/i, "$1yx" ],
	[ /(thor|hyr|pin)(aces)$/i, "$1ax" ],
	[ /(cr|d|hall)(uces)$/i, "$1ux" ],

	[ /(x|ch|ss|sh|z|o)es$/i, "$1" ],
	[ /men$/i, "man" ],
	[ /(n)ews$/i, "$1ews" ],
	[ /([ti])a$/i, "$1um" ],
	[ /([^aeiouy]|qu)ies$/i, "$1y" ],
	[ /(s)eries$/i, "$1eries" ],
	[ /([m|l])ice$/i, "$1ouse" ],
	[ /(alias|status)es$/i, "$1" ],
	[ /(cris|ax|test)es$/i, "$1is" ],
	[ /(ss)$/i, "$1" ],
	[ /(ics)$/i, "$1" ],
	[ /s$/i, "" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const pluralize = [
	[ /(ax|test)is$/i, "$1es" ],
	[ /us$/i, "i" ],
	[ /(kn|l|w)ife$/i, "$1ives" ],
	[ /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves" ],
	[ /^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves" ],
	[ /(alias|status)$/i, "$1es" ],
	[ /(bu)s$/i, "$1ses" ],
	[ /([ti])um$/i, "$1a" ],
	[ /([ti])a$/i, "$1a" ],
	[ /sis$/i, "ses" ],
	[ /(hive)$/i, "$1s" ],
	[ /([^aeiouy]|qu)y$/i, "$1ies" ],
	[ /(ap|caud|cod|col|cul|cort|ib|imbr|ind|lat|narth|orthopl|pontif|sympl|vert|vib|vort|append|cerv|forn|phoen|hel|r|red|scol|spad)(ix|ex)$/i,
		"$1ices" ],
	[ /((cal|thor|hyr|pin|cr|d|hall)[yau])x$/i, "$1ces" ],
	[ /(x|ch|ss|sh|s|z)$/i, "$1es" ],
	[ /([m|l])ouse$/i, "$1ice" ],
	// [ /([ m|l ])ice$/i, "$1ice" ],
	[ /^(ox)$/i, "$1en" ],
	[ /^(oxen)$/i, "$1" ],
	[ /(sis)$/i, "ses" ],
	[ /^(?!talis|.*hu)(.*)man$/i, "$1men" ],
	[ /(.*)/i, "$1s" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const hispanic = [
	[ /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)o$/i, "$1os", "$1oes" ],
	[ /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)os$/i, "$1o", "$1oes" ],
	[ /(ad|al|an|ang|anj|arg|at|ed|ent|er|esc|et|ett|in|ing|it|ott)oes$/i, "$1o", "$1os" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl1: a[ 1 ],
		repl2: a[ 2 ],
	};
} );

module.exports = {
	singularizeRegex: singularize,
	pluralizeRegex: pluralize,
	hispanicRegex: hispanic,
};
