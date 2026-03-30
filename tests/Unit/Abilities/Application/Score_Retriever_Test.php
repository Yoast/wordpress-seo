<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Score_Retriever class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Score_Retriever
 */
final class Score_Retriever_Test extends TestCase {

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The instance under test.
	 *
	 * @var Score_Retriever
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Score_Retriever(
			$this->indexable_repository,
		);

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);
	}

	/**
	 * Tests get_seo_scores returns results for multiple posts.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_returns_array_of_results() {
		$indexable1                              = Mockery::mock();
		$indexable1->breadcrumb_title            = 'Best Hiking Boots';
		$indexable1->is_robots_noindex           = 0;
		$indexable1->primary_focus_keyword_score = 78;
		$indexable1->primary_focus_keyword       = 'hiking boots';

		$indexable2                              = Mockery::mock();
		$indexable2->breadcrumb_title            = 'Trail Running Guide';
		$indexable2->is_robots_noindex           = 0;
		$indexable2->primary_focus_keyword_score = 30;
		$indexable2->primary_focus_keyword       = null;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable1, $indexable2 ] );

		$result = $this->instance->get_seo_scores( [] );

		$this->assertSame(
			[
				[
					'title'           => 'Best Hiking Boots',
					'score'           => 78,
					'rating'          => 'good',
					'label'           => 'Good',
					'focus_keyphrase' => 'hiking boots',
				],
				[
					'title'           => 'Trail Running Guide',
					'score'           => 30,
					'rating'          => 'bad',
					'label'           => 'Needs improvement',
					'focus_keyphrase' => null,
				],
			],
			$result,
		);
	}

	/**
	 * Tests get_seo_scores with a noindexed post.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_noindex_post() {
		$indexable                        = Mockery::mock();
		$indexable->breadcrumb_title      = 'Draft Post';
		$indexable->is_robots_noindex     = 1;
		$indexable->primary_focus_keyword = 'some keyword';

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable ] );

		$result = $this->instance->get_seo_scores( [] );

		$this->assertSame(
			[
				[
					'title'           => 'Draft Post',
					'score'           => 0,
					'rating'          => 'noindex',
					'label'           => 'No index',
					'focus_keyphrase' => 'some keyword',
				],
			],
			$result,
		);
	}

	/**
	 * Tests get_seo_scores returns empty array when no posts exist.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_empty_result() {
		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [] );

		$result = $this->instance->get_seo_scores( [] );

		$this->assertSame( [], $result );
	}

	/**
	 * Tests get_seo_scores uses default number of posts when not specified.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_default_number_of_posts() {
		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [] );

		$this->instance->get_seo_scores( [] );
	}

	/**
	 * Tests get_seo_scores respects custom number of posts.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_custom_number_of_posts() {
		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 5, false )
			->andReturn( [] );

		$this->instance->get_seo_scores( [ 'number_of_posts' => 5 ] );
	}

	/**
	 * Tests get_seo_scores caps the number of posts at 100.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_caps_at_maximum() {
		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 100, false )
			->andReturn( [] );

		$this->instance->get_seo_scores( [ 'number_of_posts' => 999 ] );
	}

	/**
	 * Tests get_seo_scores uses fallback title when breadcrumb_title is empty.
	 *
	 * @covers ::get_seo_scores
	 *
	 * @return void
	 */
	public function test_get_seo_scores_fallback_title() {
		$indexable                              = Mockery::mock();
		$indexable->breadcrumb_title            = '';
		$indexable->is_robots_noindex           = 0;
		$indexable->primary_focus_keyword_score = 50;
		$indexable->primary_focus_keyword       = null;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable ] );

		$result = $this->instance->get_seo_scores( [] );

		$this->assertSame( '(no title)', $result[0]['title'] );
	}

	/**
	 * Tests get_readability_scores returns results for multiple posts.
	 *
	 * @covers ::get_readability_scores
	 *
	 * @return void
	 */
	public function test_get_readability_scores_returns_array() {
		$indexable1                    = Mockery::mock();
		$indexable1->breadcrumb_title  = 'Post One';
		$indexable1->readability_score = 45;

		$indexable2                    = Mockery::mock();
		$indexable2->breadcrumb_title  = 'Post Two';
		$indexable2->readability_score = 30;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable1, $indexable2 ] );

		$result = $this->instance->get_readability_scores( [] );

		$this->assertSame(
			[
				[
					'title'  => 'Post One',
					'score'  => 45,
					'rating' => 'ok',
					'label'  => 'OK',
				],
				[
					'title'  => 'Post Two',
					'score'  => 30,
					'rating' => 'bad',
					'label'  => 'Needs improvement',
				],
			],
			$result,
		);
	}

	/**
	 * Tests get_inclusive_language_scores returns na for score of zero.
	 *
	 * @covers ::get_inclusive_language_scores
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_scores_not_calculated() {
		$indexable                           = Mockery::mock();
		$indexable->breadcrumb_title         = 'Some Post';
		$indexable->inclusive_language_score = 0;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable ] );

		$result = $this->instance->get_inclusive_language_scores( [] );

		$this->assertSame(
			[
				[
					'title'  => 'Some Post',
					'score'  => 0,
					'rating' => 'na',
					'label'  => 'Not available',
				],
			],
			$result,
		);
	}

	/**
	 * Tests get_inclusive_language_scores with an ok score.
	 *
	 * @covers ::get_inclusive_language_scores
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_scores_ok() {
		$indexable                           = Mockery::mock();
		$indexable->breadcrumb_title         = 'Some Post';
		$indexable->inclusive_language_score = 55;

		$this->indexable_repository
			->expects( 'get_recently_modified_posts' )
			->once()
			->with( 'post', 10, false )
			->andReturn( [ $indexable ] );

		$result = $this->instance->get_inclusive_language_scores( [] );

		$this->assertSame(
			[
				[
					'title'  => 'Some Post',
					'score'  => 55,
					'rating' => 'ok',
					'label'  => 'Potentially non-inclusive',
				],
			],
			$result,
		);
	}
}
