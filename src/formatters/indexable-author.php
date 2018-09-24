<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\YoastSEO\Formatters;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Author {

	/**
	 * The current user id.
	 *
	 * @var int
	 */
	protected $user_id;

	/**
	 * Indexable Term constructor.
	 *
	 * @param int  $user_id     The user to retrieve the indexable for.
	 */
	public function __construct( $user_id ) {
		$this->user_id  = $user_id;
	}

	/**
	 * Formats the data.
	 *
	 * @return array The formatted data.
	 */
	public function format() {
		$meta_data = $this->get_meta_data();
		$formatted = array();

		$formatted['title']             = $meta_data['wpseo_title'];
		$formatted['description']       = $meta_data['wpseo_metadesc'];
		$formatted['is_robots_noindex'] = $this->get_noindex_value( $meta_data['wpseo_noindex_author'] );

		return $formatted;
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
			'wpseo_excludeauthorsitemap',
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
		return \get_the_author_meta( $key, $this->user_id );
	}
}
