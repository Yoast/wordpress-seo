<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Infrastructure\SEO_Scores;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Dashboard\Domain\SEO_Scores\SEO_Scores_Interface;

/**
 * Getting SEO scores from the indexable database table.
 */
class SEO_Scores_Collector {

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Constructs the class.
	 *
	 * @param wpdb $wpdb The WordPress database instance.
	 */
	public function __construct(
		wpdb $wpdb
	) {
		$this->wpdb = $wpdb;
	}

	/**
	 * Retrieves the current SEO scores for a content type.
	 *
	 * @param SEO_Scores_Interface[] $seo_scores   All SEO scores.
	 * @param string                 $content_type The content type.
	 * @param string                 $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int                    $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<string, string> The SEO scores for a content type.
	 */
	public function get_seo_scores( array $seo_scores, string $content_type, string $taxonomy, int $term_id ) {
		$select = $this->build_select( $seo_scores );

		$replacements = \array_merge(
			\array_values( $select['replacements'] ),
			[
				Model::get_table_name( 'Indexable' ),
				$content_type,
			]
		);

		if ( $term_id === 0 || $taxonomy === '' ) {
			$query = $this->wpdb->prepare(
				"
				SELECT {$select['fields']}
				FROM %i AS I
				WHERE ( I.post_status = 'publish' OR I.post_status IS NULL )
					AND I.object_type IN ('post')
					AND I.object_sub_type IN (%s)",
				$replacements
			);

			$scores = $this->wpdb->get_row( $query, \ARRAY_A );
			return $scores;

		}

		$replacements[] = $this->wpdb->term_relationships;
		$replacements[] = $this->wpdb->term_taxonomy;
		$replacements[] = $term_id;
		$replacements[] = $taxonomy;

		$query = $this->wpdb->prepare(
			"
			SELECT {$select['fields']}
			FROM %i AS I
			WHERE ( I.post_status = 'publish' OR I.post_status IS NULL )
				AND I.object_type IN ('post')
				AND I.object_sub_type IN (%s)
				AND I.object_id IN (
					SELECT object_id
					FROM %i
					WHERE term_taxonomy_id IN (
						SELECT term_taxonomy_id
						FROM 
							%i
						WHERE 
							term_id = %d
							AND taxonomy = %s
					)
			)",
			$replacements
		);

		$scores = $this->wpdb->get_row( $query, \ARRAY_A );
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
	 * @param string $seo_score_name The name of the SEO score.
	 * @param string $content_type   The content type.
	 * @param string $taxonomy       The taxonomy of the term we might be filtering.
	 * @param int    $term_id        The ID of the term we might be filtering.
	 *
	 * @return string The view link of the SEO score.
	 */
	public function get_view_link( string $seo_score_name, string $content_type, string $taxonomy, int $term_id ): ?string {
		// @TODO: Refactor by Single Source of Truthing this with the `WPSEO_Meta_Columns` class. Until then, we build this manually.
		$posts_page = \admin_url( 'edit.php' );
		$args       = [
			'post_status' => 'publish',
			'post_type'   => $content_type,
			'seo_filter'  => $seo_score_name,
		];

		if ( $taxonomy === '' || $term_id === 0 ) {
			return \add_query_arg( $args, $posts_page );
		}

		$taxonomy_object = \get_taxonomy( $taxonomy );
		$query_var       = $taxonomy_object->query_var;

		if ( $query_var === false ) {
			return null;
		}

		$term               = \get_term( $term_id );
		$args[ $query_var ] = $term->slug;

		return \add_query_arg( $args, $posts_page );
	}
}
