<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;

/**
 * The ability that updates the author schema settings of a user: their pronouns and social profiles.
 */
class Update_Author_Schema_Ability extends Abstract_Author_Schema_Ability {

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
		parent::__construct( $field_map );

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

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the user meta values are heterogeneous by nature.

	/**
	 * Updates the author schema settings of the user and returns their new state.
	 *
	 * @param array<string, mixed> $input The ID of the user, plus the author schema settings to change, keyed by field name.
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
		$user_id = $this->get_user_id_schema( \__( 'The ID of the user whose settings to update.', 'wordpress-seo' ) );

		return [
			'label'               => \__( 'Update Author Schema', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Update %s\'s author schema settings of a user, which provide their pronouns, social profiles and, depending on the active add-ons, other details for the user\'s Person schema. That schema describes the user as the author of their posts, on their author archive, and as the site itself when the site represents this user. Only the settings you provide are changed; a provided empty string clears that setting. These settings are published as personal details about the user: only use values you were given, never guessed, inferred (for example pronouns from a name) or found elsewhere, and confirm them before saving.', 'wordpress-seo' ),
				'Yoast SEO',
			) . ' ' . \__( 'A leading @ is removed from the X username, and an X profile URL is also accepted and saved as the username.', 'wordpress-seo' ) . ' ' . $this->field_map->get_pronouns_update_rule(),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'user_id' ],
				'properties'           => \array_merge( [ 'user_id' => $user_id ], $this->field_map->get_fields() ),
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => \array_merge(
					$this->get_settings_output_schema( $user_id ),
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

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
