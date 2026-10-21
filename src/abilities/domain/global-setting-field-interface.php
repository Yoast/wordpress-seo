<?php

namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Describes a template setting, like the SEO title template: its schema, and the option each target stores it in.
 */
interface Global_Setting_Field_Interface {

	/**
	 * Returns the name of the field, as agents pass it to the abilities.
	 *
	 * @return string The name, e.g. `seo_title`.
	 */
	public function get_name(): string;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the JSON schema of the value of the field.
	 *
	 * @return array<string, mixed> The JSON schema.
	 */
	public function get_schema(): array;

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the option the field is stored in for a target.
	 *
	 * @param Global_Setting_Target_Interface $target The target.
	 *
	 * @return string|null The option name, or null when the target does not have the field.
	 */
	public function get_option_name( Global_Setting_Target_Interface $target ): ?string;
}
