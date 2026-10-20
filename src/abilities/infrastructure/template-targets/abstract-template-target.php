<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets;

use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;

/**
 * Shared base for the template targets: a single page that is enabled, can always be changed and has no URL, unless
 * the extending class says otherwise.
 */
abstract class Abstract_Template_Target implements Template_Target_Interface {

	/**
	 * Returns what identifies the target to agents.
	 *
	 * @return array<string, string> The identifiers, keyed by input name.
	 */
	public function get_identifiers(): array {
		return [ 'target' => $this->get_name() ];
	}

	/**
	 * Returns whether the template is shared by many pages.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return false;
	}

	/**
	 * Returns whether the pages of the target are in use on the site.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		return true;
	}

	/**
	 * Returns the URL of the page, or the URL pattern of its pages.
	 *
	 * @return string|null The URL or URL pattern, or null when the pages have no URL of their own.
	 */
	public function get_url(): ?string {
		return null;
	}

	/**
	 * Ensures the template SEO data of the target can be changed, which it always can unless the extending class
	 * says otherwise.
	 *
	 * @return void
	 */
	public function ensure_available(): void {
	}

	/**
	 * Returns the option pattern as the name of the option, as it only depends on the target itself.
	 *
	 * @param string $option_pattern The option pattern.
	 *
	 * @return string The option name.
	 */
	public function format_option_name( string $option_pattern ): string {
		return $option_pattern;
	}

	/**
	 * Returns the URL pattern of the pages that share this template, based on their permalink structure.
	 *
	 * @param string $permastruct_method The WP_Rewrite method that returns the permalink structure.
	 * @param string $query_string       The query string that is used without pretty permalinks.
	 *
	 * @return string The URL pattern, with placeholders between % signs.
	 */
	protected function get_url_pattern( string $permastruct_method, string $query_string ): string {
		global $wp_rewrite;

		$permastruct = $wp_rewrite->{$permastruct_method}();
		if ( ! \is_string( $permastruct ) || $permastruct === '' ) {
			return \home_url( '/' . $query_string );
		}

		return \home_url( \user_trailingslashit( $permastruct ) );
	}
}
