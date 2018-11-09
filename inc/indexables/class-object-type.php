<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Post_Indexable
 */
abstract class WPSEO_Object_Type {
	/**
	 * @var int The ID of the object.
	 */
	protected $id;

	/**
	 * @var string The type of the object.
	 */
	protected $type;

	/**
	 * @var string The subtype of the object.
	 */
	protected $sub_type;

	/**
	 * @var string The permalink of the object.
	 */
	protected $permalink;

	/**
	 * WPSEO_Object_Type constructor.
	 *
	 * @param int    $id        The ID of the object.
	 * @param string $type      The type of object.
	 * @param string $subtype   The subtype of the object.
	 * @param string $permalink The permalink of the object.
	 */
	public function __construct( $id, $type, $subtype, $permalink ) {
		$this->id        = (int) $id;
		$this->type      = $type;
		$this->sub_type  = $subtype;
		$this->permalink = $permalink;
	}

	/**
	 * Gets the ID.
	 *
	 * @return int The ID.
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Gets the type.
	 *
	 * @return string The type.
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Gets the subtype.
	 *
	 * @return string The subtype.
	 */
	public function get_subtype() {
		return $this->sub_type;
	}

	/**
	 * Gets the permalink.
	 *
	 * @return string The permalink.
	 */
	public function get_permalink() {
		return $this->permalink;
	}

	/**
	 * Determines whether the passed type is equal to the object's type.
	 *
	 * @param string $type The type to check.
	 *
	 * @return bool Whether or not the passed type is equal.
	 */
	public function is_type( $type ) {
		return $this->type === $type;
	}

	/**
	 * Determines whether the passed subtype is equal to the object's subtype.
	 *
	 * @param string $sub_type The subtype to check.
	 *
	 * @return bool Whether or not the passed subtype is equal.
	 */
	public function is_subtype( $sub_type ) {
		return $this->sub_type === $sub_type;
	}
}
