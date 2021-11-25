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
						results: [
							{
								score: -10,
								rating: "bad",
								hasMarks: false,
								marker: [],
								id: "test",
								text: "Bad result text",
								markerId: "testMarker",
							},
						],
					},
				},
				readability: {
					score: 10,
					results: [
						{
							score: -10,
							rating: "bad",
							hasMarks: false,
							marker: [],
							id: "test",
							text: "Bad result text",
							markerId: "testMarker",
						},
					],
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
