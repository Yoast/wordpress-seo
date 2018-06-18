const singularize = [
	[ /([^v])ies$/i, "$1y" ],
	[ /([^aeiouy]|qu)ies$/i, "$1y" ],

	[ /(kn|[^o]l|w)ives$/i, "$1ife" ],
	[ /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f" ],
	[ /^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f" ],

	[ /i$/i, "us" ],
	[ /([ilrt])a$/i, "$1um" ],

	[ /(acido|analy|arthro|ato|bio|calcino|cardio|cataly|cente|cly|co|cyano|diagno|dialy|dyaly)ses$/i, "$1sis" ],
	[ /(ellip|empha|ep|ge|gene|gnos|go|hetero|hidro|hypno|kine|lipido|me|melano|metrio|mio)ses$/i, "$1sis" ],
	[ /(morpho|narco|necro|nephrit|nephro|neuro|oly|op|pare|pha|phimo|phone|phra)ses$/i, "$1sis" ],
	[ /(phy|progno|psycho|pto|re|ria|sclero|steno|symphy|synap|synize|synop|ta|the|thelio|thrombo|to|typo)ses$/i, "$1sis" ],
	[ /ises$/i, "isis" ],
	[ /itides$/i, "itis" ],
	[ /([aeiuy]x)es$/i, "$1is" ],
	[ /yzes$/i, "yzis" ],
	[ /(..[aeiou]s)es$/i, "$1" ],
	[ /yges$/i, "yx" ],
	[ /([iy]n)ges$/i, "$1x" ],

	[ /(ap|caud|cod|col|cul|cort|ib|imbr|ind|lat|narth|orthopl|pontif|sympl|vert|vib|vort)(ices)$/i, "$1ex" ],
	[ /(append|cerv|forn|phoen|hel|r|red|scol|spad)(ices)$/i, "$1ix" ],
	[ /(cal)(yces)$/i, "$1yx" ],
	[ /(thor|hyr|pin)(aces)$/i, "$1ax" ],
	[ /(cr|d|hall)(uces)$/i, "$1ux" ],

	[ /(x|ch|ss|sh|z|o)es$/i, "$1" ],

	[ /men$/i, "man" ],

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
	[ /us$/i, "i" ],
	[ /itis$/i, "itides" ],

	[ /(kn|l|w)ife$/i, "$1ives" ],
	[ /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves" ],
	[ /^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves" ],

	[ /(bu)s$/i, "$1ses" ],
	[ /sis$/i, "ses" ],

	[ /([ilrt])um$/i, "$1a" ],

	[ /([^aeiouy]|qu)y$/i, "$1ies" ],

	[ /(ap|caud|cod|col|cul|cort|ib|imbr|ind|lat|narth|orthopl|pontif|sympl|vert|vib|vort|append|cerv|forn|phoen|hel|r|red|scol|spad)(ix|ex)$/i,
		"$1ices" ],
	[ /((cal|thor|hyr|pin|cr|d|hall)[yau])x$/i, "$1ces" ],
	[ /yzis$/i, "yzes" ],
	[ /(sis)$/i, "ses" ],
	[ /([aeiuy]x)is$/i, "$1es" ],
	[ /([iy]n?)x$/i, "$1ges" ],

	[ /(ics)$/i, "$1" ],
	[ /(x|ch|ss|sh|s|z)$/i, "$1es" ],

	[ /^(?!talis|.*hu)(.*)man$/i, "$1men" ],
	[ /(.+)/i, "$1s" ],
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

const possessiveToBase = [
	[ /['‘’‛`]s$/i, "" ],
	[ /(s)(['‘’‛`]s?)$/i, "$1" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const baseToPossessive = [
	[ /s$/i, "s's", "s'" ],
	[ /(.+)/i, "$1's", "$1's" ],
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
	possessiveToBase: possessiveToBase,
	baseToPossessive: baseToPossessive,
};
