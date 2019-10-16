<?php
/**
 * A helper object for terms.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Taxonomy_Helper
 */
class Taxonomy_Helper {

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Taxonomy_Helper constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 * @param String_Helper  $string  The string helper.
	 */
	public function __construct( Options_Helper $options, String_Helper $string ) {
		$this->options = $options;
		$this->string  = $string;
	}

	/**
	 * Checks if the requested term is indexable.
	 *
	 * @param string $taxonomy The taxonomy slug.
	 *
	 * @return bool True when taxonomy is set to index.
	 */
	public function is_indexable( $taxonomy ) {
		return ! $this->options->get( 'noindex-tax-' . $taxonomy, false );
	}

	/**
	 * Retrieves the term description (without tags).
	 *
	 * @param int $term_id Term ID.
	 *
	 * @return string Term description (without tags).
	 */
	public function get_term_description( $term_id ) {
		return $this->string->strip_all_tags( \term_description( $term_id ) );
	}
}
