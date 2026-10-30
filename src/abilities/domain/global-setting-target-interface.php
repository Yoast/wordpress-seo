<?php

namespace Yoast\WP\SEO\Abilities\Domain;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;

/**
 * Describes a group of pages that are neither posts nor terms and share their SEO settings, like the homepage or
 * the author archives.
 */
interface Global_Setting_Target_Interface {

	/**
	 * Returns the name of the target, as agents pass it to the abilities.
	 *
	 * @return string The name, e.g. `author_archives`.
	 */
	public function get_name(): string;

	/**
	 * Returns what identifies the target to agents: its name and, for targets that need more, the rest of what the
	 * update ability expects.
	 *
	 * @return array<string, string> The identifiers, keyed by input name.
	 */
	public function get_identifiers(): array;

	/**
	 * Returns whether the template is shared by many pages, so it has to use snippet variables instead of
	 * page-specific text.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool;

	/**
	 * Returns whether the pages of the target are in use on the site.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool;

	/**
	 * Turns the option pattern a field uses for this target into the name of the option, for targets whose options
	 * depend on more than the target itself, like the post type of a content type archive.
	 *
	 * @param string $option_pattern The option pattern, like `title-ptarchive-%s`.
	 *
	 * @return string The option name.
	 */
	public function format_option_name( string $option_pattern ): string;

	/**
	 * Ensures the global settings of the target can be changed.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the global settings cannot be changed.
	 */
	public function ensure_available(): void;
}
