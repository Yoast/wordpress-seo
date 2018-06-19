<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class Link {

	/**
	 * @var int
	 */
	private $count;

	/**
	 * @var int
	 */
	private $incoming_count;

	/**
	 * Link constructor.
	 *
	 * @param int $count 	  		The link count.
	 * @param int $incoming_count 	The incoming link count.
	 *
	 * @throws Exception
	 */
	public function __construct( $count, $incoming_count ) {
		if ( ! WPSEO_Validator::is_integer( $count ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $count, 'count' );
		}

		$this->count = $count;

		if ( ! WPSEO_Validator::is_integer( $incoming_count ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $incoming_count, 'incoming_count' );
		}

		$this->incoming_count = $incoming_count;
	}

	/**
	 * Returns an array representation of the Link object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'link_count'	 	  => $this->count,
			'incoming_link_count' => $this->incoming_count,
		);
	}
}
