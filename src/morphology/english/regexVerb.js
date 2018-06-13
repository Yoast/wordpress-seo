const verbPrefixes = {
	oneLetterPrefixes: /^a/i,
	twoLetterPrefixes: /^(at|be|en|in|on|re|to|un|up)/i,
	threeLetterPrefixes: /^(dis|far|for|mis|off|out|pre)/i,
	fourLetterPrefixes: /^(auto|back|deep|down|fine|fore|free|full|half|hand|heat|over|test|umbe|wind|with)/i,
	fiveLetterPrefixes: /^(after|belaw|enter|forth|frost|house|inter|quick|rough|under)/i,
	sevenLetterPrefixes: /^(counter|quarter)/i,
	twoLetterHyphenPrefixes: /^(at|be|co|en|in|on|re|to|un|up)-/i,
	threeLetterHyphenPrefixes: /^(dis|far|for|mis|off|out|pre)-/i,
	fourLetterHyphenPrefixes: /^(auto|back|deep|down|fine|fore|free|full|half|hand|heat|over|test|umbe|wind|with)-/i,
	fiveLetterHyphenPrefixes: /^(after|belaw|enter|forth|frost|house|inter|quick|rough|under)-/i,
	sevenLetterHyphenPrefixes: /^(counter|quarter)-/i,
};

const sFormToInfinitive = [
	[ /(..)ies$/i, "$1y" ],
	[ /(ss|ch|sh|x|z|o)es$/i, "$1" ],
	[ /([tzlshicgrvdnkmu])es$/i, "$1e" ],
	[ /(n[dtk]|c[kt]|[eo]n|i[nl]|er|a[ytrl])s$/i, "$1" ],
	[ /(o[wp])s$/i, "$1" ],
	[ /([eirs])ts$/i, "$1t" ],
	[ /(ll)s$/i, "$1" ],
	[ /(el)s$/i, "$1" ],
	[ /(ip)es$/i, "$1e" ],
	[ /ss$/i, "ss" ],
	[ /s$/i, "" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const ingFormToInfinitive = [
	[ /pping$/i, "p" ],
	[ /nning$/i, "n" ],
	[ /lling$/i, "ll" ],
	[ /tting$/i, "t" ],
	[ /dding$/i, "d" ],
	[ /ssing$/i, "ss" ],
	[ /gging$/i, "g" ],
	[ /([^aeiou])ying$/i, "$1y" ],
	[ /([^ae]i[^x])ing$/i, "$1e" ],
	[ /(ea.)ing$/i, "$1" ],
	[ /(u[rtcb]|[bdtpkg]l|n[cg]|a[gdkvtc]|[ua]s|[dr]g|yz|o[rlsp]|cre|bath|iev|delet|fil|jok|past|rais|vil|ooth|tast|u|car|ys)ing$/i, "$1e" ],
	[ /(ch|sh)ing$/i, "$1" ],
	[ /(..)ing$/i, "$1" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const edFormToInfinitive = [
	[ /(ued)$/i, "ue" ],
	[ /(.)(ss|ch|sh|x|z|o)ed$/i, "$1$2" ],
	[ /a([^aeiouy])ed$/i, "a$1e" ],
	[ /([aeiou]zz)ed$/i, "$1" ],
	[ /([ei])lled$/i, "$1ll" ],
	[ /(tl|gl|th)ed$/i, "$1e" ],
	[ /(um?pt?)ed$/i, "$1" ],
	[ /(ss)ed$/i, "$1" ],
	[ /pped$/i, "p" ],
	[ /tted$/i, "t" ],
	[ /nned$/i, "n" ],
	[ /gged$/i, "g" ],
	[ /(..)lked$/i, "$1lk" ],
	[ /([^aeiouy][aeiou])ked$/i, "$1ke" ],
	[ /([^f][aeiou])led$/i, "$1l" ],
	[ /asted$/i, "aste" ],
	[ /(..)(h|ion|n[dt]|ai.|[cs]t|pp|all|ss|tt|int|ail|ld|en|oo.|er|k|w|ou.|rt|ght|rm|ast|rd)ed$/i, "$1$2" ],
	[ /(.ut)ed$/i, "$1e" ],
	[ /(us)ed$/i, "$1e" ],
	[ /(..[^aeiouy])ed$/i, "$1e" ],
	[ /(..)ied$/i, "$1y" ],
	[ /(.o)ed$/i, "$1o" ],
	[ /(..i)ed$/i, "$1" ],
	[ /(.a[^aeiou])ed$/i, "$1" ],
	[ /([rl])ew$/i, "$1ow" ],
	[ /([pl])t$/i, "$1t" ],
	[ /(.[aeiou]y)ed$/i, "$1" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );


const infinitiveToSForm = [
	[ /(ss|ch|sh|x|z|o)$/i, "$1es" ],
	[ /([bcdfghjklmnpqrstvwxz])y$/i, "$1ies" ],
	[ /(.*)/i, "$1s" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const infinitiveToIngForm = [
	[ /(..)e$/i, "$1ing" ],
	[ /(ae|ai|ao|au|ea|ee|eu|ie|io|oa|oe|oo|ou|oy|ua|ue|uo|uy)([bdfglmnpt])$/i, "$1$2ing" ],
	[ /([aeiouy])([bdfglmnpt])$/i, "$1$2$2ing" ],
	[ /(.*)/i, "$1ing" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

const infinitiveToEdForm = [
	[ /(..)e$/i, "$1ed" ],
	[ /(ae|ai|ao|au|ea|ee|eu|ie|io|oa|oe|oo|ou|oy|ua|ue|uo|uy)([bdfglmnpt])$/i, "$1$2ed" ],
	[ /([aeiouy])([bdfglmnpt])$/i, "$1$2$2ed" ],
	[ /(..)ed$/i, "$1ed" ],
	[ /([bcdfghjklmnpqrstvwxz])y$/i, "$1ied" ],
	[ /(.*)/i, "$1ed" ],
].map( function( a ) {
	return {
		reg: a[ 0 ],
		repl: a[ 1 ],
	};
} );

module.exports = {
	verbPrefixes: verbPrefixes,
	sFormToInfinitive: sFormToInfinitive,
	ingFormToInfinitive: ingFormToInfinitive,
	edFormToInfinitive: edFormToInfinitive,
	infinitiveToSForm: infinitiveToSForm,
	infinitiveToIngForm: infinitiveToIngForm,
	infinitiveToEdForm: infinitiveToEdForm,
};
