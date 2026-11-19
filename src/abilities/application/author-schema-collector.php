<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;

/**
 * Application service that collects the author schema settings of a user.
 *
 * The settings are read from the repository they are registered with in the field map and returned as stored, so
 * an empty value means the setting is not set.
 *
 * @internal Backs the author schema abilities. Not meant to be used outside of Yoast SEO, so it can change at any
 *           time without notice.
 */
class Author_Schema_Collector {

	use Schema_Type_Cast_Trait;

	/**
	 * The author schema field map.
	 *
	 * @var Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * Constructor.
	 *
	 * @param Author_Schema_Field_Map $field_map The author schema field map.
	 */
	public function __construct( Author_Schema_Field_Map $field_map ) {
		$this->field_map = $field_map;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any user meta value.

	/**
	 * Returns the current value of each author schema setting of a user, cast to the type its schema declares.
	 *
	 * @param int $user_id The ID of the user.
	 *
	 * @return array<string, mixed>|WP_Error The author schema settings, keyed by field name, along with the user ID,
	 *                                       or an error when the user does not exist.
	 */
	public function get( int $user_id ) {
		if ( \get_userdata( $user_id ) === false ) {
			return new WP_Error(
				'yoast_seo_user_not_found',
				\__( 'No user exists with the given ID.', 'wordpress-seo' ),
				[ 'status' => 404 ],
			);
		}

		$fields       = $this->field_map->get_fields();
		$repositories = $this->field_map->get_repositories();
		$settings     = [ 'user_id' => $user_id ];

		foreach ( $fields as $field_name => $schema ) {
			$settings[ $field_name ] = $this->cast_to_schema_type( $repositories[ $field_name ]->get( $user_id, $field_name ), $schema );
		}

		return $settings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
