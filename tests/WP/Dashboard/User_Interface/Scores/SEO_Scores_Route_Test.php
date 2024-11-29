<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Scores;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Application\Score_Results\SEO_Score_Results\SEO_Score_Results_Repository;
use Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class SEO_Scores_Route_Test
 *
 * @group dashboard
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route
 */
final class SEO_Scores_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var SEO_Scores_Route
	 */
	private $instance;

	/**
	 * Holds the SEO_Score_Results_Repository instance.
	 *
	 * @var Mockery\MockInterface|SEO_Score_Results_Repository
	 */
	private $score_results_repository;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->score_results_repository = Mockery::mock( SEO_Score_Results_Repository::class );

		$this->instance = new SEO_Scores_Route( $this->score_results_repository );

		$user = $this->factory->user->create_and_get();
		$user->add_cap( 'wpseo_manage_options' );

		\wp_set_current_user( $user->ID );
	}

	/**
	 * Tests the get_scores by sending a non existing content type.
	 *
	 * @covers ::get_scores
	 * @covers ::get_content_type
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_non_existing_content_type() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'not-existing-content-type' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid content type.' );
	}

	/**
	 * Tests the get_scores by sending an excluded-from-indexable-creation content type.
	 *
	 * @covers ::get_scores
	 * @covers ::get_content_type
	 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector::get_content_types
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Types_List::add
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_excluded_content_type() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );

		\add_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'filter_exclude_post' ] );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid content type.' );

		\remove_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'filter_exclude_post' ] );
	}

	/**
	 * Filter function to exclude posts from indexable creation.
	 *
	 * @param array<string> $excluded_post_types The excluded post types before the filter.
	 *
	 * @return array<string> The excluded post types after the filter.
	 */
	public function filter_exclude_post( $excluded_post_types ) {
		$excluded_post_types[] = 'post';

		return $excluded_post_types;
	}

	/**
	 * Tests the get_scores by sending a non filtering taxonomy for this content type.
	 *
	 * @covers ::get_taxonomy
	 * @covers Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository::get_content_type_taxonomy
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_non_filtering_taxonomy() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );
		$request->set_param( 'taxonomy', 'post_tag' );
		$request->set_param( 'term', 'irrelevant' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid taxonomy.' );
	}

	/**
	 * Tests the get_scores by sending an invalid term for this taxonomy and content type.
	 *
	 * @covers ::get_validated_term_id
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_invalid_term() {
		$tag_id = \wp_insert_term(
			'Test tag',
			'post_tag',
			[
				'slug' => 'test-tag',
			]
		);

		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );
		$request->set_param( 'taxonomy', 'category' );
		$request->set_param( 'term', $tag_id['term_id'] );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid term.' );
	}

	/**
	 * Tests trying to get_scores with an unauthorized user.
	 *
	 * @covers ::permission_manage_options
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_not_priviliged_user() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'author' ] );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( $response_data['code'], 'rest_forbidden' );
		$this->assertSame( $response_data['data']['status'], 403 );
	}

	/**
	 * Tests the get_scores method.
	 *
	 * @covers ::get_scores
	 * @covers ::get_content_type
	 * @covers ::get_taxonomy
	 * @covers ::get_validated_term_id
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\SEO_Score_Results\SEO_Score_Results_Repository::get_score_results
	 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\SEO_Score_Results\SEO_Score_Results_Collector::get_score_results
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_scores
	 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_score_links
	 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector::get_view_link
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Score_Result\Score_Result::to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Scores_List::to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_name
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_amount
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_links_to_array
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_name
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_min_score
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_max_score
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_position
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_filter_key
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface::get_filter_value
	 * @covers Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type::get_name
	 *
	 * @dataProvider data_provider_get_seo_scores
	 *
	 * @param array<array<string,string>> $inserted_posts   The posts to be insterted.
	 * @param array<string,string|int>    $taxonomy_filter  An array of term IDs and slugs.
	 * @param array<string,int>           $expected_amounts The amounts of the scores that are expected to be returned.
	 *
	 * @return void
	 */
	public function test_get_seo_scores( $inserted_posts, $taxonomy_filter, $expected_amounts ) {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );

		if ( ! empty( $taxonomy_filter ) ) {
			$request->set_param( 'taxonomy', 'category' );
			$request->set_param( 'term', $taxonomy_filter['term_id'] );
		}

		foreach ( $inserted_posts as $key => $post ) {
			$meta_input = [];
			foreach ( $post['meta_input'] as $meta_key => $meta_value ) {
				$meta_input[ $meta_key ] = $meta_value;
			}

			$this->factory()->post->create(
				[
					'post_title'    => 'Test Post ' . $key,
					'post_status'   => 'publish',
					'post_category' => [ $post['post_category'] ],
					'meta_input'    => $meta_input,
				]
			);
		}

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertIsArray( $response_data );
		$this->assertIsArray( $response_data['scores'] );
		$this->assertIsFloat( $response_data['queryTime'] );
		$this->assertIsBool( $response_data['cacheUsed'] );

		$this->assertEquals( $response_data['scores'][0]['name'], 'good' );
		$this->assertEquals( $response_data['scores'][0]['amount'], $expected_amounts['good'] );

		$this->assertEquals( $response_data['scores'][1]['name'], 'ok' );
		$this->assertEquals( $response_data['scores'][1]['amount'], $expected_amounts['ok'] );

		$this->assertEquals( $response_data['scores'][2]['name'], 'bad' );
		$this->assertEquals( $response_data['scores'][2]['amount'], $expected_amounts['bad'] );

		$this->assertEquals( $response_data['scores'][3]['name'], 'notAnalyzed' );
		$this->assertEquals( $response_data['scores'][3]['amount'], $expected_amounts['notAnalyzed'] );

		$link_suffix = ( ! empty( $taxonomy_filter ) ) ? '&category_name=' . $taxonomy_filter['term_slug'] : '';
		$this->assertEquals( $response_data['scores'][0]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=post&seo_filter=good' . $link_suffix );
		$this->assertEquals( $response_data['scores'][1]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=post&seo_filter=ok' . $link_suffix );
		$this->assertEquals( $response_data['scores'][2]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=post&seo_filter=bad' . $link_suffix );
		$this->assertEquals( $response_data['scores'][3]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=post&seo_filter=na' . $link_suffix );
	}

	/**
	 * Data provider for test_get_seo_scores.
	 *
	 * @return array<string,bool>
	 */
	public static function data_provider_get_seo_scores() {
		$term = self::factory()->term->create_and_get(
			[
				'name'     => 'Test category',
				'taxonomy' => 'category',
				[
					'slug' => 'test-category',
				],
			]
		);

		$term_id   = $term->term_id;
		$term_slug = 'test-category';

		$inserted_posts_in_multiple_terms = [
			[
				'post_category' => 1,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '30',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => $term_id,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '30',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => 1,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '10',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => $term_id,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '10',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => 1,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '50',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => $term_id,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '50',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => 1,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '80',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => $term_id,
				'meta_input'    => [
					'_yoast_wpseo_linkdex' => '80',
					'_yoast_wpseo_focuskw' => 'test',
				],
			],
			[
				'post_category' => 1,
				'meta_input'    => [],
			],
			[
				'post_category' => $term_id,
				'meta_input'    => [],
			],
		];

		yield 'No posts insterted' => [
			'inserted_posts'   => [],
			'taxonomy_filter'  => [],
			'expected_amounts' => [
				'good'        => 0,
				'ok'          => 0,
				'bad'         => 0,
				'notAnalyzed' => 0,
			],
		];
		yield 'Multiple posts of all sorts of SEO scores from term with ID 1' => [
			'inserted_posts'   => $inserted_posts_in_multiple_terms,
			'taxonomy_filter'  => [
				'term_id'   => $term_id,
				'term_slug' => $term_slug,
			],
			'expected_amounts' => [
				'good'        => 1,
				'ok'          => 1,
				'bad'         => 2,
				'notAnalyzed' => 1,
			],
		];
		yield 'Multiple posts of all sorts of SEO scores from all terms' => [
			'inserted_posts'   => $inserted_posts_in_multiple_terms,
			'taxonomy_filter'  => [],
			'expected_amounts' => [
				'good'        => 2,
				'ok'          => 2,
				'bad'         => 4,
				'notAnalyzed' => 2,
			],
		];
	}
}
