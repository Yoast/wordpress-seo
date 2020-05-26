<?php
/**
 * A helper object for terms.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WP_Taxonomy;
use WP_Term;
use WPSEO_Taxonomy_Meta;

/**
 * Class Taxonomy_Helper
 */
class Taxonomy_Helper {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The string helper.
	 *
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Taxonomy_Helper constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 * @param String_Helper  $string  The string helper.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
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
	 * Returns an array with the public taxonomies.
	 *
	 * @param string $output The output type to use.
	 *
	 * @return string[]|WP_Taxonomy[] Array with all the public taxonomies.
	 *                                The type depends on the specified output variable.
	 */
	public function get_public_taxonomies( $output = 'names' ) {
		return \get_taxonomies( [ 'public' => true ], $output );
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

	/**
	 * Retrieves the taxonomy term's meta values.
	 *
	 * @param WP_Term $term Term to get the meta value for.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return array|bool Array of all the meta data for the term.
	 *                    False if the term does not exist or the $meta provided is invalid.
	 */
	public function get_term_meta( $term ) {
		return WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, null );
	}
}
