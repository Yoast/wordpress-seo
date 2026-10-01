<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;

/**
 * Describes the site representation settings that the abilities can write, keyed by option name.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter is exposed and written without further changes.
 */
class Site_Representation_Field_Map {

	/**
	 * The Local SEO active conditional.
	 *
	 * @var Local_SEO_Active_Conditional
	 */
	private $local_seo_active_conditional;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * The fields, cached so the schemas and the updater always agree on them.
	 *
	 * @var array<string, array<string, mixed>>|null
	 */
	private $fields;

	/**
	 * Constructor.
	 *
	 * @param Local_SEO_Active_Conditional $local_seo_active_conditional The Local SEO active conditional.
	 */
	public function __construct( Local_SEO_Active_Conditional $local_seo_active_conditional ) {
		$this->local_seo_active_conditional = $local_seo_active_conditional;
	}

	/**
	 * Returns the writable site representation fields, mapped to their JSON schema.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by option name.
	 */
	public function get_fields(): array {
		if ( $this->fields !== null ) {
			return $this->fields;
		}

		$default_fields = $this->get_default_fields();

		/**
		 * Filter: 'wpseo_site_representation_ability_fields' - Allows adding site representation settings that
		 * the site representation abilities can write.
		 *
		 * Each field is keyed by its option name and maps to the JSON schema of its value. The value is saved
		 * through the options helper, so it is sanitized like it is when saved from the settings page.
		 *
		 * @internal
		 *
		 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by option name.
		 */
		$fields = \apply_filters( 'wpseo_site_representation_ability_fields', $default_fields );

		if ( ! \is_array( $fields ) ) {
			$fields = $default_fields;
		}

		// A field without a schema can neither be described to agents nor validated, so it is dropped.
		$this->fields = \array_filter( $fields, 'is_array' );

		return $this->fields;
	}

	/**
	 * Returns the site representation fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by option name.
	 */
	private function get_default_fields(): array {
		return [
			'company_or_person'         => [
				'type'        => 'string',
				'enum'        => [ 'company', 'person' ],
				'description' => $this->get_company_or_person_description(),
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
				'type'        => 'string',
				'description' => \__( 'The URL of the organization logo. Set it together with company_logo_id, to the URL of that attachment. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'company_logo_id'           => [
				'type'        => 'integer',
				'minimum'     => 0,
				'description' => \__( 'The attachment ID of the organization logo, which should be an image from the media library. Set it together with company_logo. Use 0 to clear it and fall back to the site logo.', 'wordpress-seo' ),
			],
			'company_or_person_user_id' => [
				'type'        => 'integer',
				'minimum'     => 0,
				'description' => \__( 'The ID of the user the site represents when it represents a person. The profile information of that user is used in search results. Use 0 to clear it.', 'wordpress-seo' ),
			],
			'person_name'               => [
				'type'        => 'string',
				'description' => \__( 'The name of the person the site represents. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'person_logo'               => [
				'type'        => 'string',
				'description' => \__( 'The URL of the personal logo or avatar. Set it together with person_logo_id, to the URL of that attachment. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'person_logo_id'            => [
				'type'        => 'integer',
				'minimum'     => 0,
				'description' => \__( 'The attachment ID of the personal logo or avatar, which should be an image from the media library. Set it together with person_logo. Use 0 to clear it and fall back to the site logo.', 'wordpress-seo' ),
			],
			'facebook_site'             => [
				'type'        => 'string',
				'description' => \__( 'The URL of the Facebook page of the organization. Use an empty string to clear it.', 'wordpress-seo' ),
			],
			'twitter_site'              => [
				'type'        => 'string',
				'description' => \__( 'The X username of the organization, without the @. Use an empty string to clear it.', 'wordpress-seo' ),
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
