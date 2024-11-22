<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Scores\SEO_Scores;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\SEO_Scores\SEO_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Scores_Collector_Interface;

/**
 * Getting SEO scores from the indexable database table.
 */
class SEO_Scores_Collector implements Scores_Collector_Interface {

	/**
	 * Retrieves the current SEO scores for a content type.
	 *
	 * @param SEO_Scores_Interface[] $seo_scores   All SEO scores.
	 * @param Content_Type           $content_type The content type.
	 * @param int|null               $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<string, string> The current SEO scores for a content type.
	 */
	public function get_current_scores( array $seo_scores, Content_Type $content_type, ?int $term_id ) {
		global $wpdb;
		$select = $this->build_select( $seo_scores );

		$replacements = \array_merge(
			\array_values( $select['replacements'] ),
			[
				Model::get_table_name( 'Indexable' ),
				$content_type->get_name(),
			]
		);

		if ( $term_id === null ) {
			//phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $select['fields'] is an array of simple strings with placeholders.
			//phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $replacements is an array with the correct replacements.
			//phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
			//phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
			$current_scores = $wpdb->get_row(
				$wpdb->prepare(
					"
					SELECT {$select['fields']}
					FROM %i AS I
					WHERE ( I.post_status = 'publish' OR I.post_status IS NULL )
						AND I.object_type = 'post'
						AND I.object_sub_type = %s
						AND ( I.is_robots_noindex IS NULL OR I.is_robots_noindex <> 1 )",
					$replacements
				)
			);
			//phpcs:enable
			return $current_scores;

		}

		$replacements[] = $wpdb->term_relationships;
		$replacements[] = $term_id;

		//phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $select['fields'] is an array of simple strings with placeholders.
		//phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $replacements is an array with the correct replacements.
		//phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
		//phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
		$current_scores = $wpdb->get_row(
			$wpdb->prepare(
				"
				SELECT {$select['fields']}
				FROM %i AS I
				WHERE ( I.post_status = 'publish' OR I.post_status IS NULL )
					AND I.object_type IN ('post')
					AND I.object_sub_type = %s
					AND ( I.is_robots_noindex IS NULL OR I.is_robots_noindex <> 1 )
					AND I.object_id IN (
						SELECT object_id
						FROM %i
						WHERE term_taxonomy_id = %d
				)",
				$replacements
			)
		);
		//phpcs:enable
		return $current_scores;
	}

	/**
	 * Builds the select statement for the SEO scores query.
	 *
	 * @param SEO_Scores_Interface[] $seo_scores All SEO scores.
	 *
	 * @return array<string, string> The select statement for the SEO scores query.
	 */
	private function build_select( array $seo_scores ): array {
		$select_fields       = [];
		$select_replacements = [];

		foreach ( $seo_scores as $seo_score ) {
			$min  = $seo_score->get_min_score();
			$max  = $seo_score->get_max_score();
			$name = $seo_score->get_name();

			if ( $min === null || $max === null ) {
				$select_fields[]       = 'COUNT(CASE WHEN I.primary_focus_keyword_score IS NULL THEN 1 END) AS %i';
				$select_replacements[] = $name;
			}
			else {
				$select_fields[]       = 'COUNT(CASE WHEN I.primary_focus_keyword_score >= %d AND I.primary_focus_keyword_score <= %d THEN 1 END) AS %i';
				$select_replacements[] = $min;
				$select_replacements[] = $max;
				$select_replacements[] = $name;
			}
		}

		$select_fields = \implode( ', ', $select_fields );

		return [
			'fields'       => $select_fields,
			'replacements' => $select_replacements,
		];
	}
}
