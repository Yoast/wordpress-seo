<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable service.
 */
abstract class WPSEO_Indexable_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * List of fields that need to be renamed.
	 *
	 * @var array
	 */
	protected $renameable_fields = [];

	/**
	 * Renames and converts some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to rename and convert.
	 *
	 * @return array The renamed and converted indexable data.
	 */
	protected function rename_indexable_data( &$indexable_data ) {
		foreach ( $this->renameable_fields as $old_key => $new_key ) {
			if ( WPSEO_Validator::key_exists( $indexable_data, $old_key ) ) {
				$indexable_data[ $new_key ] = $indexable_data[ $old_key ];

				unset( $indexable_data[ $old_key ] );
			}
		}

		return $indexable_data;
	}
}
