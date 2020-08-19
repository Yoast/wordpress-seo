<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Abstract class to force methods in recalculate classes.
 *
 * @deprecated 14.4
 * @codeCoverageIgnore
 */
abstract class WPSEO_Recalculate {

	/**
	 * Gets the items to recalculate.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param int $paged The current page number.
	 *
	 * @return array Items that can be recalculated.
	 */
	public function get_items_to_recalculate( $paged ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return [];
	}

	/**
	 * Parse the posts|terms with the value we need.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param array $items The items to parse.
	 *
	 * @return array
	 */
	protected function parse_items( array $items ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return [];
	}

	/**
	 * Get default from the options for given field.
	 *
	 * @deprecated 14.4
	 * @codeCoverageIgnore
	 *
	 * @param string $field  The field for which to get the default options.
	 * @param string $suffix The post type.
	 *
	 * @return bool|string
	 */
	protected function default_from_options( $field, $suffix ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.4' );

		return false;
	}
}
