<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;

/**
 * Shared base for the abilities that read and update the author schema settings of a user: their pronouns and
 * social profiles.
 */
abstract class Abstract_Author_Schema_Ability implements Ability_Interface {

	/**
	 * The author schema field map.
	 *
	 * @var Author_Schema_Field_Map
	 */
	protected $field_map;

	/**
	 * Constructor.
	 *
	 * @param Author_Schema_Field_Map $field_map The author schema field map.
	 */
	public function __construct( Author_Schema_Field_Map $field_map ) {
		$this->field_map = $field_map;
	}

	/**
	 * Returns whether the ability is available.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return true;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the user meta values are heterogeneous by nature.

	/**
	 * Checks whether the current user can edit the given user.
	 *
	 * Gates the ability behind the same capability that gates the user profile page and the person social
	 * profiles of the first-time configuration, so users can edit their own settings and admins anyone's.
	 *
	 * @param array<string, mixed> $input The ability input, which identifies the user.
	 *
	 * @return bool Whether the current user can edit the given user.
	 */
	public function can_edit_user( array $input ): bool {
		return \current_user_can( 'edit_user', (int) ( $input['user_id'] ?? 0 ) );
	}

	/**
	 * Returns the input schema of the ID of the user.
	 *
	 * @param string $description The description of the ID of the user.
	 *
	 * @return array<string, mixed> The input schema of the ID of the user.
	 */
	protected function get_user_id_schema( string $description ): array {
		return [
			'type'        => 'integer',
			'minimum'     => 1,
			'description' => $description,
		];
	}

	/**
	 * Returns the output schema of the ID of the user and of each author schema setting.
	 *
	 * @param array<string, mixed> $user_id_schema The input schema of the ID of the user.
	 *
	 * @return array<string, array<string, mixed>> The output schema of the ID of the user and of each setting, keyed
	 *                                             by field name.
	 */
	protected function get_settings_output_schema( array $user_id_schema ): array {
		return \array_map( [ $this, 'to_output_schema' ], \array_merge( [ 'user_id' => $user_id_schema ], $this->field_map->get_fields() ) );
	}

	/**
	 * Reduces a field's input schema to its output schema: the input constraints (like the minimum of
	 * an ID) would only make the output validation fail on values that were saved before.
	 *
	 * @param array<string, mixed> $schema The input schema of the field.
	 *
	 * @return array<string, mixed> The output schema of the field.
	 */
	private function to_output_schema( array $schema ): array {
		return \array_intersect_key( $schema, \array_flip( [ 'type', 'description' ] ) );
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
