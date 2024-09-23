/**
 * Gets Yoast Notices and deletes them from their original place.
 *
 * @returns {Array} The now-deleted Yoast Notices.
 */
export function moveNotices() {
	const noticeYoastNotices = Array.from( document.querySelectorAll( ".notice-yoast:not(.yoast-webinar-dashboard)" ) );
	const migratedNotices = Array.from( document.querySelectorAll( ".yoast-migrated-notice" ) );

	const allNotices = [ ...noticeYoastNotices, ...migratedNotices ];

	noticeYoastNotices.forEach( notice => notice.remove() );
	migratedNotices.forEach( notice => notice.remove() );

	const ids = allNotices.map( notice => notice.id );
	const headers = allNotices.map( notice => notice.querySelector( ".yoast-notice-migrated-header" ) );
	const content = allNotices.map( notice => notice.querySelector( ".notice-yoast-content" ) );
	const dismissButtons = allNotices.map( notice => notice.querySelector( "button.notice-dismiss" ) );

	// Transform the buttons to Yoast buttons.
	content.forEach( noticeContent => {
		if ( noticeContent ) {
			noticeContent.querySelectorAll( "a.button" ).forEach( button => {
				button.classList.remove( "button" );
				button.classList.add( "yst-button" );
				button.classList.add( "yst-button--primary" );
				button.classList.add( "yst-mt-4" );
			} );
		}
	} );

	const notices = allNotices.map( ( notice, index ) => ( {
		notice: notice,
		id: ids[ index ],
		header: headers[ index ],
		content: content[ index ],
		button: dismissButtons[ index ],
	} ) );

	return notices;
}
