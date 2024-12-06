<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Readability_Scores;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Get_Scores_Test
 *
 * @group dashboard
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::get_scores
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::get_content_type
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::get_taxonomy
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::get_validated_term_id
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Readability_Score_Results\Readability_Score_Results_Repository::get_score_results
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Results\Readability_Score_Results\Readability_Score_Results_Collector::get_score_results
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_scores
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Results\Current_Scores_Repository::get_current_score_links
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Score_Groups\Score_Group_Link_Collector::get_view_link
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Score_Result::to_array
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Scores_List::to_array
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_name
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_amount
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Results\Current_Score::get_links_to_array
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_name
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_min_score
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_max_score
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_position
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_filter_key
 * @covers Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Readability_Score_Groups\Readability_Score_Groups_Interface::get_filter_value
 * @covers Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type::get_name
 */
final class Get_Scores_Test extends Abstract_Readability_Scores_Test {

	/**
	 * Tests the get_scores method.
	 *
	 * @dataProvider data_provider_get_readability_scores
	 *
	 * @param array<array<string,string|false>> $inserted_posts   The posts to be insterted.
	 * @param bool                              $taxonomy_filter  Whether there's a taxonomy filter.
	 * @param array<string,int>                 $expected_amounts The amounts of the scores that are expected to be returned.
	 *
	 * @return void
	 */
	public function test_get_readability_scores( $inserted_posts, $taxonomy_filter, $expected_amounts ) {
		$this->register_blog_post_type();

		$term = self::factory()->term->create_and_get(
			[
				'name'     => 'Test category',
				'taxonomy' => 'category',
				[
					'slug' => 'test-category',
				],
			]
		);

		$term_id   = (int) $term->term_id;
		$term_slug = 'test-category';

		$request = new WP_REST_Request( 'GET', '/yoast/v1/readability_scores' );
		$request->set_param( 'contentType', 'blog-post' );

		if ( ! empty( $taxonomy_filter ) ) {
			$request->set_param( 'taxonomy', 'category' );
			$request->set_param( 'term', $term_id );
		}

		$new_ids = [];
		foreach ( $inserted_posts as $key => $post ) {
			$meta_input = [];
			foreach ( $post['meta_input'] as $meta_key => $meta_value ) {
				$meta_input[ $meta_key ] = $meta_value;
			}

			$new_ids[] = self::factory()->post->create(
				[
					'post_title'    => 'Test Post ' . $key,
					'post_status'   => 'publish',
					'post_type'     => 'blog-post',
					'post_category' => ( $post['custom_category'] ) ? [ $term_id ] : [ 1 ],
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

		$link_suffix = ( $taxonomy_filter ) ? '&category_name=' . $term_slug : '';
		$this->assertEquals( $response_data['scores'][0]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=blog-post&readability_filter=good' . $link_suffix );
		$this->assertEquals( $response_data['scores'][1]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=blog-post&readability_filter=ok' . $link_suffix );
		$this->assertEquals( $response_data['scores'][2]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=blog-post&readability_filter=bad' . $link_suffix );
		$this->assertEquals( $response_data['scores'][3]['links']['view'], 'http://example.org/wp-admin/edit.php?post_status=publish&post_type=blog-post&readability_filter=na' . $link_suffix );

		// Clean up.
		foreach ( $new_ids as $new_id ) {
			\wp_delete_post( $new_id, true );
		}
		\unregister_post_type( 'blog-post' );
		\wp_delete_term( $term_id, 'category' );
	}

	/**
	 * Data provider for test_get_readability_scores.
	 *
	 * @return array<string,bool>
	 */
	public static function data_provider_get_readability_scores() {

		$inserted_posts_in_multiple_terms = [
			[
				'custom_category' => false,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '30',
				],
			],
			[
				'custom_category' => true,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '30',
				],
			],
			[
				'custom_category' => false,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '10',
				],
			],
			[
				'custom_category' => true,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '10',
				],
			],
			[
				'custom_category' => false,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '50',
				],
			],
			[
				'custom_category' => true,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '50',
				],
			],
			[
				'custom_category' => false,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '80',
				],
			],
			[
				'custom_category' => true,
				'meta_input'      => [
					'_yoast_wpseo_content_score' => '80',
				],
			],
			[
				'custom_category' => false,
				'meta_input'      => [],
			],
			[
				'custom_category' => true,
				'meta_input'      => [],
			],
		];

		yield 'No posts inserted' => [
			'inserted_posts'   => [],
			'taxonomy_filter'  => false,
			'expected_amounts' => [
				'good'        => 0,
				'ok'          => 0,
				'bad'         => 0,
				'notAnalyzed' => 0,
			],
		];
		yield 'Multiple posts of all sorts of SEO scores from term with ID 1' => [
			'inserted_posts'   => $inserted_posts_in_multiple_terms,
			'taxonomy_filter'  => true,
			'expected_amounts' => [
				'good'        => 1,
				'ok'          => 1,
				'bad'         => 2,
				'notAnalyzed' => 1,
			],
		];
		yield 'Multiple posts of all sorts of SEO scores from all terms' => [
			'inserted_posts'   => $inserted_posts_in_multiple_terms,
			'taxonomy_filter'  => false,
			'expected_amounts' => [
				'good'        => 2,
				'ok'          => 2,
				'bad'         => 4,
				'notAnalyzed' => 2,
			],
		];
	}

	/**
	 * Action function to register new blog post post type.
	 *
	 * @return void
	 */
	public function register_blog_post_type() {
		$args = [
			'label'              => 'Blog posts',
			'public'             => true,
			'has_archive'        => true,
			'show_in_rest'       => true,
			'taxonomies'         => [ 'category' ],
		];

		\register_post_type( 'blog-post', $args );
	}
}
