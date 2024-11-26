<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Readability_Score_Results;

use WPSEO_Utils;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Score_Results_Collector_Interface;

/**
 * Getting readability score results from the indexable database table.
 */
class Readability_Score_Results_Collector implements Score_Results_Collector_Interface {

	public const READABILITY_SCORES_TRANSIENT = 'wpseo_readability_scores';

	/**
	 * Retrieves readability score results for a content type.
	 *
	 * @param Readability_Score_Groups_Interface[] $readability_score_groups All readability score groups.
	 * @param Content_Type                         $content_type             The content type.
	 * @param int|null                             $term_id                  The ID of the term we're filtering for.
	 *
	 * @return array<string, object|bool|float> The readability score results for a content type.
	 */
	public function get_score_results( array $readability_score_groups, Content_Type $content_type, ?int $term_id ) {
		global $wpdb;
		$results = [];

		$content_type_name = $content_type->get_name();
		$transient_name    = self::READABILITY_SCORES_TRANSIENT . '_' . $content_type_name . ( ( $term_id === null ) ? '' : '_' . $term_id );

		$transient = \get_transient( $transient_name );
		if ( $transient !== false ) {
			$results['scores']     = \json_decode( $transient, false );
			$results['cache_used'] = true;
			$results['query_time'] = 0;

			return $results;
		}

		$select = $this->build_select( $readability_score_groups );

		$replacements = \array_merge(
			\array_values( $select['replacements'] ),
			[
				Model::get_table_name( 'Indexable' ),
				$content_type_name,
			]
		);

		if ( $term_id === null ) {
			$start_time = \microtime( true );
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
						AND I.object_sub_type = %s",
					$replacements
				)
			);
			//phpcs:enable
			$end_time = \microtime( true );

			\set_transient( $transient_name, WPSEO_Utils::format_json_encode( $current_scores ), \MINUTE_IN_SECONDS );

			$results['scores']     = $current_scores;
			$results['cache_used'] = false;
			$results['query_time'] = ( $end_time - $start_time );
			return $results;

		}

		$replacements[] = $wpdb->term_relationships;
		$replacements[] = $term_id;

		$start_time = \microtime( true );
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
					AND I.object_id IN (
						SELECT object_id
						FROM %i
						WHERE term_taxonomy_id = %d
				)",
				$replacements
			)
		);
		//phpcs:enable
		$end_time = \microtime( true );

		\set_transient( $transient_name, WPSEO_Utils::format_json_encode( $current_scores ), \MINUTE_IN_SECONDS );

		$results['scores']     = $current_scores;
		$results['cache_used'] = false;
		$results['query_time'] = ( $end_time - $start_time );
		return $results;
	}

	/**
	 * Builds the select statement for the readability scores query.
	 *
	 * @param Readability_Score_Groups_Interface[] $readability_score_groups All readability score groups.
	 *
	 * @return array<string, string> The select statement for the readability scores query.
	 */
	private function build_select( array $readability_score_groups ): array {
		$select_fields       = [];
		$select_replacements = [];

		foreach ( $readability_score_groups as $readability_score_group ) {
			$min  = $readability_score_group->get_min_score();
			$max  = $readability_score_group->get_max_score();
			$name = $readability_score_group->get_name();

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
