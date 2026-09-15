<?php

namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Describes an ability that can be registered with the WordPress Abilities API.
 */
interface Ability_Interface {

	/**
	 * Returns the full name of the ability, including the category prefix.
	 *
	 * @return string The ability name, e.g. `yoast-seo/get-seo-scores`.
	 */
	public function get_name(): string;

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The registration arguments are heterogeneous by nature.

	/**
	 * Returns the arguments to register the ability with.
	 *
	 * @return array<string, mixed> The ability registration arguments.
	 */
	public function get_args(): array;

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns whether the ability should be registered at all.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool;
}
