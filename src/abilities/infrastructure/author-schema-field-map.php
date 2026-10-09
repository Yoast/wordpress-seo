<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Pronouns;

/**
 * Describes the author schema settings of a user that the abilities can write, keyed by user meta key.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter is exposed, validated and written without further changes.
 */
class Author_Schema_Field_Map {

	/**
	 * The author pronouns user meta.
	 *
	 * @var Author_Pronouns
	 */
	private $author_pronouns;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * The fields, cached so the schemas and the updater always agree on them.
	 *
	 * @var array<string, array<string, mixed>>|null
	 */
	private $fields;

	/**
	 * The validators registered along with the fields, keyed by user meta key.
	 *
	 * @var array<string, callable>|null
	 */
	private $validators;

	/**
	 * Constructor.
	 *
	 * @param Author_Pronouns $author_pronouns The author pronouns user meta.
	 */
	public function __construct( Author_Pronouns $author_pronouns ) {
		$this->author_pronouns = $author_pronouns;
	}

	/**
	 * Returns the writable author schema fields, mapped to their JSON schema.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by user meta key.
	 */
	public function get_fields(): array {
		$this->resolve_fields();

		return $this->fields;
	}

	/**
	 * Returns the validators registered along with the fields.
	 *
	 * @return array<string, callable> The validator of each field that has one, keyed by user meta key.
	 */
	public function get_validators(): array {
		$this->resolve_fields();

		return $this->validators;
	}

	/**
	 * Resolves the fields and their validators, once, so the schemas and the updater always agree on them.
	 *
	 * @return void
	 */
	private function resolve_fields(): void {
		if ( $this->fields !== null ) {
			return;
		}

		$default_fields = $this->get_default_fields();

		/**
		 * Filter: 'wpseo_author_schema_ability_fields' - Allows adding author schema settings that the author
		 * schema abilities can write.
		 *
		 * Each field is keyed by its user meta key and maps to the JSON schema of its value. The value is saved
		 * as a single user meta value.
		 *
		 * Validation beyond the schema goes in an optional 'validate_callback' key next to the schema. It receives
		 * the value and the user meta key, and returns a warning to skip saving the field or null to save it. The
		 * warning is relayed to the user, so it should explain why the value was not saved. A field whose
		 * 'validate_callback' is not callable is dropped, so it is never saved unvalidated. The fields of Yoast SEO
		 * come with their own 'validate_callback', which must be kept.
		 *
		 * Person social profiles are validated by the validator they are registered with through the
		 * 'wpseo_person_social_profile_fields' filter instead.
		 *
		 * @internal
		 *
		 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by user meta key.
		 */
		$fields = \apply_filters( 'wpseo_author_schema_ability_fields', $default_fields );

		if ( ! \is_array( $fields ) ) {
			$fields = $default_fields;
		}

		$this->fields     = [];
		$this->validators = [];

		foreach ( $fields as $field_name => $schema ) {
			// A field without a schema can neither be described to agents nor validated, so it is dropped.
			if ( ! \is_array( $schema ) ) {
				continue;
			}

			if ( \array_key_exists( 'validate_callback', $schema ) ) {
				if ( ! \is_callable( $schema['validate_callback'] ) ) {
					continue;
				}

				$this->validators[ $field_name ] = $schema['validate_callback'];

				// The callback is not part of the JSON schema that is published to agents.
				unset( $schema['validate_callback'] );
			}

			$this->fields[ $field_name ] = $schema;
		}
	}

	/**
	 * Returns the author schema fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by user meta key.
	 */
	private function get_default_fields(): array {
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
				'description' => \__( 'The X username of the user, without the @. An X profile URL is also accepted, and is saved as the username. It is also used in the X card meta tags: as the creator of the user\'s posts, and as the site\'s X account when the site represents this user.', 'wordpress-seo' ),
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
	 * when author archives are enabled.
	 *
	 * @param mixed  $value      The value to save.
	 * @param string $field_name The name of the field.
	 *
	 * @return string|null A warning when the value cannot be saved, null otherwise.
	 */
	public function validate_pronouns( $value, string $field_name ): ?string {
		if ( $this->author_pronouns->is_setting_enabled() ) {
			return null;
		}

		return \sprintf(
			/* translators: %s expands to the name of a setting. */
			\__( 'The %s setting was not changed, because author archives are disabled on this site.', 'wordpress-seo' ),
			$field_name,
		);
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the description of the pronouns field, which tells agents upfront when the pronouns cannot be set.
	 *
	 * @return string The description.
	 */
	private function get_pronouns_description(): string {
		$description = \__( 'The pronouns of the user, like "she/her", "he/him" or "they/them".', 'wordpress-seo' );

		if ( $this->author_pronouns->is_setting_enabled() ) {
			return $description;
		}

		return $description . ' ' . \__( 'Author archives are disabled on this site, so the pronouns cannot be changed.', 'wordpress-seo' );
	}
}
