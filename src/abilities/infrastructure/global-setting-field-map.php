<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Not_Found_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Search_Page_Target;

/**
 * Describes the global settings of the homepage, the archives and the special pages that the abilities can write,
 * keyed by field name.
 *
 * The map is the single source of truth for both the ability schemas and the updater, so a field
 * added through the filter is exposed, validated and written without further changes.
 */
class Global_Setting_Field_Map extends Abstract_Field_Map {

	/**
	 * The option pattern of each field, keyed by field name and then by the name of each target that has the field.
	 *
	 * @var array<string, array<string, string>>
	 */
	private $option_patterns = [];

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the option a field is stored in for a target.
	 *
	 * @param string                          $field_name The name of the field.
	 * @param Global_Setting_Target_Interface $target     The target.
	 *
	 * @return string|null The option name, or null when the field does not exist or the target does not have it.
	 */
	public function get_option_name( string $field_name, Global_Setting_Target_Interface $target ): ?string {
		if ( ! $this->target_has_field( $field_name, $target ) ) {
			return null;
		}

		return $target->format_option_name( $this->option_patterns[ $field_name ][ $target->get_name() ] );
	}

	/**
	 * Returns whether a target has a field, without formatting its option name.
	 *
	 * @param string                          $field_name The name of the field.
	 * @param Global_Setting_Target_Interface $target     The target.
	 *
	 * @return bool Whether the field exists and the target has it.
	 */
	public function target_has_field( string $field_name, Global_Setting_Target_Interface $target ): bool {
		// The option patterns are resolved along with the fields.
		$this->get_fields();

		return isset( $this->option_patterns[ $field_name ][ $target->get_name() ] );
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
		 * Filter: 'wpseo_global_setting_ability_fields' - Allows adding fields to the archive and special page SEO settings
		 * abilities.
		 *
		 * Each field is keyed by its name and maps to the JSON schema of its value, along with an 'option_patterns'
		 * key: the pattern of the Yoast SEO option the field is stored in, keyed by the name of each target that has
		 * the field. The archive of a content type fills in its post type for the %s placeholder. A field without
		 * valid option patterns is dropped, so it is never saved in the wrong place. The value is saved through the
		 * options helper, so it is sanitized like it is when saved from the settings page.
		 *
		 * Validation beyond the schema goes in an optional 'validate_callback' key next to the schema. It receives
		 * the value and the field name, and returns a warning to skip saving the field or null to save it. The
		 * warning is relayed to the user, so it should explain why the value was not saved. A field whose
		 * 'validate_callback' is not callable is dropped, so it is never saved unvalidated.
		 *
		 * @internal
		 *
		 * @param array<string, array<string, mixed>> $fields The JSON schema of each field, keyed by field name.
		 */
		return \apply_filters( 'wpseo_global_setting_ability_fields', $default_fields );
	}

	/**
	 * Resolves the option patterns of a field.
	 *
	 * @param string               $field_name The name of the field.
	 * @param array<string, mixed> $schema     The JSON schema of the field, along with its 'option_patterns' key.
	 *
	 * @return array<string, mixed>|null The JSON schema without the 'option_patterns' key, or null to drop the field
	 *                                   when it has no valid option patterns.
	 */
	protected function resolve_extra_keys( string $field_name, array $schema ): ?array {
		$option_patterns = ( $schema['option_patterns'] ?? null );
		if ( ! \is_array( $option_patterns ) || $option_patterns === [] ) {
			return null;
		}

		foreach ( $option_patterns as $target_name => $option_pattern ) {
			if ( ! \is_string( $target_name ) || ! \is_string( $option_pattern ) || $option_pattern === '' ) {
				return null;
			}
		}

		$this->option_patterns[ $field_name ] = $option_patterns;

		// The option patterns are not part of the JSON schema that is published to agents.
		unset( $schema['option_patterns'] );

		return $schema;
	}

	/**
	 * Returns the global setting fields of Yoast SEO.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, along with its option patterns,
	 *                                             keyed by field name.
	 */
	protected function get_default_fields(): array {
		return [
			'seo_title'        => [
				'type'            => 'string',
				'description'     => \sprintf(
					/* translators: %s: the format of a snippet variable. */
					\__( 'The SEO title template. It can contain snippet variables in the %s format, which are replaced with the values of the page it is shown on. When empty, the default title is used.', 'wordpress-seo' ),
					'%%variable%%',
				),
				'option_patterns' => [
					Homepage_Target::NAME          => 'title-home-wpseo',
					Author_Archives_Target::NAME   => 'title-author-wpseo',
					Date_Archives_Target::NAME     => 'title-archive-wpseo',
					Search_Page_Target::NAME       => 'title-search-wpseo',
					Not_Found_Page_Target::NAME    => 'title-404-wpseo',
					Post_Type_Archive_Target::NAME => 'title-ptarchive-%s',
				],
			],
			'meta_description' => [
				'type'            => 'string',
				'description'     => \sprintf(
					/* translators: %s: the format of a snippet variable. */
					\__( 'The meta description template, shown below the title in search results. It can contain snippet variables in the %s format, which are replaced with the values of the page it is shown on. When empty, no meta description is output.', 'wordpress-seo' ),
					'%%variable%%',
				),
				'option_patterns' => [
					Homepage_Target::NAME          => 'metadesc-home-wpseo',
					Author_Archives_Target::NAME   => 'metadesc-author-wpseo',
					Date_Archives_Target::NAME     => 'metadesc-archive-wpseo',
					Post_Type_Archive_Target::NAME => 'metadesc-ptarchive-%s',
				],
			],
			'noindex'          => [
				'type'            => 'boolean',
				'description'     => \__( 'Whether search engines are told not to index these pages. true hides them from search results; false lets them be shown in search results.', 'wordpress-seo' ),
				'option_patterns' => [
					Author_Archives_Target::NAME   => 'noindex-author-wpseo',
					Date_Archives_Target::NAME     => 'noindex-archive-wpseo',
					Post_Type_Archive_Target::NAME => 'noindex-ptarchive-%s',
				],
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
