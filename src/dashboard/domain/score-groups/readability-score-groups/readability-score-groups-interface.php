<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName
namespace Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;

/**
 * This interface describes a readability score group implementation.
 */
interface Readability_Score_Groups_Interface extends Score_Groups_Interface {

	/**
	 * Gets whether the score group is ambiguous.
	 *
	 * @return string
	 */
	public function get_is_ambiguous(): string;
}
