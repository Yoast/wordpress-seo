var FacebookPreview = require( "../js/facebook-preview.js" );

var facebookPreview = new FacebookPreview(
	{
		targetElement: document.getElementById(  'output-container' )
	}
);

facebookPreview.init();
