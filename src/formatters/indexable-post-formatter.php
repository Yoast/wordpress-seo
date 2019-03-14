<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\WP\Free\Formatters;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Models\SEO_Meta;

/**
 * Formats the post meta to indexable format.
 */
class Indexable_Post_Formatter {

	/**
	 * The current post id.
	 *
	 * @var int
	 */
	protected $post_id;

	/**
	 * Post constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id to use.
	 */
	public function __construct( $post_id ) {
		$this->post_id = $post_id;
	}

	/**
	 * Formats the data.
	 *
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function format( $indexable ) {
		$indexable->permalink       = $this->get_permalink();
		$indexable->object_sub_type = $this->get_post_type();

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( 'focuskw' ),
			$this->get_meta_value( 'linkdex' )
		);

		$indexable->is_cornerstone    = ( $this->get_meta_value( 'is_cornerstone' ) === '1' );
		$indexable->is_robots_noindex = $this->get_robots_noindex(
			$this->get_meta_value( 'meta-robots-noindex' )
		);

		// Set additional meta-robots values.
		$noindex_advanced = $this->get_meta_value( 'meta-robots-adv' );
		$meta_robots      = explode( ',', $noindex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{ 'is_robots_' . $meta_robots_option } = in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{ $indexable_key } = $this->get_meta_value( $meta_key );
		}

		foreach ( $this->get_indexable_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->set_meta( $indexable_key, $this->get_meta_value( $meta_key ) );
		}

		$indexable = $this->set_link_count( $indexable );

		return $indexable;
	}

	/**
	 * Converts the meta robots noindex value to the indexable value.
	 *
	 * @param int $value Meta value to convert.
	 *
	 * @return bool|null True for noindex, false for index, null for default of parent/type.
	 */
	protected function get_robots_noindex( $value ) {
		$value = (int) $value;

		switch ( $value ) {
			case 1:
				return true;
			case 2:
				return false;
		}

		return null;
	}

	/**
	 * Retrieves the robot options to search for.
	 *
	 * @return array List of robots values.
	 */
	protected function get_robots_options() {
		return array( 'noimageindex', 'noarchive', 'nosnippet' );
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
			'focuskw'               => 'primary_focus_keyword',
			'content_score'         => 'readability_score',
			'canonical'             => 'canonical',
			'meta-robots-nofollow'  => 'is_robots_nofollow',
			'title'                 => 'title',
			'metadesc'              => 'description',
			'bctitle'               => 'breadcrumb_title',
		);
	}

	/**
	 * Retrieves the indexable meta lookup table.
	 *
	 * @return array Lookup table for the indexable meta fields.
	 */
	protected function get_indexable_meta_lookup() {
		return array(
			'opengraph-title'       => 'og_title',
			'opengraph-image'       => 'og_image',
			'opengraph-description' => 'og_description',
			'twitter-title'         => 'twitter_title',
			'twitter-image'         => 'twitter_image',
			'twitter-description'   => 'twitter_description',
		);
	}

	/**
	 * Updates the link count from existing data.
	 *
	 * @param Indexable $indexable The indexable to extend.
	 *
	 * @return Indexable The extended indexable.
	 */
	protected function set_link_count( $indexable ) {
		try {
			$seo_meta = $this->get_seo_meta();

			if ( $seo_meta ) {
				$indexable->link_count          = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		// @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
		} catch ( \Exception $exception ) {
			// Do nothing...
		}

		return $indexable;
	}

	/**
	 * Retrieves the current value for the meta field.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $meta_key Meta key to fetch.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $meta_key ) {
		$value = \WPSEO_Meta::get_value( $meta_key, $this->post_id );
		if ( is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Retrieves the permalink for a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return false|string The permalink.
	 */
	protected function get_permalink() {
		return \get_permalink( $this->post_id );
	}

	/**
	 * Retrieves the post type of a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return false|string The post type.
	 */
	protected function get_post_type() {
		return \get_post_type( $this->post_id );
	}

	/**
	 * Retrieves the set SEO Meta for current post id.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return SEO_Meta The SEO meta for current post id.
	 */
	protected function get_seo_meta() {
		return SEO_Meta::find_by_post_id( $this->post_id );
	}
}
