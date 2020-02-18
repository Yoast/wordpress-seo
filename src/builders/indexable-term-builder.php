<?php
/**
 * Term Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Term_Builder {
	use Indexable_Social_Image_Trait;

	/**
	 * @var \Yoast\WP\SEO\Helpers\Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * Indexable_Term_Builder constructor.
	 *
	 * @param \Yoast\WP\SEO\Helpers\Taxonomy_Helper $taxonomy The taxonomy helper.
	 */
	public function __construct(
		Taxonomy_Helper $taxonomy
	) {
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Formats the data.
	 *
	 * @param int                            $term_id   ID of the term to save data for.
	 * @param \Yoast\WP\SEO\Models\Indexable $indexable The indexable to format.
	 *
	 * @throws \Exception If the term could not be found.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $term_id, $indexable ) {
		$term = \get_term( $term_id );

		if ( is_wp_error( $term ) ) {
			throw new \Exception( \current( \array_keys( $term->errors ) ) );
		}

		$term_link = \get_term_link( $term, $term->taxonomy );

		if ( is_wp_error( $term_link ) ) {
			throw new \Exception( \current( \array_keys( $term_link->errors ) ) );
		}

		$term_meta = $this->taxonomy->get_term_meta( $term );

		$indexable->object_id       = $term->term_id;
		$indexable->object_type     = 'term';
		$indexable->object_sub_type = $term->taxonomy;
		$indexable->permalink       = $term_link;

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( 'wpseo_focuskw', $term_meta ),
			$this->get_meta_value( 'wpseo_linkdex', $term_meta )
		);

		$indexable->is_robots_noindex = $this->get_noindex_value( $this->get_meta_value( 'wpseo_noindex', $term_meta ) );
		$indexable->is_public = $this->is_public( $indexable );

		$this->reset_social_images( $indexable );

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $this->get_meta_value( $meta_key, $term_meta );
		}

		if ( empty( $indexable->breadcrumb_title ) ) {
			$indexable->breadcrumb_title = $term->name;
		}

		$this->handle_social_images( $indexable );

		// Not implemented yet.
		$indexable->is_cornerstone         = false;
		$indexable->is_robots_nofollow     = null;
		$indexable->is_robots_noarchive    = null;
		$indexable->is_robots_noimageindex = null;
		$indexable->is_robots_nosnippet    = null;

		return $indexable;
	}

	/**
	 * Determines the value of is_public.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool Whether or not the term is public.
	 */
	protected function is_public( $indexable ) {
		// Check if the site wide taxonomy configuration is set to not index this taxonomy.
		$site_wide_is_taxonomy_indexable = $this->taxonomy->is_indexable( $indexable->object_sub_type );
		if ( $site_wide_is_taxonomy_indexable === false ) {
			return false;
		}

		// Check if the term's individual noindex value is set.
		if ( $indexable->is_robots_noindex === true ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves the is_robots_noindex value for the given term.
	 *
	 * @param string $taxonomy  The term's taxonomy.
	 * @param array  $term_meta The term's meta data.
	 *
	 * @return bool|null Whether the term's no_index
	 */
	protected function is_robots_noindex( $taxonomy, $term_meta ) {
		$site_wide_robots_noindex = ! $this->taxonomy->is_indexable( $taxonomy );
		if ( $site_wide_robots_noindex === true ) {
			return true;
		}

		return $this->get_noindex_value( $this->get_meta_value( 'wpseo_noindex', $term_meta ) );
	}

	/**
	 * Converts the meta noindex value to the indexable value.
	 *
	 * @param string $meta_value Term meta to base the value on.
	 *
	 * @return bool|null
	 */
	protected function get_noindex_value( $meta_value ) {
		if ( $meta_value === 'noindex' ) {
			return true;
		}

		if ( $meta_value === 'index' ) {
			return false;
		}

		return null;
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Retrieves the lookup table.
	 *
	 * @return array Lookup table for the indexable fields.
	 */
	protected function get_indexable_lookup() {
		return [
			'wpseo_canonical'             => 'canonical',
			'wpseo_focuskw'               => 'primary_focus_keyword',
			'wpseo_title'                 => 'title',
			'wpseo_desc'                  => 'description',
			'wpseo_content_score'         => 'readability_score',
			'wpseo_bctitle'               => 'breadcrumb_title',
			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_opengraph-image'       => 'og_image',
			'wpseo_opengraph-image-id'    => 'og_image_id',
			'wpseo_twitter-title'         => 'twitter_title',
			'wpseo_twitter-description'   => 'twitter_description',
			'wpseo_twitter-image'         => 'twitter_image',
			'wpseo_twitter-image-id'      => 'twitter_image_id',
		];
	}

	/**
	 * Retrieves a meta value from the given meta data.
	 *
	 * @param string $meta_key  The key to extract.
	 * @param array  $term_meta The meta data.
	 *
	 * @return null|string The meta value.
	 */
	protected function get_meta_value( $meta_key, $term_meta ) {
		if ( ! $term_meta || ! \array_key_exists( $meta_key, $term_meta ) ) {
			return null;
		}

		$value = $term_meta[ $meta_key ];
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Finds an alternative image for the social image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array|bool False when not found, array with data when found.
	 */
	protected function find_alternative_image( Indexable $indexable ) {
		return false;
	}
}
