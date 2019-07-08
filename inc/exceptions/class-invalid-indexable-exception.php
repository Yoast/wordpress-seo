<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Invalid_Indexable_Exception.
 */
class WPSEO_Invalid_Indexable_Exception extends InvalidArgumentException {

	/**
	 * Creates an invalid indexable exception.
	 *
	 * @param int $id The ID that was passed.
	 *
	 * @return WPSEO_Invalid_Indexable_Exception The exception.
	 */
	public static function non_existing_indexable( $id ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the indexable's ID. */
				__( 'Indexable with ID `%1$s` does not exist', 'wordpress-seo' ),
				$id
			)
		);
	}

	/**
	 * Creates an invalid POST request exception.
	 *
	 * @param int $id The ID that was passed.
	 *
	 * @return WPSEO_Invalid_Indexable_Exception The exception.
	 */
	public static function invalid_post_request( $id ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to the indexable's ID. */
				__( 'Invalid POST request. Meta values already exist for object with ID %1$s.', 'wordpress-seo' ),
				$id
			)
		);
	}
}
