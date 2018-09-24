<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\YoastSEO\Formatters;

use Yoast\YoastSEO\Yoast_Model;

/**
 * Formats the post meta to indexable format.
 */
class Indexable_Post {

	/**
	 * The current post id.
	 *
	 * @var int
	 */
	protected $post_id;

	/**
	 * Post constructor.
	 *
	 * @param int $post_id The post id to use.
	 */
	public function __construct( $post_id ) {
		$this->post_id = $post_id;
	}

	/**
	 * Formats the data.
	 *
	 * @return array The formatted data.
	 */
	public function format() {
		$formatted = array();

		$formatted['primary_focus_keyword_score'] = $this->get_keyword_score(
			$this->get_meta_value( 'focuskw' ),
			$this->get_meta_value( 'linkdex' )
		);

		$formatted['is_cornerstone']    = ( $this->get_meta_value( 'is_cornerstone' ) ) ? 1 : 0;
		$formatted['is_robots_noindex'] = $this->get_robots_noindex(
			$this->get_meta_value( 'meta-robots-noindex' )
		);

		// Set additional meta-robots values.
		$nonidex_advanced = $this->get_meta_value( 'meta-robots-adv' );
		$meta_robots      = explode( ',', $nonidex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$formatted['is_robots_' . $meta_robots_option ]= in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$formatted[ $indexable_key ] = $this->get_meta_value( $meta_key );
		}

		$formatted = $this->set_link_count( $formatted );

		return $formatted;
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
	 * Retrieves the current value for the meta field.
	 *
	 * @param string $meta_key Meta key to fetch.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $meta_key ) {
		return \WPSEO_Meta::get_value( $meta_key, $this->post_id );
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
	 * @return array Lookup table for the meta fields.
	 */
	protected function get_meta_lookup() {
		return array(
			'focuskw'               => 'primary_focus_keyword',
			'content_score'         => 'readability_score',
			'canonical'             => 'canonical',
			'meta-robots-nofollow'  => 'is_robots_nofollow',
			'title'                 => 'title',
			'metadesc'              => 'description',
			'bctitle'               => 'breadcrumb_title',
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
	 * @param array $formatted_data The data to extend.
	 *
	 * @return array The extended data.
	 */
	protected function set_link_count( $formatted_data ) {
		try {
			$seo_meta = Yoast_Model::of_type( 'SEO_Meta' )
			                       ->where( 'object_id', $this->post_id )
			                       ->find_one();

			if ( $seo_meta ) {
				$formatted_data['link_count']          = $seo_meta->internal_link_count;
				$formatted_data['incoming_link_count'] = $seo_meta->incoming_link_count;
			}
		} catch ( \Exception $exception ) {
			return $formatted_data;
		}

		return $formatted_data;
	}
}
