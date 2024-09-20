/**
 * Gets Yoast Notices and deletes them from their original place.
 *
 * @returns {Array} The now-deleted Yoast Notices.
 */
export function moveNotices() {
	const noticeYoastNotices = Array.from( document.querySelectorAll( ".notice-yoast" ) );
	const migratedNotices = Array.from( document.querySelectorAll( ".yoast-migrated-notice" ) );

	const allNotices = [ ...noticeYoastNotices, ...migratedNotices ];

	noticeYoastNotices.forEach( notice => notice.remove() );
	migratedNotices.forEach( notice => notice.remove() );

	const ids = allNotices.map( notice => notice.id );
	const headers = allNotices.map( notice => notice.querySelector( ".notice-yoast__header-heading" ) );
	const content = allNotices.map( notice => notice.querySelector( ".notice-yoast-content" ) );
	const buttons = allNotices.map( notice => notice.querySelector( "button.notice-dismiss" ) );

	const notices = allNotices.map( ( notice, index ) => ( {
		notice: notice,
		id: ids[ index ],
		header: headers[ index ],
		content: content[ index ],
		button: buttons[ index ],
	} ) );

	return notices;
}
