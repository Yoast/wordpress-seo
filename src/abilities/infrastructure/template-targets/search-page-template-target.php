<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets;

/**
 * The search results pages, which share one template.
 */
class Search_Page_Template_Target extends Abstract_Template_Target {

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

	/**
	 * Returns the URL pattern of the search results pages.
	 *
	 * @return string The URL pattern.
	 */
	public function get_url(): string {
		return $this->get_url_pattern( 'get_search_permastruct', '?s=%search%' );
	}
}
