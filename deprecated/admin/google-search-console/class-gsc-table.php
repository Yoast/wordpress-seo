<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Class WPSEO_GSC_Table.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Table extends WP_List_Table {

	/**
	 * Modal height.
	 *
	 * @var int
	 */
	const FREE_MODAL_HEIGHT = 140;

	/**
	 * Search Console table class constructor (subclasses list table).
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 * @param string $category Type of the issues.
	 * @param array  $items    Set of the issues to display.
	 */
	public function __construct( $platform, $category, array $items ) {
		parent::__construct();

		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Getting the screen id from this table.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_screen_id() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return $this->screen->id;
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public function prepare_items() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Set the table columns.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_columns() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return array();
	}
}
