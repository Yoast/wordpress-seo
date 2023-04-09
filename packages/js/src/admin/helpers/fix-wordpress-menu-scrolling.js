/**
 * Fixes the WP menu not being able to scroll.
 *
 * By enforcing a minimum height on the WP content that is the height of the WP menu.
 * This prevents it from going into the fixed mode.
 *
 * @returns {void}
 */
const fixWordPressMenuScrolling = () => {
	const content = document.getElementById( "wpcontent" );
	const menu = document.getElementById( "adminmenuwrap" );
	if ( content && menu ) {
		content.style.minHeight = `${ menu.offsetHeight }px`;
	}
};

export default fixWordPressMenuScrolling;
