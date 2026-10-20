<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields;

use Yoast\WP\SEO\Abilities\Domain\Template_Field_Interface;
use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;

/**
 * Provides the template fields: the ones of Yoast SEO, and the ones add-ons add.
 */
class Template_Field_Repository {

	/**
	 * The template fields of Yoast SEO.
	 *
	 * @var array<Template_Field_Interface>
	 */
	private $default_fields;

	/**
	 * All template fields, keyed by name, cached so the schemas and the updater always agree on them.
	 *
	 * @var array<string, Template_Field_Interface>|null
	 */
	private $fields;

	/**
	 * Constructor.
	 *
	 * @param Template_Field_Interface ...$default_fields The template fields of Yoast SEO.
	 */
	public function __construct( Template_Field_Interface ...$default_fields ) {
		$this->default_fields = $default_fields;
	}

	/**
	 * Returns all template fields.
	 *
	 * @return array<string, Template_Field_Interface> The fields, keyed by name.
	 */
	public function get_all(): array {
		if ( $this->fields !== null ) {
			return $this->fields;
		}

		/**
		 * Filter: 'wpseo_template_seo_data_fields' - Allows adding fields to the template SEO data abilities.
		 *
		 * Each field is a Template_Field_Interface, which describes its schema and the option it is stored in for
		 * each page type that has it. The value is saved through the options helper, so it is sanitized like it is
		 * when saved from the settings page. Anything that is not a Template_Field_Interface is ignored.
		 *
		 * @internal
		 *
		 * @param array<Template_Field_Interface> $fields The template fields.
		 */
		$fields = \apply_filters( 'wpseo_template_seo_data_fields', $this->default_fields );

		if ( ! \is_array( $fields ) ) {
			$fields = $this->default_fields;
		}

		$this->fields = [];
		foreach ( $fields as $field ) {
			if ( $field instanceof Template_Field_Interface ) {
				$this->fields[ $field->get_name() ] = $field;
			}
		}

		return $this->fields;
	}

	/**
	 * Returns the fields a target has.
	 *
	 * @param Template_Target_Interface $target The target.
	 *
	 * @return array<string, Template_Field_Interface> The fields, keyed by name.
	 */
	public function get_for_target( Template_Target_Interface $target ): array {
		$fields = [];

		foreach ( $this->get_all() as $field_name => $field ) {
			if ( $field->get_option_name( $target ) !== null ) {
				$fields[ $field_name ] = $field;
			}
		}

		return $fields;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the JSON schema of each of the given fields.
	 *
	 * @param array<string, Template_Field_Interface> $fields The fields, keyed by name.
	 *
	 * @return array<string, array<string, mixed>> The JSON schema of each field, keyed by name.
	 */
	public function get_schemas( array $fields ): array {
		$schemas = [];

		foreach ( $fields as $field_name => $field ) {
			$schemas[ $field_name ] = $field->get_schema();
		}

		return $schemas;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
