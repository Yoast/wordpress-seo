<?php
/**
 * @package WPSEO\Admin\Menu
 */

/**
 * Hides submenu items if the advanced settings are not enabled.
 */
class WPSEO_Submenu_Hider implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_filter( 'wpseo_submenu_pages', array( $this, 'filter_settings_pages' ) );
	}

	/**
	 * Filters all advanced settings pages from the given pages.
	 *
	 * @param array $pages The pages to filter.
	 *
	 * @return array Filtered list of submenu pages to show.
	 */
	public function filter_settings_pages( array $pages ) {
		$options = WPSEO_Options::get_options( array( 'wpseo' ) );

		if ( wpseo_advanced_settings_enabled( $options ) ) {
			return $pages;
		}

		$pages_to_hide = WPSEO_Advanced_Settings::get_advanced_pages();
		$page          = filter_input( INPUT_GET, 'page' );

		// If we are on the advanced settings page, don't hide this page from the list of items to display.
		if ( WPSEO_Advanced_Settings::is_advanced_settings_page( $page ) ) {
			$pages_to_hide = $this->unhide_page( $pages_to_hide, $page );
		}

		foreach ( $pages as $page_key => $page ) {
			$page_name = $page[4];

			if ( in_array( $page_name, $pages_to_hide, true ) ) {
				unset( $pages[ $page_key ] );
			}
		}

		return $pages;
	}

	/**
	 * Given a list of passed pages that will be disabled, removes the given page from the list so that it will no longer be disabled.
	 *
	 * @param array  $hidden_pages The pages to search through.
	 * @param string $page         The page to temporarily enable.
	 *
	 * @return array The remaining pages that need to be disabled.
	 */
	private function unhide_page( $hidden_pages, $page ) {
		$enable_page = array_search( $page, $hidden_pages, true );

		if ( $enable_page !== false ) {
			unset( $hidden_pages[ $enable_page ] );
		}

		return $hidden_pages;
	}
}
