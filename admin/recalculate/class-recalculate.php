<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Abstract class to force methods in recalculate classes.
 */
abstract class WPSEO_Recalculate {

	/**
	 * @var array The options stored in the database
	 */
	protected $options;

	/**
	 * @var int
	 */
	protected $items_per_page = 20;

	/**
	 * Saves the array with scores to the database.
	 *
	 * @param array $scores Array with the score for each item.
	 */
	abstract public function save_scores( array $scores );

	/**
	 * Gets the items and parses it to an response
	 *
	 * @param integer $paged The current page number.
	 *
	 * @return string
	 */
	abstract protected function get_items( $paged );

	/**
	 * Maps the items to an array for the response
	 *
	 * @param mixed $item Object with data to parse.
	 *
	 * @return array
	 */
	abstract protected function item_to_response( $item );


	/**
	 * Gets the items to recalculate
	 *
	 * @param int $paged The current page number.
	 *
	 * @return array Items that can be recalculated.
	 */
	public function get_items_to_recalculate( $paged ) {
		$return = array();

		$paged = abs( $paged );
		$this->options = WPSEO_Options::get_all();

		$items = $this->get_items( $paged );

		$return['items']       = $this->parse_items( $items );
		$return['total_items'] = count( $items );

		if ( $return['total_items'] >= $this->items_per_page ) {
			$return['next_page'] = ( $paged + 1 );
		}

		return $return;
	}

	/**
	 * Parse the posts|terms with the value we need
	 *
	 * @param array $items The items to parse.
	 *
	 * @return array
	 */
	protected function parse_items( array $items ) {
		$return = array();
		foreach ( $items as $item ) {
			$response = $this->item_to_response( $item );
			if ( ! empty( $response ) ) {
				$return[] = $response;
			}
		}

		return $return;
	}

	/**
	 * Get default from the options for given field
	 *
	 * @param string $field  The field for which to get the default options.
	 * @param string $suffix The post type.
	 *
	 * @return bool|string
	 */
	protected function default_from_options( $field, $suffix ) {
		$target_option_field = $field . '-' . $suffix;
		if ( ! empty( $this->options[ $target_option_field ] ) ) {
			return $this->options[ $target_option_field ];
		}

		return false;
	}
}
