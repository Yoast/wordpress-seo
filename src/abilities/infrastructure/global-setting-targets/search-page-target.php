<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

/**
 * The search results pages, which share one template.
 */
class Search_Page_Target extends Abstract_Global_Setting_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'search_page';

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns that the search results pages share one template.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}
}
