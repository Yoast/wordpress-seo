<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * WordPress Permalink structure watcher.
 *
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Permalink_Integrity_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The indexable permalink watcher.
	 *
	 * @var Indexable_Permalink_Watcher
	 */
	protected $indexable_permalink_watcher;

	/**
	 * The indexable home url watcher.
	 *
	 * @var Indexable_HomeUrl_Watcher
	 */
	protected $indexable_homeurl_watcher;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	protected $permalink_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Permalink_Integrity_Watcher constructor.
	 *
	 * @param Options_Helper              $option            The options helper.
	 * @param Permalink_Helper            $permalink_helper  The permalink helper.
	 * @param Post_Type_Helper            $post_type_helper  The post type helper.
	 * @param Taxonomy_Helper             $taxonomy_helper   The taxonomy helper.
	 * @param Indexable_Permalink_Watcher $permalink_watcher The indexable permalink watcher.
	 * @param Indexable_HomeUrl_Watcher   $homeurl_watcher   The home url watcher.
	 */
	public function __construct( Options_Helper $option,
								Permalink_Helper $permalink_helper,
								Post_Type_Helper $post_type_helper,
								Taxonomy_Helper $taxonomy_helper,
								Indexable_Permalink_Watcher $permalink_watcher,
								Indexable_HomeUrl_Watcher $homeurl_watcher ) {
		$this->options_helper              = $option;
		$this->permalink_helper            = $permalink_helper;
		$this->post_type_helper            = $post_type_helper;
		$this->taxonomy_helper             = $taxonomy_helper;
		$this->indexable_permalink_watcher = $permalink_watcher;
		$this->indexable_homeurl_watcher   = $homeurl_watcher;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_frontend_presentation', [ $this, 'compare_permalink_for_page' ], 10, 1 );
	}

	/**
	 * Checks if the permalink integrity check should be performed.
	 *
	 * Returns true if the type is a key in the samples array and it has not been checked in the past week,
	 * false otherwise.
	 *
	 * @param string $type              "type-subtype" string of the indexable.
	 * @param array  $permalink_samples The permalink samples array.
	 *
	 * @return boolean Whether the permalink integrity check should be performed.
	 */
	public function should_perform_check( $type, $permalink_samples ) {
		if ( ! array_key_exists( $type, $permalink_samples ) ) {
			return false;
		}
		return $permalink_samples[ $type ] < ( \time() - ( 60 * 60 * 24 * 7 ) );
	}

	/**
	 * Compares the permalink of the current page to the indexable permalink. If there is a difference and the problem
	 * can be linked to a home url or permalink structure change, the affected permalink are reset. If no reason is
	 * found, the dynamic permalink fallback is enabled.
	 *
	 * The comparison is only done when the dynamic permalink fallback is not already enabled, and the type of the
	 * current page has not been checked in the past week.
	 *
	 * @param Indexable_Presentation $presentation The indexables presentation.
	 *
	 * @return Indexable_Presentation The untouched presentation of the indexable.
	 */
	public function compare_permalink_for_page( $presentation ) {
		if ( $this->options_helper->get( 'dynamic_permalinks' ) ) {
			return $presentation;
		}

		$permalink_samples = $this->options_helper->get( 'dynamic_permalink_samples' );

		if ( empty( $permalink_samples ) ) {
			$permalink_samples = $this->get_dynamic_permalink_samples();
		}

		$indexable = $presentation->model;
		$type      = $indexable->object_type . '-' . $indexable->object_sub_type;

		if ( ! $this->should_perform_check( $type, $permalink_samples ) ) {
			return $presentation;
		}

		$permalink_samples = $this->maybe_get_new_permalink_samples( $permalink_samples );
		$this->update_permalink_samples( $type, $permalink_samples );

		// If permalink of current page is the same as the indexable permalink, do nothing.
		if ( $indexable->permalink === $this->permalink_helper->get_permalink_for_indexable( $indexable ) ) {
			return $presentation;
		}

		if ( $this->indexable_permalink_watcher->should_reset_permalinks() ||
			$this->indexable_permalink_watcher->should_reset_categories() ||
			$this->indexable_permalink_watcher->should_reset_tags()
		) {
			$this->indexable_permalink_watcher->force_reset_permalinks();
			return $presentation;
		}

		if ( $this->indexable_homeurl_watcher->should_reset_permalinks() ) {
			$this->indexable_homeurl_watcher->force_reset_permalinks();
			return $presentation;
		}

		// If no reason is found for the difference in permalinks, the dynamic permalink mode is enabled.
		$this->options_helper->set( 'dynamic_permalinks', true );
		return $presentation;
	}

	/**
	 * Collects all public post and taxonomy types and saves them in an associative holding the combination of
	 * indexable object_type and object_sub_type as the key and a timestamp as the value.
	 *
	 * @return array The associative array with the object-type and object-sub-type as the key
	 * and a timestamp value as the value.
	 */
	public function get_dynamic_permalink_samples() {
		$permalink_samples = [];

		$post_types = $this->post_type_helper->get_public_post_types();
		foreach ( $post_types as $type ) {
			$permalink_samples[ 'post-' . $type ] = \time();
		}

		$taxonomies = $this->taxonomy_helper->get_public_taxonomies();
		foreach ( $taxonomies as $type ) {
			$permalink_samples[ 'term-' . $type ] = \time();
		}
		return $permalink_samples;
	}

	/**
	 * Checks if the dynamic_permalink_samples_array has changed and updates the option if this is the case.
	 *
	 * @param array $permalink_samples The current dynamic_permalink_samples option array.
	 *
	 * @return array The dynamic_permalink_samples.
	 */
	public function maybe_get_new_permalink_samples( $permalink_samples ) {
		$new_permalink_samples = $this->get_dynamic_permalink_samples();

		if ( empty( array_diff_key( $permalink_samples, $new_permalink_samples ) ) &&
			empty( array_diff_key( $new_permalink_samples, $permalink_samples ) ) ) {
			return $permalink_samples;
		}

		$this->options_helper->set( 'dynamic_permalink_samples', $new_permalink_samples );
		return $new_permalink_samples;
	}

	/**
	 * Updated the dynamic_permalink_samples options with a new timestamp for $type.
	 *
	 * @param string $type              "type-subtype" string of the indexable.
	 * @param array  $permalink_samples The permalink samples array.
	 *
	 * @return void
	 */
	public function update_permalink_samples( $type, $permalink_samples ) {
		$permalink_samples[ $type ] = \time();
		$this->options_helper->set( 'dynamic_permalink_samples', $permalink_samples );
	}
}
