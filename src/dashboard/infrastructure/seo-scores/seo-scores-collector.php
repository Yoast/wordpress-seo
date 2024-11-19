<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Infrastructure\SEO_Scores;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\SEO_Scores\SEO_Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;

/**
 * Getting SEO scores from the indexable database table.
 */
class SEO_Scores_Collector {

	/**
	 * Retrieves the current SEO scores for a content type.
	 *
	 * @param SEO_Scores_Interface[] $seo_scores   All SEO scores.
	 * @param Content_Type           $content_type The content type.
	 * @param int|null               $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<string, string> The SEO scores for a content type.
	 */
	public function get_seo_scores( array $seo_scores, Content_Type $content_type, ?int $term_id ) {
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
			$scores = $wpdb->get_row(
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
			return $scores;

		}

		$replacements[] = $wpdb->term_relationships;
		$replacements[] = $term_id;

		//phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $select['fields'] is an array of simple strings with placeholders.
		//phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $replacements is an array with the correct replacements.
		//phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
		//phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
		$scores = $wpdb->get_row(
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
		return $scores;
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
				$select_fields[]       = 'COUNT(CASE WHEN primary_focus_keyword_score IS NULL THEN 1 END) AS %i';
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

	/**
	 * Builds the view link of the SEO score.
	 *
	 * @param SEO_Scores_Interface $seo_score_name The name of the SEO score.
	 * @param Content_Type         $content_type   The content type.
	 * @param Taxonomy|null        $taxonomy       The taxonomy of the term we might be filtering.
	 * @param int|null             $term_id        The ID of the term we might be filtering.
	 *
	 * @return string The view link of the SEO score.
	 */
	public function get_view_link( SEO_Scores_Interface $seo_score_name, Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): ?string {
		// @TODO: Refactor by Single Source of Truthing this with the `WPSEO_Meta_Columns` class. Until then, we build this manually.
		$posts_page = \admin_url( 'edit.php' );
		$args       = [
			'post_status' => 'publish',
			'post_type'   => $content_type->get_name(),
			'seo_filter'  => $seo_score_name->get_filter_name(),
		];

		if ( $taxonomy === null || $term_id === null ) {
			return \add_query_arg( $args, $posts_page );
		}

		$taxonomy_object = \get_taxonomy( $taxonomy->get_name() );
		$query_var       = $taxonomy_object->query_var;

		if ( $query_var === false ) {
			return null;
		}

		$term               = \get_term( $term_id );
		$args[ $query_var ] = $term->slug;

		return \add_query_arg( $args, $posts_page );
	}
}
