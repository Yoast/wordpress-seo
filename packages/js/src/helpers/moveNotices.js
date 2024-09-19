/**
 * Gets Yoast Notices and deletes them from their original place.
 *
 * @returns {Array} The now-deleted Yoast Notices.
 */
export function moveNotices() {
	const noticeYoastNotices = Array.from( document.querySelectorAll( ".notice-yoast" ) );
	noticeYoastNotices.forEach( notice => notice.remove() );

	const robotNotices = Array.from( document.querySelectorAll( "#robotsmessage" ) );
	robotNotices.forEach( notice => notice.remove() );

	return [ ...noticeYoastNotices, ...robotNotices ];
}
