<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */
class Object_Type {

	/**
	 * @var string
	 */
	private $type;

	/**
	 * @var string
	 */
	private $subtype;

	/**
	 * @var array
	 */
	private $valid_types = array( 'post', 'term' );

	/**
	 * Object Type constructor.
	 *
	 * @param string $type 	  The type.
	 * @param string $subtype The subtype.
	 *
	 * @throws Exception
	 */
	public function __construct( $type, $subtype ) {
		if ( ! in_array( $type, $this->valid_types, true ) ) {
			throw new \InvalidArgumentException( 'Invalid object type passed' );
		}

		$this->type    = $type;
		$this->subtype = $this->validate_subtype( $subtype );
	}

	/**
	 * Validates whether the passed subtype is valid or not.
	 *
	 * @param string $subtype The subtype to validate.
	 *
	 * @return string The subtype.
	 *
	 * @throws Exception
	 */
	private function validate_subtype( $subtype ) {
		if ( $this->type === 'post' && ! post_type_exists( $subtype ) ) {
			throw new \InvalidArgumentException( 'Invalid post subtype passed' );
		}

		if ( $this->type === 'term' && ! taxonomy_exists( $subtype ) ) {
			throw new \InvalidArgumentException( 'Invalid term object type passed' );
		}

		return $subtype;
	}

	/**
	 * Returns an array representation of the ObjectType object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'object_type'	 => $this->type,
			'object_subtype' => $this->subtype,
		);
	}
}
