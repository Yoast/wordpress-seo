<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link extractor.
 */
class WPSEO_Link_Extractor {

	/**
	 * @var string
	 */
	protected $content;

	/**
	 * Sets the content.
	 *
	 * @param string $content The content to extract the links from.
	 */
	public function __construct( $content ) {
		$this->content = $content;
	}

	/**
	 * Extracts the hrefs from the content and returns them as an array.
	 *
	 * @return array All the extracted links
	 */
	public function extract() {
		$links = array();

		if ( strpos( $this->content, 'href' ) === false ) {
			return $links;
		}

		$regexp = '<a\s[^>]*href=("??)([^" >]*?)\\1[^>]*>';

		// Used modifiers iU to match case insensitive and make greedy quantifiers lazy.
		if ( preg_match_all( "/$regexp/iU", $this->content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$links[] = trim( $match[2], "'" );
			}
		}

		return $links;
	}
}
