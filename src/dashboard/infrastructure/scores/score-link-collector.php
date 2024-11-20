<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Scores;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Scores\Scores_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;

/**
 * Getting links for scores.
 */
class Score_Link_Collector {

	/**
	 * Builds the view link of the score.
	 *
	 * @param Scores_Interface $score_name   The name of the score.
	 * @param Content_Type     $content_type The content type.
	 * @param Taxonomy|null    $taxonomy     The taxonomy of the term we might be filtering.
	 * @param int|null         $term_id      The ID of the term we might be filtering.
	 *
	 * @return string The view link of the score.
	 */
	public function get_view_link( Scores_Interface $score_name, Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ): ?string {
		$posts_page = \admin_url( 'edit.php' );
		$args       = [
			'post_status'                  => 'publish',
			'post_type'                    => $content_type->get_name(),
			$score_name->get_filter_key()  => $score_name->get_filter_value(),
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
