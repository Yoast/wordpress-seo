<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores;

use Yoast\WP\SEO\Dashboard\Domain\Scores\Abstract_Score;

/**
 * Abstract class for an SEO score.
 */
abstract class Abstract_SEO_Score extends Abstract_Score implements SEO_Scores_Interface {

	/**
	 * Gets the key of the SEO score that is used when filtering on the posts page.
	 *
	 * @return string The name of the SEO score that is used when filtering on the posts page.
	 */
	public function get_filter_key(): string {
		return 'seo_filter';
	}
}
