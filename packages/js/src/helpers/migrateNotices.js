/**
 * Transform contents to adhere to the new dashboard format.
 *
 * @param {Array} contents An array with contents to be transformed.
 *
 * @returns {Array} The contents to be transformed.
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
 * Prepares notices to be migrated.
 *
 * @param {Array} notices The notices to be prepared for migration.
 *
 * @returns {Array} The notices, prepared for migration.
 */
function prepareNoticesForMigration( notices ) {
	const ids = notices.map( notice => notice.id );
	const headers = notices.map( notice => notice.querySelector( ".yoast-notice-migrated-header" ) );
	const contents = transformContent( notices.map( notice => notice.querySelector( ".notice-yoast-content" ) ) );
	const isDismissable = notices.map( notice => notice.classList.contains( "is-dismissible" ) );

	return notices.map( ( notice, index ) => ( {
		notice: notice,
		id: ids[ index ],
		header: headers[ index ],
		content: contents[ index ],
		isDismissable: isDismissable[ index ],
	} ) );
}

/**
 * Migrates Yoast notices.
 *
 * @returns {Array} The migrated Yoast Notices.
 */
export function getMigrateNotices() {
	// Gather all notices that need migration.
	const noticeYoastNotices = Array.from( document.querySelectorAll( ".notice-yoast:not(.yoast-webinar-dashboard)" ) );
	const migratedNotices = Array.from( document.querySelectorAll( ".yoast-migrated-notice" ) );
	const allNotices = [ ...noticeYoastNotices, ...migratedNotices ];

	// Prepare the notices for migration.
	const noticesToBeMigrated = prepareNoticesForMigration( allNotices );

	// Finally, remove the original notices from the DOM.
	noticeYoastNotices.forEach( notice => notice.remove() );
	migratedNotices.forEach( notice => notice.remove() );

	return noticesToBeMigrated;
}
