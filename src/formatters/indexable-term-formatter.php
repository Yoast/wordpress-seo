<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\WP\Free\Formatters;

use WPSEO_Taxonomy_Meta;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Term_Formatter {

	/**
	 * The current term ID.
	 *
	 * @var int
	 */
	protected $term_id;

	/**
	 * The taxonomy the term belongs to.
	 *
	 * @var string
	 */
	protected $taxonomy;

	/**
	 * Term constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $term_id  ID of the term to save data for.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 */
	public function __construct( $term_id, $taxonomy ) {
		$this->term_id  = $term_id;
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Formats the data.
	 *
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function format( $indexable ) {
		$term_meta = $this->get_meta_data();

		$indexable->permalink       = $this->get_permalink();
		$indexable->object_sub_type = $this->taxonomy;

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( 'wpseo_focuskw', $term_meta ),
			$this->get_meta_value( 'wpseo_linkdex', $term_meta )
		);

		$indexable->is_robots_noindex = $this->get_noindex_value( $this->get_meta_value( 'wpseo_noindex', $term_meta ) );

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{ $indexable_key } = $this->get_meta_value( $meta_key, $term_meta );
		}

		foreach ( $this->get_indexable_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->set_meta( $indexable_key, $this->get_meta_value( $meta_key, $term_meta ) );
		}

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
		return array(
			'wpseo_canonical'     => 'canonical',
			'wpseo_focuskw'       => 'primary_focus_keyword',
			'wpseo_title'         => 'title',
			'wpseo_desc'          => 'description',
			'wpseo_content_score' => 'readability_score',
			'wpseo_bctitle'       => 'breadcrumb_title',
		);
	}

	/**
	 * Retrieves the indexable meta lookup table.
	 *
	 * @return array Lookup table for the indexable meta fields.
	 */
	protected function get_indexable_meta_lookup() {
		return array(
			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_opengraph-image'       => 'og_image',
			'wpseo_twitter-title'         => 'twitter_title',
			'wpseo_twitter-description'   => 'twitter_description',
			'wpseo_twitter-image'         => 'twitter_image',
		);
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
		if ( ! \array_key_exists( $meta_key, $term_meta ) ) {
			return null;
		}

		$value = $term_meta[ $meta_key ];
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Retrieves the meta data for a term.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool|array The meta data for the term.
	 */
	protected function get_meta_data() {
		return WPSEO_Taxonomy_Meta::get_term_meta( $this->term_id, $this->taxonomy );
	}

	/**
	 * Retrieves the permalink for a term.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string|\WP_Error The permalink for the term.
	 */
	protected function get_permalink() {
		return \get_term_link( $this->term_id, $this->taxonomy );
	}
}
