<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WPSEO_Rank;
use Yoast\WP\SEO\Abilities\Domain\Score_Result;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Application service that retrieves SEO, readability, and inclusive language scores
 * for the most recently modified posts.
 */
class Score_Retriever {

	/**
	 * The default number of posts to retrieve.
	 *
	 * @var int
	 */
	private const DEFAULT_NUMBER_OF_POSTS = 10;

	/**
	 * The maximum number of posts to retrieve.
	 *
	 * @var int
	 */
	private const MAX_NUMBER_OF_POSTS = 100;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository
	) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Retrieves the SEO scores for the most recently modified posts.
	 *
	 * @param array<string, int> $input The input containing optional 'number_of_posts'.
	 *
	 * @return array<int, array<string, string|null>> The SEO score data for each post.
	 */
	public function get_seo_scores( array $input ): array {
		$indexables = $this->get_recent_indexables( $this->get_number_of_posts( $input ) );

		return \array_map( [ $this, 'build_seo_score_for_indexable' ], $indexables );
	}

	/**
	 * Retrieves the readability scores for the most recently modified posts.
	 *
	 * @param array<string, int> $input The input containing optional 'number_of_posts'.
	 *
	 * @return array<int, array<string, string>> The readability score data for each post.
	 */
	public function get_readability_scores( array $input ): array {
		$indexables = $this->get_recent_indexables( $this->get_number_of_posts( $input ) );

		return \array_map( [ $this, 'build_readability_score_for_indexable' ], $indexables );
	}

	/**
	 * Retrieves the inclusive language scores for the most recently modified posts.
	 *
	 * @param array<string, int> $input The input containing optional 'number_of_posts'.
	 *
	 * @return array<int, array<string, string>> The inclusive language score data for each post.
	 */
	public function get_inclusive_language_scores( array $input ): array {
		$indexables = $this->get_recent_indexables( $this->get_number_of_posts( $input ) );

		return \array_map( [ $this, 'build_inclusive_language_score_for_indexable' ], $indexables );
	}

	/**
	 * Builds the SEO score result for a single indexable.
	 *
	 * @param object $indexable The indexable object.
	 *
	 * @return array<string, string|null> The SEO score data.
	 */
	private function build_seo_score_for_indexable( $indexable ): array {
		$title  = $this->get_indexable_title( $indexable );
		$rank   = WPSEO_Rank::from_numeric_score( (int) $indexable->primary_focus_keyword_score );
		$result = ( new Score_Result(
			$title,
			$rank->get_rank(),
			$rank->get_label(),
		) )->to_array();

		$result['focus_keyphrase'] = $indexable->primary_focus_keyword;
		return $result;
	}

	/**
	 * Builds the readability score result for a single indexable.
	 *
	 * @param object $indexable The indexable object.
	 *
	 * @return array<string, string> The readability score data.
	 */
	private function build_readability_score_for_indexable( $indexable ): array {
		$title = $this->get_indexable_title( $indexable );
		$rank  = WPSEO_Rank::from_numeric_score( (int) $indexable->readability_score );

		return ( new Score_Result(
			$title,
			$rank->get_rank(),
			$rank->get_label(),
		) )->to_array();
	}

	/**
	 * Builds the inclusive language score result for a single indexable.
	 *
	 * @param object $indexable The indexable object.
	 *
	 * @return array<string, string> The inclusive language score data.
	 */
	private function build_inclusive_language_score_for_indexable( $indexable ): array {
		$title = $this->get_indexable_title( $indexable );
		$score = (int) $indexable->inclusive_language_score;

		if ( $score === 0 ) {
			return ( new Score_Result(
				$title,
				'na',
				\__( 'Not available', 'wordpress-seo' ),
			) )->to_array();
		}

		$rank = WPSEO_Rank::from_numeric_score( $score );

		return ( new Score_Result(
			$title,
			$rank->get_rank(),
			$rank->get_inclusive_language_label(),
		) )->to_array();
	}

	/**
	 * Returns the title for an indexable, with a fallback.
	 *
	 * @param object $indexable The indexable object.
	 *
	 * @return string The post title.
	 */
	private function get_indexable_title( $indexable ): string {
		if ( ! empty( $indexable->breadcrumb_title ) ) {
			return $indexable->breadcrumb_title;
		}

		return \__( '(no title)', 'wordpress-seo' );
	}

	/**
	 * Retrieves the most recently modified post indexables.
	 *
	 * @param int $number_of_posts The number of posts to retrieve.
	 *
	 * @return array<object> The indexable objects.
	 */
	private function get_recent_indexables( int $number_of_posts ): array {
		return $this->indexable_repository->get_recently_modified_posts( 'post', $number_of_posts, false );
	}

	/**
	 * Extracts and clamps the number of posts from the input.
	 *
	 * @param array<string, int> $input The input array.
	 *
	 * @return int The clamped number of posts.
	 */
	private function get_number_of_posts( array $input ): int {
		$number = ( $input['number_of_posts'] ?? self::DEFAULT_NUMBER_OF_POSTS );

		return \min( self::MAX_NUMBER_OF_POSTS, \max( 1, (int) $number ) );
	}
}
