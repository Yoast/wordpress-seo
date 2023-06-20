/**
 * Fixes the WP menu not being able to scroll.
 *
 * By enforcing a minimum height on the WP content that is the height of the WP menu.
 * This prevents it from going into the fixed mode.
 *
 * Which could happen on our JS admin pages, like settings.
 *
 * @returns {void}
 */
export const fixWordPressMenuScrolling = () => {
	const content = document.getElementById( "wpcontent" );
	const menu = document.getElementById( "adminmenuwrap" );
	if ( content && menu ) {
		content.style.minHeight = `${ menu.offsetHeight }px`;
	}
};
