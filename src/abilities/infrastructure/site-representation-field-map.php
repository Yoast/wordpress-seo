<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;

/**
 * Describes the site representation settings that the abilities can write, keyed by option name.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter is exposed, validated and written without further changes.
 */
class Site_Representation_Field_Map {

	/**
	 * The Local SEO active conditional.
	 *
	 * @var Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

	/**
	 * The validators of the site representation fields of Yoast SEO.
	 *
	 * @var Site_Representation_Field_Validators
	 */
	private $field_validators;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * The fields, cached so the schemas and the updater always agree on them.
	 *
	 * @var array<string, array<string, mixed>>|null
	 */
	private $fields;

	/**
	 * The validators registered along with the fields, keyed by option name.
	 *
	 * @var array<string, callable>|null
	 */
	private $validators;

	/**
	 * Constructor.
	 *
	 * @param Local_SEO_Active_Conditional         $local_seo_active_conditional The Local SEO active conditional.
	 * @param Site_Representation_Field_Validators $field_validators             The validators of the site representation fields of Yoast SEO.
	 */
	public function __construct(
		Local_SEO_Active_Conditional $local_seo_active_conditional,
		Site_Representation_Field_Validators $field_validators
	) {
		$this->local_seo_active_conditional = $local_seo_active_conditional;
		$this->field_validators             = $field_validators;
	}

	/**
	 * Returns the writable site representation fields, mapped to their JSON schema.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by option name.
	 */
	public function get_fields(): array {
		$this->resolve_fields();

		return $this->fields;
	}

	/**
	 * Returns the validators registered along with the fields.
	 *
	 * @return array<string, callable> The validator of each field that has one, keyed by option name.
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
		 * Filter: 'wpseo_site_representation_ability_fields' - Allows adding site representation settings that
		 * the site representation abilities can write.
		 *
		 * Each field is keyed by its option name and maps to the JSON schema of its value. The option has to be
		 * a Yoast SEO option, as the value is saved through the options helper, so it is sanitized like it is
		 * when saved from the settings page.
		 *
		 * Validation beyond the schema goes in an optional 'validate_callback' key next to the schema. It receives
		 * the value and the option name, and returns a warning to skip saving the field or null to save it. The
		 * warning is relayed to the user, so it should explain why the value was not saved. A field whose
		 * 'validate_callback' is not callable is dropped, so it is never saved unvalidated. The fields of Yoast SEO
		 * come with their own 'validate_callback', which must be kept.
		 *
		 * Organization social profiles are validated by the validator they are registered with through the
		 * 'wpseo_organization_social_profile_fields' filter instead.
		 *
		 * @internal
		 *
		 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by option name.
		 */
		$fields = \apply_filters( 'wpseo_site_representation_ability_fields', $default_fields );

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
	 * Returns the site representation fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by option name.
	 */
	private function get_default_fields(): array {
		return [
			'company_or_person'         => [
				'type'              => 'string',
				'enum'              => [ 'company', 'person' ],
				'description'       => $this->get_company_or_person_description(),
				'validate_callback' => [ $this->field_validators, 'validate_company_or_person' ],
			],
			'company_name'              => [
				'type'        => 'string',
				'description' => \__( 'The name of the organization the site represents. Use an empty string to clear it and fall back to the site name.', 'wordpress-seo' ),
			],
			'company_alternate_name'    => [
				'type'        => 'string',
				'description' => \__( 'An alternate name of the organization the site represents, like an acronym or a shorter version of its name. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'company_logo'              => [
				'type'              => 'string',
				'description'       => \__( 'The URL of the organization logo, which must be an image from the media library. Use an empty string to clear it and fall back to the site logo.', 'wordpress-seo' ),
				'validate_callback' => [ $this->field_validators, 'validate_logo' ],
			],
			'company_or_person_user_id' => [
				'type'              => 'integer',
				'minimum'           => 0,
				'description'       => \__( 'The ID of the user the site represents when it represents a person. The profile information of that user is used in search results. Use 0 to clear it.', 'wordpress-seo' ),
				'validate_callback' => [ $this->field_validators, 'validate_user_id' ],
			],
			'person_name'               => [
				'type'        => 'string',
				'description' => \__( 'The name of the person the site represents. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'person_logo'               => [
				'type'              => 'string',
				'description'       => \__( 'The URL of the personal logo or avatar, which must be an image from the media library. Use an empty string to clear it and fall back to the site logo.', 'wordpress-seo' ),
				'validate_callback' => [ $this->field_validators, 'validate_logo' ],
			],
			'facebook_site'             => [
				'type'        => 'string',
				'description' => \__( 'The URL of the Facebook page of the organization. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'twitter_site'              => [
				'type'        => 'string',
				'description' => \__( 'The X username of the organization, without the @. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'other_social_urls'         => [
				'type'        => 'array',
				'items'       => [
					'type' => 'string',
				],
				'description' => \__( 'The URLs of the other social profiles of the organization, like Instagram, LinkedIn or YouTube. The provided list replaces the current one, so include the URLs to keep. Use an empty array to clear them.', 'wordpress-seo' ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the description of the company_or_person field, which tells agents upfront when the site
	 * cannot be set to represent a person.
	 *
	 * @return string The description.
	 */
	private function get_company_or_person_description(): string {
		$description = \__( 'Whether the site represents an organization ("company") or a person ("person").', 'wordpress-seo' );

		if ( ! $this->local_seo_active_conditional->is_met() ) {
			return $description;
		}

		return $description . ' ' . \sprintf(
			/* translators: %s expands to Yoast Local SEO. */
			\__( '%s is active on this site and requires the site to represent an organization, so "person" cannot be set.', 'wordpress-seo' ),
			'Yoast Local SEO',
		);
	}
}
