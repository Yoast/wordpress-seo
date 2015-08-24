varPlugin = function(textString) {
	console.log("plugin running");
	return textString;
};

loadVarPlugin = function() {
	if( typeof YoastSEO.app !== "undefined" ) {
		YoastSEO.app.plugins.register( "varPlugin", {status: "ready", strings: ["title","text","meta"]}, varPlugin );
		//YoastSEO.app.plugins.ready( "varPlugin" );
	}else{
		setTimeout("loadVarPlugin()", 100);
	}
};

loadVarPlugin();

