<?php

namespace Yoast\WP\SEO\User_Meta\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles filtering empty user meta before adding them in the database.
 */
class Empty_Metadata_Filtering_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * What metadata to filter.
	 *
	 * @var array<string>
	 */
	private $filtered_metadata = [
		'facebook',
		'instagram',
		'linkedin',
		'myspace',
		'pinterest',
		'soundcloud',
		'tumblr',
		'twitter',
		'youtube',
		'wikipedia',
	];

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'update_user_metadata', [ $this, 'stop_storing_empty_metadata' ], 10, 4 );
	}

	/**
	 * Returns a check value, which can stop selected empty metadata from going into the database.
	 *
	 * @param bool|null $check      Whether to allow updating metadata for the given type.
	 * @param int       $object_id  ID of the object metadata is for.
	 * @param string    $meta_key   Metadata key.
	 * @param mixed     $meta_value Metadata value. Must be serializable if non-scalar.
	 *
	 * @return false|null False for when we are to filter out empty metadata, null for no filtering.
	 */
	public function stop_storing_empty_metadata( $check, $object_id, $meta_key, $meta_value ) {
		if ( \in_array( $meta_key, $this->filtered_metadata, true ) && $meta_value === '' ) {
			return false;
		}

		return $check;
	}
}
