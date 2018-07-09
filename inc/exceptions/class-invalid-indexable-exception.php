<?php

/**
 * Class WPSEO_Invalid_Indexable_Exception
 */
class WPSEO_Invalid_Indexable_Exception extends \InvalidArgumentException {

	/**
	 * Creates an invalid indexable exception.
	 *
	 * @param int $id The ID that was passed.
	 *
	 * @return WPSEO_Invalid_Indexable_Exception The exception.
	 */
	public static function non_existing_indexable( $id ) {
		return new static( sprintf( 'Indexable with id `%d` does not exist.', $id ) );
	}

	/**
	 * Creates an invalid POST request exception.
	 *
	 * @param int $id The ID that was passed.
	 *
	 * @return WPSEO_Invalid_Indexable_Exception The exception.
	 */
	public static function invalid_post_request( $id ) {
		return new static( sprintf( 'Invalid POST request. Meta values already exist for object with ID %s.', $id ) );
	}
}
