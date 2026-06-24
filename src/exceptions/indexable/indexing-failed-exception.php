<?php

namespace Yoast\WP\SEO\Exceptions\Indexable;

use Throwable;

/**
 * Exception thrown when building an indexable fails because of an unexpected error.
 *
 * Wraps the original throwable and carries the identity of the object that could not be built, so the
 * failing object can be reported all the way to the REST response and the user interface.
 */
class Indexing_Failed_Exception extends Indexable_Exception {

	/**
	 * The object ID of the indexable that failed to build.
	 *
	 * @var int
	 */
	private $object_id;

	/**
	 * The object type of the indexable that failed to build.
	 *
	 * @var string
	 */
	private $object_type;

	/**
	 * The object sub type of the indexable that failed to build.
	 *
	 * @var string|null
	 */
	private $object_sub_type;

	/**
	 * Constructs the exception.
	 *
	 * @param int         $object_id       The object ID of the indexable that failed to build.
	 * @param string      $object_type     The object type of the indexable that failed to build.
	 * @param string|null $object_sub_type The object sub type of the indexable that failed to build.
	 * @param Throwable   $previous        The error that caused the failure.
	 */
	public function __construct( $object_id, $object_type, $object_sub_type, Throwable $previous ) {
		$this->object_id       = $object_id;
		$this->object_type     = $object_type;
		$this->object_sub_type = $object_sub_type;

		parent::__construct(
			\sprintf(
				/* translators: 1: indexable object type; 2: object ID; 3: underlying error message. */
				'Yoast SEO could not build the %1$s indexable for object %2$d: %3$s',
				$object_type,
				$object_id,
				$previous->getMessage(),
			),
			0,
			$previous,
		);
	}

	/**
	 * Gets the object ID of the indexable that failed to build.
	 *
	 * @return int The object ID.
	 */
	public function get_object_id() {
		return $this->object_id;
	}

	/**
	 * Gets the object type of the indexable that failed to build.
	 *
	 * @return string The object type.
	 */
	public function get_object_type() {
		return $this->object_type;
	}

	/**
	 * Gets the object sub type of the indexable that failed to build.
	 *
	 * @return string|null The object sub type.
	 */
	public function get_object_sub_type() {
		return $this->object_sub_type;
	}
}
