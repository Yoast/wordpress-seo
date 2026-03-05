<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use WPSEO_Rank;
use Yoast\WP\SEO\Abilities\Domain\Score_Result;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $language_helper;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Options_Helper       $options_helper       The options helper.
	 * @param Language_Helper      $language_helper      The language helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Options_Helper $options_helper,
		Language_Helper $language_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->options_helper       = $options_helper;
		$this->language_helper      = $language_helper;
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
		if ( ! $this->is_inclusive_language_enabled() ) {
			return new WP_Error(
				'feature_not_available',
				\__( 'The inclusive language analysis feature is not enabled.', 'wordpress-seo' ),
			);
		}

		$post_id = $input['post_id'];

		$post = \get_post( $post_id );
		if ( $post === null ) {
			return new WP_Error( 'post_not_found', \sprintf( 'Post with ID %d not found.', $post_id ) );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			return ( new Score_Result( 0, 'na', \__( 'Not available', 'wordpress-seo' ) ) )->to_array();
		}

		$score = (int) $indexable->inclusive_language_score;
		$rank  = WPSEO_Rank::from_numeric_score( $score );

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
		$seo_score = $this->get_seo_score( $input );
		if ( $seo_score instanceof WP_Error ) {
			return $seo_score;
		}

		$readability_score = $this->get_readability_score( $input );
		if ( $readability_score instanceof WP_Error ) {
			return $readability_score;
		}

		$inclusive_language_score = null;
		if ( $this->is_inclusive_language_enabled() ) {
			$inclusive_language_result = $this->get_inclusive_language_score( $input );
			if ( ! $inclusive_language_result instanceof WP_Error ) {
				$inclusive_language_score = $inclusive_language_result;
			}
		}

		return [
			'seo'                => $seo_score,
			'readability'        => $readability_score,
			'inclusive_language' => $inclusive_language_score,
		];
	}

	/**
	 * Checks if the inclusive language analysis feature is enabled.
	 *
	 * @return bool Whether the feature is enabled.
	 */
	private function is_inclusive_language_enabled(): bool {
		return (bool) $this->options_helper->get( 'inclusive_language_analysis_active', false )
			&& $this->language_helper->has_inclusive_language_support( $this->language_helper->get_language() );
	}
}
