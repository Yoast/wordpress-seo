var FacebookPreview = require( "../js/facebookPreview.js" );
var TwitterPreview  = require( "../js/twitterPreview.js" );

var facebookPreview = new FacebookPreview(
	{
		targetElement: document.getElementById(  'facebook-container' )
	}
);

facebookPreview.init();

var twitterPreview = new TwitterPreview(
	{
		targetElement: document.getElementById(  'twitter-container' )
	}
);

twitterPreview.init();
