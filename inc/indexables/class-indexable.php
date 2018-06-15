<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class Indexable {

	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var Object_Type
	 */
	private $type;

	/**
	 * @var Meta_Values
	 */
	private $meta_values;

	/**
	 * @var OpenGraph
	 */
	private $opengraph;

	/**
	 * @var Twitter
	 */
	private $twitter;

	/**
	 * @var Robots
	 */
	private $robots;

	/**
	 * Indexable constructor.
	 *
	 * @param int 		  $id			The indexable's ID.
	 * @param Object_Type $type			The object type.
	 * @param Meta_Values $meta_values	The meta values for the indexable.
	 * @param OpenGraph   $opengraph	The OpenGraph values for the indexable.
	 * @param Twitter     $twitter		The Twitter values for the indexable.
	 * @param Robots      $robots		The robots values for the indexable.
	 */
	public function __construct( $id, Object_Type $type, Meta_Values $meta_values, OpenGraph $opengraph, Twitter $twitter, Robots $robots ) {
		if ( ! WPSEO_Validator::is_integer( $id ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $id, 'ID' );
		}

		$this->id 		   = $id;
		$this->type 	   = $type;
		$this->meta_values = $meta_values;
		$this->opengraph   = $opengraph;
		$this->twitter 	   = $twitter;
		$this->robots 	   = $robots;
	}

	/**
	 * Returns an array representation of the Indexable object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array_merge(
			array( 'object_id' => $this->id ),
			$this->type->to_array(),
			$this->meta_values->to_array(),
			$this->opengraph->to_array(),
			$this->twitter->to_array(),
			$this->robots->to_array()
		);
	}

}
