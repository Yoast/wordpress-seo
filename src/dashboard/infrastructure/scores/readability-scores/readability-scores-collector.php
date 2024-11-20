<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Scores\Readability_Scores;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Readability_Scores\Readability_Scores_Interface;

/**
 * Getting readability scores from the indexable database table.
 */
class Readability_Scores_Collector {

	/**
	 * Retrieves the current readability scores for a content type.
	 *
	 * @param Readability_Scores_Interface[] $readability_scores All readability scores.
	 * @param Content_Type                   $content_type       The content type.
	 * @param int|null                       $term_id            The ID of the term we're filtering for.
	 *
	 * @return array<string, string> The readability scores for a content type.
	 */
	public function get_readability_scores( array $readability_scores, Content_Type $content_type, ?int $term_id ) {
		global $wpdb;
		$select = $this->build_select( $readability_scores );

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
						AND I.object_type IN ('post')
						AND I.object_sub_type IN (%s)",
					$replacements
				),
				\ARRAY_A
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
					AND I.object_sub_type IN (%s)
					AND I.object_id IN (
						SELECT object_id
						FROM %i
						WHERE term_taxonomy_id = %d
				)",
				$replacements
			),
			\ARRAY_A
		);
		//phpcs:enable
		return $current_scores;
	}

	/**
	 * Builds the select statement for the readability scores query.
	 *
	 * @param Readability_Scores_Interface[] $readability_scores All readability scores.
	 *
	 * @return array<string, string> The select statement for the readability scores query.
	 */
	private function build_select( array $readability_scores ): array {
		$select_fields       = [];
		$select_replacements = [];

		foreach ( $readability_scores as $readability_score ) {
			$min  = $readability_score->get_min_score();
			$max  = $readability_score->get_max_score();
			$name = $readability_score->get_name();

			if ( $min === null || $max === null ) {
				$select_fields[]       = 'COUNT(CASE WHEN I.readability_score = 0 AND I.estimated_reading_time_minutes IS NULL THEN 1 END) AS %i';
				$select_replacements[] = $name;
			}
			else {
				$select_fields[]       = 'COUNT(CASE WHEN I.readability_score >= %d AND I.readability_score <= %d AND I.estimated_reading_time_minutes IS NOT NULL THEN 1 END) AS %i';
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
