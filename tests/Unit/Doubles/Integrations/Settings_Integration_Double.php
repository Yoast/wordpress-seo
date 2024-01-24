<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Integrations;

use Yoast\WP\SEO\Integrations\Settings_Integration;

/**
 * Class Settings_Integration_Double.
 */
final class Settings_Integration_Double extends Settings_Integration {

	/**
	 * Returns the post types that should be transformed.
	 *
	 * @param WP_Pst_Type[] $post_types The post types to transform.
	 *
	 * @return array The post types to transform.
	 */
	public function transform_post_types( $post_types ) {
		return parent::transform_post_types( $post_types );
	}

	/**
	 * Transforms the taxonomies, to represent them.
	 *
	 * @param WP_Taxonomy[] $taxonomies      The WP_Taxonomy array to transform.
	 * @param string[]      $post_type_names The post type names.
	 *
	 * @return array The taxonomies.
	 */
	public function transform_taxonomies( $taxonomies, $post_type_names ) {
		return parent::transform_taxonomies( $taxonomies, $post_type_names );
	}
}
