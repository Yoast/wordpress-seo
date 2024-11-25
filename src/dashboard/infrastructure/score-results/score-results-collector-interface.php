<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_Interface;

/**
 * The interface of scores collectors.
 */
interface Score_Results_Collector_Interface {

	/**
	 * Retrieves the current score results for a content type.
	 *
	 * @param Scores_Interface[] $scores       All scores.
	 * @param Content_Type       $content_type The content type.
	 * @param int|null           $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<string, string> The current scores for a content type.
	 */
	public function get_current_scores( array $scores, Content_Type $content_type, ?int $term_id );
}
