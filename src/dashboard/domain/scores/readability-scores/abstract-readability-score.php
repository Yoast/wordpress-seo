<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores;

use Yoast\WP\SEO\Dashboard\Domain\Scores\Abstract_Score;

/**
 * Abstract class for a readability score.
 */
abstract class Abstract_Readability_Score extends Abstract_Score implements Readability_Scores_Interface {}
