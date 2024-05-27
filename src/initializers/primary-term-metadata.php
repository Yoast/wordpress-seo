<?php

namespace Yoast\WP\SEO\Initializers;

use WPSEO_Meta;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;

/**
 * Add primary term rest field.
 */
class Primary_Term_Metadata implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Primary term helper
	 *
	 * @var Primary_Term_Helper
	 */
	private $primary_term_helper;

	/**
	 * Constructor.
	 *
	 * @param Primary_Term_Helper $primary_term_helper Primary term helper.
	 */
	public function __construct( Primary_Term_Helper $primary_term_helper ) {
		$this->primary_term_helper = $primary_term_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function initialize() {
		\add_action( 'rest_api_init', [ $this, 'register_primary_terms_field' ] );
	}

	/**
	 * Register primary term meta for taxonomies that are added through the 'wpseo_primary_term_taxonomies' filter.
	 *
	 * @return void
	 */

	/**
	 * Add rest fields for words for linking.
	 *
	 * @return void
	 */
	public function register_primary_terms_field() {

		\register_rest_field(
			'post',
			WPSEO_Meta::$meta_prefix . 'primary_terms',
			[
				'get_callback'    => [ $this, 'get_primary_terms' ],
				'update_callback' => [ $this, 'save_primary_terms' ],
				'schema'          => [
					'arg_options' => [
						'sanitize_callback' => [ $this, 'sanitize_primary_terms' ],
					],
					'type'        => 'object',
					'properties'  => $this->get_property_types(),
					'context'     => [ 'edit' ],
				],
			]
		);
	}

	/**
	 * Get property types.
	 *
	 * @return array<string,array<string,string>> The property types.
	 */
	private function get_property_types() {
		$post_id       = \get_the_ID();
		$taxonomies    = $this->primary_term_helper->get_primary_term_taxonomies( $post_id );
		$primary_terms = [];
		foreach ( $taxonomies as $taxonomy ) {
			$primary_terms[ $taxonomy->name ] = [ 'type' => 'string' ];
		}
		return $primary_terms;
	}

	/**
	 * Save the primary terms.
	 *
	 * @param array<string,string> $primary_terms The primary terms to be saved.
	 * @param WP_Post              $post          The post object.
	 *
	 * @return void
	 */
	public function save_primary_terms( $primary_terms, $post ) {
		foreach ( $primary_terms as $taxonomy => $term_id ) {
			$meta_key = WPSEO_Meta::$meta_prefix . 'primary_' . $taxonomy;
			if ( $term_id ) {
				\update_post_meta( $post->ID, $meta_key, $term_id );
			}
			else {
				\delete_post_meta( $post->ID, $meta_key );
			}
		}
	}

	/**
	 * Sanitize primary terms.
	 *
	 * @param array<string,string> $primary_terms The value to sanitize.
	 *
	 * @return array<string,string> The sanitized value.
	 */
	public function sanitize_primary_terms( $primary_terms ) {
		if ( ! \is_array( $primary_terms ) ) {
			return [];
		}
		$clean = [];
		foreach ( $primary_terms as $taxonomy => $term_id ) {
			$int                = WPSEO_Utils::validate_int( $term_id );
			$clean[ $taxonomy ] = ( $int !== false && $int > 0 ) ? \strval( $int ) : '';
		}
		return $clean;
	}

	/**
	 * Get primary terms.
	 *
	 * phpcs:disable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification
	 *
	 * @param array $post The post data.
	 *
	 * @return array<string,string>
	 */
	public function get_primary_terms( $post ) {
		$taxonomies    = $this->primary_term_helper->get_primary_term_taxonomies( $post['id'] );
		$primary_terms = [];
		foreach ( $taxonomies as $taxonomy ) {
			$meta_key                         = WPSEO_Meta::$meta_prefix . 'primary_' . $taxonomy->name;
			$primary_term                     = \get_post_meta( $post['id'], $meta_key, true );
			$primary_terms[ $taxonomy->name ] = ( $primary_term ?? '' );
		}
		return $primary_terms;
	}
}
