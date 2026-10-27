<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Domain\Author_Schema_Field_Repository_Interface;
use Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Pronouns;

/**
 * Describes the author schema settings of a user that the abilities can write, keyed by field name.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter is exposed, validated and written without further changes.
 */
class Author_Schema_Field_Map extends Abstract_Field_Map {

	/**
	 * The author pronouns user meta.
	 *
	 * @var Author_Pronouns
	 */
	private $author_pronouns;

	/**
	 * The repository of the fields that are stored as a single user meta value.
	 *
	 * @var Author_Schema_User_Meta_Repository
	 */
	private $user_meta_repository;

	/**
	 * The conditional that checks whether the current user can edit other users.
	 *
	 * @var User_Can_Edit_Users_Conditional
	 */
	private $user_can_edit_users_conditional;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * The repository of each field, keyed by field name.
	 *
	 * @var array<string, Author_Schema_Field_Repository_Interface>
	 */
	private $repositories = [];

	/**
	 * Constructor.
	 *
	 * @param Author_Pronouns                    $author_pronouns                 The author pronouns user meta.
	 * @param Author_Schema_User_Meta_Repository $user_meta_repository            The repository of the fields that are
	 *                                                                            stored as a single user meta value.
	 * @param User_Can_Edit_Users_Conditional    $user_can_edit_users_conditional The conditional that checks whether
	 *                                                                            the current user can edit other users.
	 */
	public function __construct(
		Author_Pronouns $author_pronouns,
		Author_Schema_User_Meta_Repository $user_meta_repository,
		User_Can_Edit_Users_Conditional $user_can_edit_users_conditional
	) {
		$this->author_pronouns                 = $author_pronouns;
		$this->user_meta_repository            = $user_meta_repository;
		$this->user_can_edit_users_conditional = $user_can_edit_users_conditional;
	}

	/**
	 * Returns the repository of each field, which reads and saves it.
	 *
	 * @return array<string, Author_Schema_Field_Repository_Interface> The repository of each field, keyed by field name.
	 */
	public function get_repositories(): array {
		// The repositories are resolved along with the fields.
		$this->get_fields();

		return $this->repositories;
	}

	/**
	 * Passes the default fields through the filter that lets add-ons add fields.
	 *
	 * @param array<string, array<string, mixed>> $default_fields The JSON schema of each field, keyed by field name.
	 *
	 * @return mixed The filtered fields, which are not guaranteed to be an array.
	 */
	protected function get_filtered_fields( array $default_fields ) {
		/**
		 * Filter: 'wpseo_author_schema_ability_fields' - Allows adding author schema settings that the author
		 * schema abilities can write.
		 *
		 * Each field is keyed by its name and maps to the JSON schema of its value. By default, the value is saved
		 * as a single user meta value, keyed by the name of the field. That only works for a field whose schema
		 * type is 'string', as the value is sanitized as text, so a field of any other type without its own
		 * 'repository' is dropped.
		 *
		 * A field stored differently, for example as an entry of an array user meta value, comes with a
		 * 'repository' key next to the schema, holding an Author_Schema_Field_Repository_Interface that reads,
		 * sanitizes and saves it.
		 * A field whose 'repository' is not one is dropped, so it is never saved in the wrong place.
		 *
		 * Validation beyond the schema goes in an optional 'validate_callback' key next to the schema. It receives
		 * the value and the field name, and returns a warning to skip saving the field or null to save it. The
		 * warning is relayed to the user, so it should explain why the value was not saved. A field whose
		 * 'validate_callback' is not callable is dropped, so it is never saved unvalidated. The fields of Yoast SEO
		 * come with their own 'validate_callback', which must be kept.
		 *
		 * Person social profiles are validated and saved by the validator they are registered with through the
		 * 'wpseo_person_social_profile_fields' filter instead.
		 *
		 * @internal
		 *
		 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by field name.
		 */
		return \apply_filters( 'wpseo_author_schema_ability_fields', $default_fields );
	}

