<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\WP\Free\Formatters;

use Yoast\WP\Free\Models\Indexable;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Author_Formatter {

	/**
	 * The current user id.
	 *
	 * @var int
	 */
	protected $user_id;

	/**
	 * Indexable Term constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user to retrieve the indexable for.
	 */
	public function __construct( $user_id ) {
		$this->user_id = $user_id;
	}

	/**
	 * Formats the data.
	 *
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function format( $indexable ) {
		$meta_data = $this->get_meta_data();

		$indexable->permalink              = $this->get_permalink();
		$indexable->title                  = $meta_data['wpseo_title'];
		$indexable->description            = $meta_data['wpseo_metadesc'];
		$indexable->is_cornerstone         = false;
		$indexable->is_robots_noindex      = $this->get_noindex_value( $meta_data['wpseo_noindex_author'] );
		$indexable->is_robots_nofollow     = null;
		$indexable->is_robots_noarchive    = null;
		$indexable->is_robots_noimageindex = null;
		$indexable->is_robots_nosnippet    = null;

		return $indexable;
	}

	/**
	 * Retrieves the meta data for this indexable.
	 *
	 * @return array List of meta entries.
	 */
	protected function get_meta_data() {
		$keys = array(
			'wpseo_title',
			'wpseo_metadesc',
			'wpseo_noindex_author',
		);

		$output = array();
		foreach ( $keys as $key ) {
			$output[ $key ] = $this->get_author_meta( $key );
		}

		return $output;
	}

	/**
	 * Retrieves the value for noindex.
	 *
	 * @param string $noindex Current noindex value.
	 *
	 * @return bool True if noindex is selected, false if not.
	 */
	protected function get_noindex_value( $noindex ) {
		return $noindex === 'on';
	}

	/**
	 * Retrieves the author meta.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $key The meta entry to retrieve.
	 *
	 * @return string The value of the meta field.
	 */
	protected function get_author_meta( $key ) {
		$value = \get_the_author_meta( $key, $this->user_id );
		if ( is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Retrieves the permalink of a user.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The permalink.
	 */
	protected function get_permalink() {
		return \get_author_posts_url( $this->user_id );
	}
}
