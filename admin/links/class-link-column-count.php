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

	/** @var string */
	protected $target_field;

	/**
	 * Sets the target field to use.
	 *
	 * @param string $target_field The field to get.
	 */
	public function __construct( $target_field ) {
		$this->target_field = $target_field;
	}

	/**
	 * Sets the counts for the set target field.
	 *
	 * @param array $post_ids The posts to get the count for.
	 */
	public function set( $post_ids ) {
		if ( empty( $post_ids )  ) {
			return;
		}

		$this->count = $this->get_results( $post_ids );
	}

	/**
	 * Gets the link count for given post id.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return int The total amount of links.
	 */
	public function get( $post_id ) {
		if ( array_key_exists( $post_id, $this->count ) ) {
			return (int) $this->count[ $post_id ];
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

		$storage = new WPSEO_Link_Storage();

		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT COUNT( id ) as total, %1$s as source_id
				FROM ' . $storage->get_table_name() . '
			    WHERE %1$s IN ( %2$s )
				GROUP BY %1$s',
				$this->target_field,
				implode( ',', $post_ids )
			),
			ARRAY_A
		);

		$output = array();
		foreach ( $results as $result ) {
			$output[ (int) $result['source_id'] ] = $result['total'];
		}

		// Set unfound items to zero.
		foreach ( $post_ids as $post_id ) {
			if ( ! array_key_exists( $post_id, $output ) ) {
				$output[ $post_id ] = 0;
			}
		}

		return $output;
	}
}
