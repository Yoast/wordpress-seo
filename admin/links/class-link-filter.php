<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the filter for filtering links.
 */
class WPSEO_Link_Filter {

	/**
	 * Path to the current page.
	 *
	 * @var string|null
	 */
	protected $current_page_path;

	/**
	 * Sets the current page path.
	 *
	 * @param string $current_page The current page.
	 */
	public function __construct( $current_page = '' ) {
		$this->current_page_path = untrailingslashit( WPSEO_Link_Utils::get_url_part( $current_page, 'path' ) );
	}

	/**
	 * Filters all internal links that contains an fragment in the URL.
	 *
	 * @param WPSEO_Link $link The link that might be filtered.
	 *
	 * @return bool False when url contains a fragment.
	 */
	public function internal_link_with_fragment_filter( WPSEO_Link $link ) {
		// When the type is external.
		if ( $link->get_type() === WPSEO_Link::TYPE_EXTERNAL ) {
			return true;
		}

		$url_parts = wp_parse_url( $link->get_url() );

		if ( isset( $url_parts['path'] ) ) {
			return ! $this->is_current_page( untrailingslashit( $url_parts['path'] ) );
		}

		return ( ! isset( $url_parts['fragment'] ) && ! isset( $url_parts['query'] ) );
	}

	/**
	 * Is the url path the same as the current page path.
	 *
	 * @param string $url_path The url path.
	 *
	 * @return bool True when path is equal to the current page path.
	 */
	protected function is_current_page( $url_path ) {
		return ( ! empty( $url_path ) && $url_path === $this->current_page_path );
	}
}
