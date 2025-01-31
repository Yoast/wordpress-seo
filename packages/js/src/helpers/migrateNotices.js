/**
 * Transform contents to adhere to the new dashboard format.
 *
 * @param {HTMLElement[]} contents An array with contents to be transformed.
 *
 * @returns {HTMLElement[]} The contents to be transformed.
 */
function transformContent( contents ) {
	// Transform the buttons to Yoast buttons.
	contents.forEach( noticeContent => {
		if ( noticeContent ) {
			noticeContent.querySelectorAll( "a.button" ).forEach( button => {
				button.classList.remove( "button" );
				button.classList.add( "yst-button" );
				button.classList.add( "yst-button--primary" );
				button.classList.add( "yst-mt-4" );
			} );
		}
	} );

	return contents;
}

/**
 * Gets Yoast notices to be migrated.
 *
 * @returns {Array} The Yoast Notices to be migrated.
 */
export function getMigratingNotices() {
	// Gather all notices that need migration.
	const noticeYoastNotices = Array.from( document.querySelectorAll( ".notice-yoast:not(.yoast-webinar-dashboard)" ) );
	const migratedNotices = Array.from( document.querySelectorAll( ".yoast-migrated-notice" ) );
	return [ ...noticeYoastNotices, ...migratedNotices ];
}

/**
 * Gets all the necessary info for migrating notices.
 *
 * @returns {Array} The necessary info for migrating notices.
 */
export function getMigratingNoticeInfo() {
	const noticesToBeMigrated = getMigratingNotices();

	const ids = noticesToBeMigrated.map( notice => notice.id );
	const headers = noticesToBeMigrated.map( notice => notice.querySelector( ".yoast-notice-migrated-header" ) );
	const contents = transformContent( noticesToBeMigrated.map( notice => notice.querySelector( ".notice-yoast-content" ) ) );
	const isDismissable = noticesToBeMigrated.map( notice => notice.classList.contains( "is-dismissible" ) );

	return noticesToBeMigrated.map( ( notice, index ) => ( {
		originalNotice: notice,
		id: ids[ index ],
		header: headers[ index ].outerHTML,
		content: contents[ index ].outerHTML,
		isDismissable: isDismissable[ index ],
		isDismissed: false,
	} ) );
}

/**
 * Deletes notices.
 *
 * @param {Array} notices The notices to be deleted.
 *
 * @returns {void}
 */
export function deleteMigratingNotices( notices ) {
	notices.forEach( notice => notice.originalNotice.remove() );
}
