<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Domain\Post_With_Issue_Result;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Ok_Readability_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Application service that retrieves posts with a known SEO issue.
 *
 * Detects the same issues as the task list feature: content with a low
 * (not good) SEO or readability score, and content without a custom meta
 * description. Results are paginated, most recently modified first.
 */
class Posts_With_SEO_Issues_Retriever {

	/**
	 * The issue type for posts with a low (not good) SEO score.
	 *
	 * @var string
	 */
	public const ISSUE_TYPE_LOW_SEO_SCORE = 'low-seo-score';

	/**
	 * The issue type for posts with a low (not good) readability score.
	 *
	 * @var string
	 */
	public const ISSUE_TYPE_LOW_READABILITY_SCORE = 'low-readability-score';

	/**
	 * The issue type for posts without a custom meta description.
	 *
	 * @var string
	 */
	public const ISSUE_TYPE_DEFAULT_META_DESCRIPTION = 'default-meta-description';

	/**
	 * The post types that can be searched for SEO issues, matching the task list feature.
	 *
	 * @var array<string>
	 */
	public const SUPPORTED_POST_TYPES = [ 'post', 'page', 'product' ];

	/**
	 * The analysis feature each issue type depends on.
	 *
	 * @var array<string, string>
	 */
	private const REQUIRED_ANALYSIS_FEATURES = [
		self::ISSUE_TYPE_LOW_SEO_SCORE         => Keyphrase_Analysis::NAME,
		self::ISSUE_TYPE_LOW_READABILITY_SCORE => Readability_Analysis::NAME,
	];

	/**
	 * The default number of posts to retrieve per page.
	 *
	 * @var int
	 */
	private const DEFAULT_NUMBER_OF_POSTS = 10;

	/**
	 * The maximum number of posts to retrieve per page.
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
	 * The enabled analysis features repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The OK SEO score group.
	 *
	 * @var Ok_SEO_Score_Group
	 */
	private $ok_seo_score_group;

