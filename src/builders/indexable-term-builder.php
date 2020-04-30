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
	 * Holds the taxonomy helper instance.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * Indexable_Term_Builder constructor.
	 *
	 * @param \Yoast\WP\SEO\Helpers\Taxonomy_Helper $taxonomy The taxonomy helper.
	 */
	public function __construct( Taxonomy_Helper $taxonomy ) {
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Formats the data.
	 *
	 * @param int                            $term_id   ID of the term to save data for.
	 * @param \Yoast\WP\SEO\Models\Indexable $indexable The indexable to format.
	 *
	 * @return bool|Indexable The extended indexable. False when unable to build.
	 */
	public function build( $term_id, $indexable ) {
		$term = \get_term( $term_id );

		if ( $term === null ) {
			return false;
		}

		if ( is_wp_error( $term ) ) {
			return false;
		}

		$term_link = \get_term_link( $term, $term->taxonomy );

		if ( is_wp_error( $term_link ) ) {
			return false;
		}

		$term_meta = $this->taxonomy->get_term_meta( $term );

		$indexable->object_id       = $term->term_id;
		$indexable->object_type     = 'term';
		$indexable->object_sub_type = $term->taxonomy;
		$indexable->permalink       = $term_link;
		$indexable->blog_id         = \get_current_blog_id();

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( 'wpseo_focuskw', $term_meta ),
			$this->get_meta_value( 'wpseo_linkdex', $term_meta )
		);

		$indexable->is_robots_noindex = $this->get_noindex_value( $this->get_meta_value( 'wpseo_noindex', $term_meta ) );
		$indexable->is_public         = ( $indexable->is_robots_noindex === null ) ? null : ! $indexable->is_robots_noindex;

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
			'wpseo_opengraph-title'       => 'open_graph_title',
			'wpseo_opengraph-description' => 'open_graph_description',
			'wpseo_opengraph-image'       => 'open_graph_image',
			'wpseo_opengraph-image-id'    => 'open_graph_image_id',
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
		$content_image = $this->image->get_term_content_image( $indexable->object_id );
		if ( $content_image ) {
			return [
				'image'  => $content_image,
				'source' => 'first-content-image',
			];
		}

		return false;
	}
}
