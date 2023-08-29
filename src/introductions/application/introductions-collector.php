<?php

namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Item;
use Yoast\WP\SEO\Introductions\Domain\Introductions_Bucket;

/**
 * Manages the collection of introductions.
 *
 * @makePublic
 */
class Introductions_Collector {

	/**
	 * Holds all the introductions.
	 *
	 * @var Introduction_Interface[]
	 */
	private $introductions;

	/**
	 * Constructs the collector.
	 *
	 * @param Introduction_Interface ...$introductions All the introductions.
	 */
	public function __construct( Introduction_Interface ...$introductions ) {
		$this->introductions = $this->add_introductions( ...$introductions );
	}

	/**
	 * Gets the data for the introductions.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return array The list of introductions.
	 */
	public function get_for( $user_id ) {
		$bucket   = new Introductions_Bucket();
		$metadata = $this->get_metadata( $user_id );

		foreach ( $this->introductions as $introduction ) {
			if ( ! $introduction->should_show() ) {
				continue;
			}
			if ( $this->is_seen( $introduction->get_name(), $metadata ) ) {
				continue;
			}
			$bucket->add_introduction(
				new Introduction_Item( $introduction->get_name(), $introduction->get_priority() )
			);
		}

		return $bucket->to_array();
	}

	/**
	 * Filters introductions with the 'wpseo_introductions' filter.
	 *
	 * @param Introduction_Interface ...$introductions The introductions.
	 *
	 * @return Introduction_Interface[]
	 */
	private function add_introductions( Introduction_Interface ...$introductions ) {
		/**
		 * Filter: Adds the possibility to add additional introductions to be included.
		 *
		 * @internal
		 * @api Introduction_Interface This filter expects a list of Introduction_Interface instances and expects only Introduction_Interface implementations to be added to the list.
		 */
		$filtered_introductions = (array) \apply_filters( 'wpseo_introductions', $introductions );

		return \array_filter(
			$filtered_introductions,
			static function ( $introduction ) {
				return \is_a( $introduction, Introduction_Interface::class );
			}
		);
	}

	/**
	 * Retrieves the introductions metadata for the user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return array The introductions' metadata.
	 */
	private function get_metadata( $user_id ) {
		$metadata = \get_user_meta( $user_id, '_yoast_wpseo_introductions', true );
		if ( \is_array( $metadata ) ) {
			return $metadata;
		}

		return [];
	}

	/**
	 * Determines whether the user has seen the introduction.
	 *
	 * @param string   $name     The name.
	 * @param string[] $metadata The metadata.
	 *
	 * @return bool Whether the user has seen the introduction.
	 */
	private function is_seen( $name, $metadata ) {
		if ( \array_key_exists( $name, $metadata ) ) {
			return (bool) $metadata[ $name ];
		}

		return false;
	}
}
