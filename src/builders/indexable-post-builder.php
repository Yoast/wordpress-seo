<?php
/**
 * Post Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Exception;
use Yoast\WP\Free\Models\Indexable_Extension;
use Yoast\WP\Free\Repositories\SEO_Meta_Repository;

/**
 * Formats the post meta to indexable format.
 */
class Indexable_Post_Builder {

	/**
	 * @var \Yoast\WP\Free\Repositories\SEO_Meta_Repository
	 */
	protected $seo_meta_repository;

	/**
	 * Indexable_Post_Builder constructor.
	 *
	 * @param \Yoast\WP\Free\Repositories\SEO_Meta_Repository $seo_meta_repository The SEO Meta repository.
	 */
	public function __construct( SEO_Meta_Repository $seo_meta_repository ) {
		$this->seo_meta_repository = $seo_meta_repository;
	}

	/**
	 * Formats the data.
	 *
	 * @param int                             $post_id   The post ID to use.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function build( $post_id, $indexable ) {
		$indexable->permalink       = \get_permalink( $post_id );
		$indexable->object_sub_type = \get_post_type( $post_id );

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( $post_id, 'focuskw' ),
			(int) $this->get_meta_value( $post_id, 'linkdex' )
		);

		$indexable->readability_score = (int) $this->get_meta_value( $post_id, 'content_score' );

		$indexable->is_cornerstone    = ( $this->get_meta_value( $post_id, 'is_cornerstone' ) === '1' );
		$indexable->is_robots_noindex = $this->get_robots_noindex(
			$this->get_meta_value( $post_id, 'meta-robots-noindex' )
		);

		// Set additional meta-robots values.
		$indexable->is_robots_nofollow = ( $this->get_meta_value( $post_id, 'meta-robots-nofollow' ) === '1' );
		$noindex_advanced              = $this->get_meta_value( $post_id, 'meta-robots-adv' );
		$meta_robots                   = \explode( ',', $noindex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{ 'is_robots_' . $meta_robots_option } = \in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{ $indexable_key } = $this->get_meta_value( $post_id, $meta_key );
		}

		$indexable = $this->set_link_count( $post_id, $indexable );

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
		return [ 'noimageindex', 'noarchive', 'nosnippet' ];
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
			'focuskw'               => 'primary_focus_keyword',
			'canonical'             => 'canonical',
			'title'                 => 'title',
			'metadesc'              => 'description',
			'bctitle'               => 'breadcrumb_title',
			'opengraph-title'       => 'og_title',
			'opengraph-image'       => 'og_image',
			'opengraph-description' => 'og_description',
			'twitter-title'         => 'twitter_title',
			'twitter-image'         => 'twitter_image',
			'twitter-description'   => 'twitter_description',
		];
	}

	/**
	 * Updates the link count from existing data.
	 *
	 * @param int                             $post_id   The post ID to use.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to extend.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	protected function set_link_count( $post_id, $indexable ) {
		try {
			$seo_meta = $this->seo_meta_repository->find_by_post_id( $post_id );

			if ( $seo_meta ) {
				$indexable->link_count          = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		// @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
		} catch ( Exception $exception ) {
			// Do nothing...
		}

		return $indexable;
	}

	/**
	 * Retrieves the current value for the meta field.
	 *
	 * @param int    $post_id  The post ID to use.
	 * @param string $meta_key Meta key to fetch.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $post_id, $meta_key ) {
		$value = \WPSEO_Meta::get_value( $meta_key, $post_id );
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}
}
