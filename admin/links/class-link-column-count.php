<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link column count. This class contains the count for each post id on the current page .
 */
class WPSEO_Link_Column_Count {

	/** @var array */
	protected $count = array();

	/**
	 * Sets the counts for the set target field.
	 *
	 * @param array $post_ids The posts to get the count for.
	 */
	public function set( $post_ids ) {
		if ( empty( $post_ids ) ) {
			return;
		}

		$this->count = $this->get_results( $post_ids );
	}

	/**
	 * Gets the link count for given post id.
	 *
	 * @param int    $post_id      The post id.
	 * @param string $target_field The field to show.
	 *
	 * @return int|null The total amount of links or null if the target field
	 *                  does not exist for the given post id.
	 */
	public function get( $post_id, $target_field = 'internal_link_count' ) {
		if ( array_key_exists( $post_id, $this->count ) && array_key_exists( $target_field, $this->count[ $post_id ] ) ) {
			return $this->count[ $post_id ][ $target_field ];
		}

		return null;
	}

	/**
	 * Gets the link count for the given post ids.
	 *
	 * @param array $post_ids Array with post_ids.
	 *
	 * @return array
	 */
	protected function get_results( $post_ids ) {
		global $wpdb;

		$storage = new WPSEO_Meta_Storage();

		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT internal_link_count, incoming_link_count, object_id
				FROM ' . $storage->get_table_name() . '
				WHERE object_id IN (' . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ')',
				$post_ids
			),
			ARRAY_A
		);

		$output = array();
		foreach ( $results as $result ) {
			$output[ (int) $result['object_id'] ] = array(
				'internal_link_count' => $result['internal_link_count'],
				'incoming_link_count' => (int) $result['incoming_link_count'],
			);
		}

		// Set unfound items to zero.
		foreach ( $post_ids as $post_id ) {
			if ( ! array_key_exists( $post_id, $output ) ) {
				$output[ $post_id ] = array(
					'internal_link_count' => null,
					'incoming_link_count' => 0,
				);
			}
		}

		return $output;
	}
}
