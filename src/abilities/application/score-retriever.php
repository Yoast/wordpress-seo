<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use WPSEO_Rank;
use Yoast\WP\SEO\Abilities\Domain\Score_Result;
use Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Application service that retrieves SEO, readability, and inclusive language scores.
 */
class Score_Retriever {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The enabled analysis features checker.
	 *
	 * @var Enabled_Analysis_Features_Checker
	 */
	private $enabled_analysis_features_checker;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository              $indexable_repository              The indexable repository.
	 * @param Enabled_Analysis_Features_Checker $enabled_analysis_features_checker The enabled analysis features checker.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Enabled_Analysis_Features_Checker $enabled_analysis_features_checker
	) {
		$this->indexable_repository              = $indexable_repository;
		$this->enabled_analysis_features_checker = $enabled_analysis_features_checker;
	}

	/**
	 * Retrieves the SEO score for a post.
	 *
	 * @param array<string, int> $input The input containing 'post_id'.
	 *
	 * @return array<string, int|string|null>|WP_Error The SEO score data or a WP_Error.
	 */
	public function get_seo_score( array $input ) {
		$post_id = $input['post_id'];

		$post = \get_post( $post_id );
		if ( $post === null ) {
			return new WP_Error( 'post_not_found', \sprintf( 'Post with ID %d not found.', $post_id ) );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			$result                    = ( new Score_Result( 0, 'na', \__( 'Not available', 'wordpress-seo' ) ) )->to_array();
			$result['focus_keyphrase'] = null;
			return $result;
		}

		if ( $indexable->is_robots_noindex ) {
			$rank   = new WPSEO_Rank( WPSEO_Rank::NO_INDEX );
			$result = ( new Score_Result(
				0,
				$rank->get_rank(),
				$rank->get_label(),
			) )->to_array();

			$result['focus_keyphrase'] = $indexable->primary_focus_keyword;
			return $result;
		}

		$score  = (int) $indexable->primary_focus_keyword_score;
		$rank   = WPSEO_Rank::from_numeric_score( $score );
		$result = ( new Score_Result(
			$score,
			$rank->get_rank(),
			$rank->get_label(),
		) )->to_array();

		$result['focus_keyphrase'] = $indexable->primary_focus_keyword;
		return $result;
	}

	/**
	 * Retrieves the readability score for a post.
	 *
	 * @param array<string, int> $input The input containing 'post_id'.
	 *
	 * @return array<string, int|string>|WP_Error The readability score data or a WP_Error.
	 */
	public function get_readability_score( array $input ) {
		$post_id = $input['post_id'];

		$post = \get_post( $post_id );
		if ( $post === null ) {
			return new WP_Error( 'post_not_found', \sprintf( 'Post with ID %d not found.', $post_id ) );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			return ( new Score_Result( 0, 'na', \__( 'Not available', 'wordpress-seo' ) ) )->to_array();
		}

		$score = (int) $indexable->readability_score;
		$rank  = WPSEO_Rank::from_numeric_score( $score );

		return ( new Score_Result(
			$score,
			$rank->get_rank(),
			$rank->get_label(),
		) )->to_array();
	}

	/**
	 * Retrieves the inclusive language score for a post.
	 *
	 * @param array<string, int> $input The input containing 'post_id'.
	 *
	 * @return array<string, int|string>|WP_Error The inclusive language score data or a WP_Error.
	 */
	public function get_inclusive_language_score( array $input ) {
		$post_id = $input['post_id'];

		$post = \get_post( $post_id );
		if ( $post === null ) {
			return new WP_Error( 'post_not_found', \sprintf( 'Post with ID %d not found.', $post_id ) );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			return new WP_Error(
				'score_not_available',
				\__( 'The inclusive language score is not available for this post.', 'wordpress-seo' ),
			);
		}

		$score = (int) $indexable->inclusive_language_score;

		if ( $score === 0 ) {
			return new WP_Error(
				'score_not_available',
				\__( 'The inclusive language score has not been calculated yet for this post.', 'wordpress-seo' ),
			);
		}

		$rank = WPSEO_Rank::from_numeric_score( $score );

		return ( new Score_Result(
			$score,
			$rank->get_rank(),
			$rank->get_inclusive_language_label(),
		) )->to_array();
	}

	/**
	 * Retrieves all scores for a post.
	 *
	 * @param array<string, int> $input The input containing 'post_id'.
	 *
	 * @return array<string, array<string, int|string|null>|null>|WP_Error The combined score data or a WP_Error.
	 */
	public function get_all_scores( array $input ) {
		$post_id = $input['post_id'];

		$post = \get_post( $post_id );
		if ( $post === null ) {
			return new WP_Error( 'post_not_found', \sprintf( 'Post with ID %d not found.', $post_id ) );
		}

		$seo_score = null;
		if ( $this->enabled_analysis_features_checker->is_keyword_analysis_enabled() ) {
			$result = $this->get_seo_score( $input );
			if ( ! $result instanceof WP_Error ) {
				$seo_score = $result;
			}
		}

		$readability_score = null;
		if ( $this->enabled_analysis_features_checker->is_content_analysis_enabled() ) {
			$result = $this->get_readability_score( $input );
			if ( ! $result instanceof WP_Error ) {
				$readability_score = $result;
			}
		}

		$inclusive_language_score = null;
		if ( $this->enabled_analysis_features_checker->is_inclusive_language_enabled() ) {
			$result = $this->get_inclusive_language_score( $input );
			if ( ! $result instanceof WP_Error ) {
				$inclusive_language_score = $result;
			}
		}

		return [
			'seo'                => $seo_score,
			'readability'        => $readability_score,
			'inclusive_language' => $inclusive_language_score,
		];
	}
}
