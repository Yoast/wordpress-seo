<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_Schema_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Schema_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;

/**
 * The ability that gets the author schema settings of a user: their pronouns and social profiles.
 */
class Get_Author_Schema_Ability extends Abstract_Author_Schema_Ability {

	/**
	 * The author schema collector.
	 *
	 * @var Author_Schema_Collector
	 */
	private $collector;

	/**
	 * Constructor.
	 *
	 * @param Author_Schema_Field_Map $field_map The author schema field map.
	 * @param Author_Schema_Collector $collector The author schema collector.
	 */
	public function __construct( Author_Schema_Field_Map $field_map, Author_Schema_Collector $collector ) {
		parent::__construct( $field_map );

		$this->collector = $collector;
	}

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-author-schema';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays and the user meta values are heterogeneous by nature.

	/**
	 * Returns the author schema settings of the user.
	 *
	 * @param array<string, mixed> $input The ID of the user.
	 *
	 * @return array<string, mixed>|WP_Error The author schema settings, keyed by field name, along with the user ID,
	 *                                       or an error when the user does not exist.
	 */
	public function execute( array $input ) {
		return $this->collector->get( (int) $input['user_id'] );
	}

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array {
		$user_id = $this->get_user_id_schema( \__( 'The ID of the user whose settings to get.', 'wordpress-seo' ) );

		return [
			'label'               => \__( 'Get Author Schema', 'wordpress-seo' ),
			'description'         => \sprintf(
				/* translators: %s expands to Yoast SEO. */
				\__( 'Get %s\'s author schema settings of a user, which provide their pronouns, social profiles and, depending on the active add-ons, other details for the user\'s Person schema. That schema describes the user as the author of their posts, on their author archive, and as the site itself when the site represents this user. The settings are returned as stored, so an empty value means the setting is not set.', 'wordpress-seo' ),
				'Yoast SEO',
			),
			'category'            => Ability_Categories_Integration::CATEGORY_SLUG,
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'required'             => [ 'user_id' ],
				'properties'           => [ 'user_id' => $user_id ],
			],
			'output_schema'       => [
				'type'       => 'object',
				'properties' => $this->get_settings_output_schema( $user_id ),
			],
			'permission_callback' => [ $this, 'can_edit_user' ],
			'execute_callback'    => [ $this, 'execute' ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => true,
					'destructive' => false,
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