	/**
	 * The OK readability score group.
	 *
	 * @var Ok_Readability_Score_Group
	 */
	private $ok_readability_score_group;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository                 $indexable_repository                 The indexable repository.
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 * @param Options_Helper                       $options_helper                       The options helper.
	 * @param Post_Type_Helper                     $post_type_helper                     The post type helper.
	 * @param Ok_SEO_Score_Group                   $ok_seo_score_group                   The OK SEO score group.
	 * @param Ok_Readability_Score_Group           $ok_readability_score_group           The OK readability score group.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository,
		Options_Helper $options_helper,
		Post_Type_Helper $post_type_helper,
		Ok_SEO_Score_Group $ok_seo_score_group,
		Ok_Readability_Score_Group $ok_readability_score_group
	) {
		$this->indexable_repository                 = $indexable_repository;
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
		$this->options_helper                       = $options_helper;
		$this->post_type_helper                     = $post_type_helper;
		$this->ok_seo_score_group                   = $ok_seo_score_group;
		$this->ok_readability_score_group           = $ok_readability_score_group;
	}

	/**
	 * Retrieves the posts that have the given SEO issue.
	 *
	 * An empty result is a valid answer: there are no posts with the issue, or
	 * the requested page lies past the last result.
	 *
	 * @param array<string, int|string> $input The input containing an 'issue_type', plus an optional 'post_type', 'number_of_posts', and 'page'.
	 *
	 * @return array<int, array<string, int|string>>|WP_Error The posts with the issue, or an error.
	 */
	public function get_posts_with_seo_issues( array $input ) {
		$issue_type = (string) ( $input['issue_type'] ?? '' );

		if ( ! $this->is_known_issue_type( $issue_type ) ) {
			return new WP_Error(
				'yoast_seo_invalid_issue_type',
				\__( 'Provide a valid issue_type to look for.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		$availability_error = $this->validate_issue_type_availability( $issue_type );
		if ( $availability_error !== null ) {
			return $availability_error;
		}

		$post_type = (string) ( $input['post_type'] ?? 'post' );
		if ( ! \in_array( $post_type, $this->get_available_post_types(), true ) ) {
			return new WP_Error(
				'yoast_seo_invalid_post_type',
				\__( 'The given post_type is not supported or not registered on this site.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		$page_size = $this->get_number_of_posts( $input );
		$offset    = ( ( $this->get_page( $input ) - 1 ) * $page_size );

		$results = $this->find_posts_with_issue( $issue_type, $post_type, $page_size, $offset );

		if ( ! \is_array( $results ) ) {
			return new WP_Error(
				'yoast_seo_post_data_unavailable',
				\__( 'The posts could not be retrieved.', 'wordpress-seo' ),
				[ 'status' => 500 ],
			);
		}

		return \array_map( [ $this, 'build_result_for_row' ], \array_values( $results ) );
	}

	/**
	 * Checks whether the given issue type is one this service can look for.
	 *
	 * @param string $issue_type The issue type.
	 *
	 * @return bool Whether the issue type is known.
	 */
	private function is_known_issue_type( string $issue_type ): bool {
		return \in_array(
			$issue_type,
			[
				self::ISSUE_TYPE_LOW_SEO_SCORE,
				self::ISSUE_TYPE_LOW_READABILITY_SCORE,
				self::ISSUE_TYPE_DEFAULT_META_DESCRIPTION,
			],
			true,
		);
	}

	/**
	 * Validates that the analysis feature powering the issue type is enabled.
	 *
	 * The ability's input schema already excludes issue types of disabled analyses,
	 * but a client can bypass the schema or hold a stale copy of it.
	 *
	 * @param string $issue_type The issue type.
	 *
	 * @return WP_Error|null An error when the required analysis is disabled, null otherwise.
	 */
	private function validate_issue_type_availability( string $issue_type ): ?WP_Error {
		$required_feature = ( self::REQUIRED_ANALYSIS_FEATURES[ $issue_type ] ?? null );

		if ( $required_feature === null ) {
			return null;
		}

		$enabled_features = $this->enabled_analysis_features_repository
			->get_features_by_keys( [ $required_feature ] )
			->to_array();

		if ( ( $enabled_features[ $required_feature ] ?? false ) === true ) {
			return null;
		}

		return new WP_Error(
			'yoast_seo_issue_type_unavailable',
			\__( 'The analysis powering this issue type is disabled on this site.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
	}

	/**
	 * Returns the supported post types that are registered and public on this site.
	 *
	 * @return array<string> The available post types.
	 */
	private function get_available_post_types(): array {
		return \array_values(
			\array_intersect(
				self::SUPPORTED_POST_TYPES,
				(array) $this->post_type_helper->get_public_post_types(),
			),
		);
	}

	/**
	 * Queries the posts that have the given issue, paginated.
	 *
	 * @param string $issue_type The issue type to look for.
	 * @param string $post_type  The post type to look in.
	 * @param int    $limit      The maximum number of posts to return.
	 * @param int    $offset     The number of posts to skip.
	 *
	 * @return array<array<string, string|null>>|false The matching indexable rows. False if the query failed.
	 */
	private function find_posts_with_issue( string $issue_type, string $post_type, int $limit, int $offset ) {
		switch ( $issue_type ) {
			case self::ISSUE_TYPE_LOW_SEO_SCORE:
				return $this->indexable_repository->get_recent_posts_with_keywords_for_post_type(
					$post_type,
					$limit,
					null,
					$offset,
					$this->ok_seo_score_group->get_max_score(),
				);

			case self::ISSUE_TYPE_LOW_READABILITY_SCORE:
				return $this->indexable_repository->get_recent_posts_with_readability_scores_for_post_type(
					$post_type,
					$limit,
					null,
					$offset,
					$this->ok_readability_score_group->get_max_score(),
				);

			default:
				// A meta description template with replacevars customises each description, so no post has the issue.
				if ( $this->has_templated_meta_description( $post_type ) ) {
					return [];
				}

				return $this->indexable_repository->get_recent_posts_for_post_type(
					$post_type,
					$limit,
					null,
					$offset,
					true,
				);
		}
	}

	/**
	 * Checks whether the meta description template of the post type contains a replacevar.
	 *
	 * Mirrors the task list's Improve_Default_Meta_Descriptions::is_valid(): a template
	 * with at least one replacevar (%%...%%) generates a customised description per post.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return bool Whether the meta description template contains a replacevar.
	 */
	private function has_templated_meta_description( string $post_type ): bool {
		$metadesc = $this->options_helper->get( 'metadesc-' . $post_type );

		if ( empty( $metadesc ) ) {
			return false;
		}

		return (bool) \preg_match( '/%%[^%]+%%/', $metadesc );
	}

	/**
	 * Builds the ability output for a single indexable row.
	 *
	 * @param array<string, string|null> $row The indexable row containing 'object_id' and 'breadcrumb_title'.
	 *
	 * @return array<string, int|string> The serialized post with issue.
	 */
	private function build_result_for_row( array $row ): array {
		$title = ( empty( $row['breadcrumb_title'] ) ) ? \__( '(no title)', 'wordpress-seo' ) : $row['breadcrumb_title'];

		return ( new Post_With_Issue_Result( (int) $row['object_id'], $title ) )->to_array();
	}

	/**
	 * Extracts and clamps the number of posts per page from the input.
	 *
	 * @param array<string, int|string> $input The input array.
	 *
	 * @return int The clamped number of posts.
	 */
	private function get_number_of_posts( array $input ): int {
		$number = ( $input['number_of_posts'] ?? self::DEFAULT_NUMBER_OF_POSTS );

		return \min( self::MAX_NUMBER_OF_POSTS, \max( 1, (int) $number ) );
	}

	/**
	 * Extracts and clamps the 1-based result page from the input.
	 *
	 * @param array<string, int|string> $input The input array.
	 *
	 * @return int The clamped page.
	 */
	private function get_page( array $input ): int {
		return \max( 1, (int) ( $input['page'] ?? 1 ) );
	}
}