	/**
	 * Resolves the repository of a field, which defaults to the user meta repository.
	 *
	 * @param string               $field_name The name of the field.
	 * @param array<string, mixed> $schema     The JSON schema of the field, along with its 'repository' key.
	 *
	 * @return array<string, mixed>|null The JSON schema without the 'repository' key, or null to drop the field when
	 *                                   its repository is not one, or when it is not a string field stored by the
	 *                                   user meta repository.
	 */
	protected function resolve_extra_keys( string $field_name, array $schema ): ?array {
		$repository = ( $schema['repository'] ?? $this->user_meta_repository );
		if ( ! $repository instanceof Author_Schema_Field_Repository_Interface ) {
			return null;
		}

		// The user meta repository sanitizes the value as text, so it would mangle values of any other type.
		if ( $repository === $this->user_meta_repository && ( $schema['type'] ?? null ) !== 'string' ) {
			return null;
		}

		$this->repositories[ $field_name ] = $repository;

		// The repository is not part of the JSON schema that is published to agents.
		unset( $schema['repository'] );

		return $schema;
	}

	/**
	 * Returns the author schema fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by user meta key.
	 */
	protected function get_default_fields(): array {
		return [
			'wpseo_pronouns' => [
				'type'              => 'string',
				'description'       => $this->get_pronouns_description(),
				'validate_callback' => [ $this, 'validate_pronouns' ],
			],
			'facebook'       => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s Facebook profile. It is also used as the article author in the Open Graph meta tags of the user\'s posts.', 'wordpress-seo' ),
			],
			'instagram'      => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s Instagram profile.', 'wordpress-seo' ),
			],
			'linkedin'       => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s LinkedIn profile.', 'wordpress-seo' ),
			],
			'myspace'        => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s MySpace profile.', 'wordpress-seo' ),
			],
			'pinterest'      => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s Pinterest profile.', 'wordpress-seo' ),
			],
			'soundcloud'     => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s SoundCloud profile.', 'wordpress-seo' ),
			],
			'tumblr'         => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s Tumblr profile.', 'wordpress-seo' ),
			],
			'twitter'        => [
				'type'        => 'string',
				'description' => \__( 'The X username of the user. A leading @ is removed, and an X profile URL is also accepted and saved as the username. It is also used in the X card meta tags: as the creator of the user\'s posts, and as the site\'s X account when the site represents this user.', 'wordpress-seo' ),
			],
			'youtube'        => [
				'type'        => 'string',
				'description' => \__( 'The URL of the user\'s YouTube channel.', 'wordpress-seo' ),
			],
			'wikipedia'      => [
				'type'        => 'string',
				'description' => \__( 'The URL of the Wikipedia page about the user.', 'wordpress-seo' ),
			],
		];
	}

	/**
	 * Validates that the pronouns can be set: the user profile page only shows the pronouns, and saves them,
	 * when author archives are enabled and to users who can edit other users.
	 *
	 * @param mixed  $value      The value to save.
	 * @param string $field_name The name of the field.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_pronouns( $value, string $field_name ): ?string {
		if ( ! $this->author_pronouns->is_setting_enabled() ) {
			return \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting was not changed, because author archives are disabled on this site.', 'wordpress-seo' ),
				$field_name,
			);
		}

		// Like on the user profile page, which only shows the pronouns to users who can edit other users.
		if ( ! $this->user_can_edit_users_conditional->is_met() ) {
			return \sprintf(
				/* translators: %s expands to the name of a setting. */
				\__( 'The %s setting was not changed, because only users who can edit other users can change it.', 'wordpress-seo' ),
				$field_name,
			);
		}

		return null;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the description of the pronouns field, which tells agents upfront when the pronouns cannot be set.
	 *
	 * @return string The description.
	 */
	private function get_pronouns_description(): string {
		$description = \__( 'The pronouns of the user, like "she/her", "he/him" or "they/them".', 'wordpress-seo' );

		if ( ! $this->author_pronouns->is_setting_enabled() ) {
			return $description . ' ' . \__( 'Author archives are disabled on this site, so the pronouns cannot be changed.', 'wordpress-seo' );
		}

		// The current user is not known yet when the abilities are registered, so this cannot depend on them.
		return $description . ' ' . \__( 'Only users who can edit other users can change them.', 'wordpress-seo' );
	}
}
