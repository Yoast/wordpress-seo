(function() {
	addEventListener( "load", function() {
		// Wait for YoastSEO to be loaded
		setTimeout(function() {
			addPlugin();
		}, 0);
	});

	function addPlugin() {
		YoastSEO.app.registerPlugin( "example-plugin", { "status": "ready" } );
		YoastSEO.app.registerTest( "example-test", function() {
			return ( Math.random() * 100 );
		}, {
			scoreArray: [
				{
					min: 0,
					max: 25,
					score: -1,
					text: "It's bad!"
				},
				{
					min: 25,
					max: 50,
					score: 4,
					text: "It's mediocre!"
				},
				{
					min: 50,
					max: 75,
					score: 7,
					text: "It's ok!"
				},
				{
					min: 75,
					score: 9,
					text: "It's all good!"
				}
			]
		}, "example-plugin" );
	}
}());
