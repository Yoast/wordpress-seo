<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets;

/**
 * The 404 pages, which share one template and have no URL of their own.
 */
class Not_Found_Page_Template_Target extends Abstract_Template_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'not_found_page';

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns that the 404 pages share one template.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}
}
