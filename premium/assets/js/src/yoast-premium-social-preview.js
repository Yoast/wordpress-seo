/* jshint -W097 */
/* global yoast_social_preview  */
'use strict';

var socialPreviews = require( 'yoast-social-previews' );
var FacebookPreview = socialPreviews.FacebookPreview;
var TwitterPreview = socialPreviews.TwitterPreview;

(
	jQuery(
		function() {
			var fieldPrefix = '';

			// We've prefixed the
			if ( jQuery( '#post_ID').length > 0 ) {
				fieldPrefix = 'yoast_wpseo';
			}

			// We've prefixed the fields for taxonomies different.
			if ( jQuery( 'input[name=tag_ID]').length > 0 ) {
				fieldPrefix = 'wpseo';
			}

			/**
			 * Initialize the facebook preview.
			 *
			 * @param {Object} facebookHolder Target element for adding the facebook preview.
			 */
			function initFacebook( facebookHolder ) {
				if ( facebookHolder.length === 0 ) {
					return;
				}

				facebookHolder.append( "<div id='facebookPreview'></div>" );
				facebookHolder.find( '.form-table' ).hide();

				var facebookPreview = new FacebookPreview(
					{
						targetElement: document.getElementById(  'facebookPreview' ),
						data : {
							title : jQuery( '#' + fieldPrefix + '_opengraph-title' ).val(),
							description : jQuery( '#' + fieldPrefix + '_opengraph-description' ).val(),
							imageUrl : jQuery( '#' + fieldPrefix + '_opengraph-image' ).val()
						},
						baseURL : yoast_social_preview.website,
						callbacks : {
							updateSocialPreview : function( data ) {
								jQuery( '#' + fieldPrefix + '_opengraph-title' ).val( data.title );
								jQuery( '#' + fieldPrefix + '_opengraph-description' ).val( data.description );
								jQuery( '#' + fieldPrefix + '_opengraph-image' ).val( data.imageUrl );
							}
						}
					}
				);
				facebookPreview.init();
			}

			/**
			 * Initialize the twitter preview.
			 *
			 * @param {Object} twitterHolder Target element for adding the twitter preview.
			 */
			function initTwitter( twitterHolder ) {
				if ( twitterHolder.length === 0 ) {
					return;
				}

				twitterHolder.append( "<div id='twitterPreview'></div>" );
				twitterHolder.find( '.form-table' ).hide();

				var twitterPreview = new TwitterPreview(
					{
						targetElement: document.getElementById(  'twitterPreview' ),
						data : {
							title : jQuery( '#' + fieldPrefix + '_twitter-title' ).val(),
							description : jQuery( '#' + fieldPrefix + '_twitter-description' ).val(),
							imageUrl : jQuery( '#' + fieldPrefix + '_twitter-image' ).val()
						},
						baseURL : yoast_social_preview.website,
						callbacks : {
							updateSocialPreview : function( data ) {
								jQuery( '#' + fieldPrefix + '_twitter-title' ).val( data.title );
								jQuery( '#' + fieldPrefix + '_twitter-description' ).val( data.description );
								jQuery( '#' + fieldPrefix + '_twitter-image' ).val( data.imageUrl );
							}
						}
					}
				);

				twitterPreview.init();
			}

			initFacebook( jQuery( '#wpseo_facebook' ) );
			initTwitter( jQuery( '#wpseo_twitter' ) );
		}
	)
);
