<?php
/**
 * A helper object for post types.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Post_Type_Helper
 */
class Post_Type_Helper {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Post_Type_Helper constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Checks if the request post type is public and indexable.
	 *
	 * @param string $post_type_name The name of the post type to lookup.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return bool True when post type is set to index.
	 */
	public function is_indexable( $post_type_name ) {
		if ( $this->options_helper->get( 'disable-' . $post_type_name, false ) ) {
			return false;
		}

		return ( $this->options_helper->get( 'noindex-' . $post_type_name, false ) === false );
	}

	/**
	 * Returns an array with the public post types.
	 *
	 * @param string $output The output type to use.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return array Array with all the public post_types.
	 */
	public function get_public_post_types( $output = 'names' ) {
		return \get_post_types( [ 'public' => true ], $output );
	}

	/**
	 * Returns an array with the accessible post types.
	 *
	 * An accessible post type is a post type that is public and isn't set as no-index (robots).
	 *
	 * @return array Array with all the accessible post_types.
	 */
	public function get_accessible_post_types() {
		$post_types = get_post_types( [ 'public' => true ] );
		$post_types = array_filter( $post_types, 'is_post_type_viewable' );

		/**
		 * Filter: 'wpseo_accessible_post_types' - Allow changing the accessible post types.
		 *
		 * @api array $post_types The public post types.
		 */
		$post_types = apply_filters( 'wpseo_accessible_post_types', $post_types );

		// When the array gets messed up somewhere.
		if ( ! is_array( $post_types ) ) {
			return [];
		}

		return $post_types;
	}

	/**
	 * Checks if the post type with the given name has an archive page.
	 *
	 * @param WP_Post_Type|string $post_type The name of the post type to check.
	 *
	 * @return bool True when the post type has an archive page.
	 */
	public function has_archive( $post_type ) {
		if ( \is_string( $post_type ) ) {
			$post_type = \get_post_type_object( $post_type );
		}

		return ( ! empty( $post_type->has_archive ) );
	}
}
