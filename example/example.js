var FacebookPreview = require( "../js/facebookPreview.js" );
var TwitterPreview  = require( "../js/twitterPreview.js" );

var facebookPreview = new FacebookPreview(
	{
		targetElement: document.getElementById(  'facebook-container' ),
		data : {
			imageUrl : 'http://www.filmtotaal.nl/images/newscontent/j76kpfrclkou_200.jpg'
		}
	}
);

facebookPreview.init();

var twitterPreview = new TwitterPreview(
	{
		targetElement: document.getElementById(  'twitter-container' ),
		data : {
			imageUrl : 'http://www.filmtotaal.nl/images/newscontent/j76kpfrclkou_200.jpg'
		}
	}
);

twitterPreview.init();
