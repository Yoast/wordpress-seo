/* global HS */
( function( $ ) {
	$( window ).on( "YoastSEO:ContactSupport", function( e, data ) {
		if( data.usedQueries !== undefined ) {
			var identity = HS.beacon.get_helpscout_beacon_identity();
			identity[ "User searched for" ] = usedQueriesWithHTML( data.usedQueries );
			HS.beacon.identify( identity );
		}
		HS.beacon.open();
	} );

	/**
	 * Format the search queries done by the user in HTML
	 *
	 * @param {array} usedQueries List of queries entered by the user.
	 * @returns {string} The generated output.
	 */
	function usedQueriesWithHTML( usedQueries ) {
		var output = "";
		if ( $.isEmptyObject( usedQueries ) ) {
			output += "<em>Search history is empty.</em>";
		} else {
			output += "<table><tr><th>Searched for</th><th>Opened article</th></tr>";
			$.each( usedQueries, function( searchString, posts ) {
				output += "<tr><td>" + searchString + "</td>";
				output += getPostsHTML( posts );
				output += "</tr>";
			} );
			output = output + "</table>";
		}

		return output;
	}

	/**
	 * Format the posts looked at by the user in HTML
	 *
	 * @param {array} posts List of posts opened by the user.
	 * @returns {string} The generated output.
	 */
	function getPostsHTML( posts ) {
		var output = "";
		var first = true;
		if ( $.isEmptyObject( posts ) ) {
			output += "<td><em>No articles were opened.</em></td>";
		} else {
			$.each( posts, function( postId, post ) {
				if ( first === false ) {
					output += "<td></td>";
				}
				output += "<td><a href='" + post.link + "'>" + post.title + "</a></td>";
				first = false;
			} );
		}

		return output;
	}
} )( jQuery );
