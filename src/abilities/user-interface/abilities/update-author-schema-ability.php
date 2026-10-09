<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Updater;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;

/**
 * The ability that updates the author schema settings of a user: their pronouns and social profiles.
 */
class Update_Author_Schema_Ability implements Ability_Interface {

	/**
	 * The author schema field map.
	 *
	 * @var Author_Schema_Field_Map
	 */
	private $field_map;

	/**
	 * The author schema updater.
	 *
	 * @var Author_Schema_Updater
	 */
	private $author_schema_updater;

	/**
	 * Constructor.
	 *
	 * @param Author_Schema_Field_Map $field_map             The author schema field map.
	 * @param Author_Schema_Updater   $author_schema_updater The author schema updater.
	 */
	public function __construct(
		Author_Schema_Field_Map $field_map,
		Author_Schema_Updater $author_schema_updater
	) {
		$this->field_map             = $field_map;
		$this->author_schema_updater = $author_schema_updater;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/update-author-schema';
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
	 * Updates the author schema settings of the user and returns their new state.
	 *
	 * @param array<string, mixed> $input The ID of the user, plus the author schema settings to change, keyed by user meta key.
	 *
	 * @return array<string, mixed>|WP_Error The new author schema settings, plus a warning when some could not be changed,
	 *                                       or an error when the user does not exist.
	 */
	public function execute( array $input ) {
		return $this->author_schema_updater->update( (int) $input['user_id'], $input );
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$fields  = $this->field_map->get_fields();
		$user_id = [
			'type'        => 'integer',
			'minimum'     => 1,
			'description' => \__( 'The ID of the user whose settings to update or read.', 'wordpress-seo' ),
		];

		return [
			'label'               => \__( 'Update Author Schema', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Update %s\'s author schema settings of a user, which provide their pronouns, social profiles and, depending on the active add-ons, other details for the user\'s Person schema. That schema describes the user as the author of their posts, on their author archive, and as the site itself when the site represents this user. Only the settings you provide are changed; a provided empty string clears that setting. Provide only the user ID to read the current settings without changing anything.', 'wordpress-seo' ),
				'Yoast SEO',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'user_id' ],
				'properties'           => \array_merge( [ 'user_id' => $user_id ], $fields ),
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => \array_merge(
					\array_map( [ $this, 'to_output_schema' ], \array_merge( [ 'user_id' => $user_id ], $fields ) ),
					[
						'warning' => [
							'type'        => 'string',
							'description' => \__( 'Only present when a requested setting could not be applied or saved, for example when a social profile is not a valid URL. Meant to be relayed to the user.', 'wordpress-seo' ),
						],
					],
				),
			],
			'permission_callback' => [ $this, 'can_edit_user' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => false,
					// We can't claim this is truly non-destructive because settings can be cleared.
					'destructive' => null,
					'idempotent'  => true,
				],
				'mcp'          => [
					'public' => true,
				],
			],
		];
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
