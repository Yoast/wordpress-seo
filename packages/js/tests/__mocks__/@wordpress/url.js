module.exports = {
	addQueryArgs: ( url, args ) => {
		const link = new URLSearchParams( args );
		return `${ url }?${ link.toString() }`;
	},
};
