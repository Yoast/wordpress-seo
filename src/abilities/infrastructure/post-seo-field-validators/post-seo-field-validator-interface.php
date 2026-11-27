<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Validates a field of the SEO data of a post beyond what the JSON schema of the update ability covers.
 *
 * Every implementation is injected into the post SEO field map, which skips the field when its validator returns a
 * warning.
 */
interface Post_SEO_Field_Validator_Interface {

	/**
	 * Returns the name of the input field the validator validates.
	 *
	 * @return string The field name.
	 */
	public function get_field_name(): string;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields have different types.

	/**
	 * Validates the value of the field for a post.
	 *
	 * @param mixed     $value     The value to save.
	 * @param Indexable $indexable The indexable of the post.
	 *
	 * @return string|null A warning when the value cannot be saved for the post, null otherwise.
	 */
	public function validate( $value, Indexable $indexable ): ?string;

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
