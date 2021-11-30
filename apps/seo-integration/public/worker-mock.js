const createFakeResults = type => [
	[ "error", -1 ],
	[ "feedback", 0 ],
	[ "bad", 4 ],
	[ "ok", 5 ],
	[ "good", 8 ],
].map( ( [ name, score ] ) => ( {
	identifier: `${ type }-${ name }-result`,
	score,
	marks: [],
	text: `${ type } ${ name } result`,
} ) );

/* eslint-disable no-restricted-globals */
self.onmessage = ( { data } ) => {
	if ( ! data.type ) {
		return;
	}

	const message = {
		type: `${ data.type }:done`,
		id: data.id,
	};

	switch ( data.type ) {
		case "analyze":
			message.payload = {
				seo: {
					focus: {
						score: 10,
						results: createFakeResults( "SEO" ),
					},
				},
				readability: {
					score: 10,
					results: createFakeResults( "Readability" ),
				},
				research: {
					morphology: {},
				},
			};
			break;
		default:
			message.payload = data.payload;
			break;
	}

	self.postMessage( message );
};
