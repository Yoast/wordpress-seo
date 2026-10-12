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
	 * The object ID of the indexable that failed to build, or null for id-less object types
	 * (e.g. home-page, system-page, date-archive, post-type-archive).
	 *
	 * @var int|null
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
	 * @param int|null    $object_id       The object ID of the indexable that failed to build, or null for id-less object types.
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
				/* translators: 1: description of the failing object (e.g. "post #123"); 2: underlying error message. */
				\__( 'Yoast SEO could not build the indexable for %1$s: %2$s', 'wordpress-seo' ),
				$this->get_object_description(),
				$previous->getMessage(),
			),
			0,
			$previous,
		);
	}

	/**
	 * Gets the object ID of the indexable that failed to build.
	 *
	 * @return int|null The object ID, or null for id-less object types.
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

	/**
	 * Describes the failing object as specifically as its indexable allows.
	 *
	 * Id-less object types fall back to the sub type when present (e.g. "system-page (404)",
	 * "post-type-archive (book)") and to the bare object type otherwise (e.g. "home-page").
	 *
	 * @return string The object description, e.g. "post #123", "system-page (404)" or "home-page".
	 */
	public function get_object_description() {
		if ( $this->object_id !== null ) {
			return \sprintf( '%1$s #%2$d', $this->object_type, $this->object_id );
		}

		if ( $this->object_sub_type !== null ) {
			return \sprintf( '%1$s (%2$s)', $this->object_type, $this->object_sub_type );
		}

		return $this->object_type;
	}
}
