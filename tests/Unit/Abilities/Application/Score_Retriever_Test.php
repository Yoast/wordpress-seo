<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\Infrastructure\Enabled_Analysis_Features_Checker;
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
	 * The enabled analysis features checker mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Checker
	 */
	private $enabled_analysis_features_checker;

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

		Mockery::mock( WP_Error::class );

		$this->indexable_repository              = Mockery::mock( Indexable_Repository::class );
		$this->enabled_analysis_features_checker = Mockery::mock( Enabled_Analysis_Features_Checker::class );

		$this->instance = new Score_Retriever(
			$this->indexable_repository,
			$this->enabled_analysis_features_checker,
		);

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_keyword_analysis_enabled' )
			->andReturn( true )
			->byDefault();

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_content_analysis_enabled' )
			->andReturn( true )
			->byDefault();

		$this->enabled_analysis_features_checker
			->shouldReceive( 'is_inclusive_language_enabled' )
			->andReturn( false )
			->byDefault();
	}

	/**
	 * Tests get_seo_score with a post that has a keyphrase and good score.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_with_keyphrase_and_good_score() {
		$indexable                              = Mockery::mock();
		$indexable->is_robots_noindex           = 0;
		$indexable->primary_focus_keyword_score = 78;
		$indexable->primary_focus_keyword       = 'best hiking boots';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_seo_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'           => 78,
				'rating'          => 'good',
				'label'           => 'Good',
				'focus_keyphrase' => 'best hiking boots',
			],
			$result,
		);
	}

	/**
	 * Tests get_seo_score with a post that has no focus keyphrase.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_with_no_focus_keyphrase() {
		$indexable                              = Mockery::mock();
		$indexable->is_robots_noindex           = 0;
		$indexable->primary_focus_keyword_score = 0;
		$indexable->primary_focus_keyword       = null;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_seo_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'           => 0,
				'rating'          => 'na',
				'label'           => 'Not available',
				'focus_keyphrase' => null,
			],
			$result,
		);
	}

	/**
	 * Tests get_seo_score when the post is not found.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_post_not_found() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 99_999 )
			->andReturn( null );

		$result = $this->instance->get_seo_score( [ 'post_id' => 99_999 ] );

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * Tests get_seo_score when no indexable exists.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_no_indexable() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( false );

		$result = $this->instance->get_seo_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'           => 0,
				'rating'          => 'na',
				'label'           => 'Not available',
				'focus_keyphrase' => null,
			],
			$result,
		);
	}

	/**
	 * Tests get_seo_score when the post is noindexed.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_noindexed() {
		$indexable                        = Mockery::mock();
		$indexable->is_robots_noindex     = 1;
		$indexable->primary_focus_keyword = 'best hiking boots';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_seo_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'           => 0,
				'rating'          => 'noindex',
				'label'           => 'No index',
				'focus_keyphrase' => 'best hiking boots',
			],
			$result,
		);
	}

	/**
	 * Tests get_readability_score with an ok score.
	 *
	 * @covers ::get_readability_score
	 *
	 * @return void
	 */
	public function test_get_readability_score_ok() {
		$indexable                    = Mockery::mock();
		$indexable->readability_score = 45;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_readability_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'  => 45,
				'rating' => 'ok',
				'label'  => 'OK',
			],
			$result,
		);
	}

	/**
	 * Tests get_readability_score with a bad score.
	 *
	 * @covers ::get_readability_score
	 *
	 * @return void
	 */
	public function test_get_readability_score_bad() {
		$indexable                    = Mockery::mock();
		$indexable->readability_score = 30;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_readability_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'  => 30,
				'rating' => 'bad',
				'label'  => 'Needs improvement',
			],
			$result,
		);
	}

	/**
	 * Tests get_inclusive_language_score with an ok score.
	 *
	 * @covers ::get_inclusive_language_score
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_score_ok() {
		$indexable                           = Mockery::mock();
		$indexable->inclusive_language_score = 55;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_inclusive_language_score( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'score'  => 55,
				'rating' => 'ok',
				'label'  => 'Potentially non-inclusive',
			],
			$result,
		);
	}

	/**
	 * Tests get_inclusive_language_score when no indexable exists.
	 *
	 * @covers ::get_inclusive_language_score
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_score_no_indexable() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( false );

		$result = $this->instance->get_inclusive_language_score( [ 'post_id' => 42 ] );

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * Tests get_inclusive_language_score when the score has not been calculated yet.
	 *
	 * @covers ::get_inclusive_language_score
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_score_not_yet_calculated() {
		$indexable                           = Mockery::mock();
		$indexable->inclusive_language_score = 0;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$result = $this->instance->get_inclusive_language_score( [ 'post_id' => 42 ] );

		$this->assertInstanceOf( WP_Error::class, $result );
	}

	/**
	 * Tests get_all_scores with inclusive language enabled.
	 *
	 * @covers ::get_all_scores
	 *
	 * @return void
	 */
	public function test_get_all_scores_with_inclusive_language_enabled() {
		$indexable                              = Mockery::mock();
		$indexable->is_robots_noindex           = 0;
		$indexable->primary_focus_keyword_score = 78;
		$indexable->primary_focus_keyword       = 'best hiking boots';
		$indexable->readability_score           = 30;
		$indexable->inclusive_language_score    = 85;

		Monkey\Functions\expect( 'get_post' )
			->zeroOrMoreTimes()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->zeroOrMoreTimes()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$this->enabled_analysis_features_checker
			->expects( 'is_keyword_analysis_enabled' )
			->zeroOrMoreTimes()
			->andReturn( true );

		$this->enabled_analysis_features_checker
			->expects( 'is_content_analysis_enabled' )
			->zeroOrMoreTimes()
			->andReturn( true );

		$this->enabled_analysis_features_checker
			->expects( 'is_inclusive_language_enabled' )
			->zeroOrMoreTimes()
			->andReturn( true );

		$result = $this->instance->get_all_scores( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'seo'                => [
					'score'           => 78,
					'rating'          => 'good',
					'label'           => 'Good',
					'focus_keyphrase' => 'best hiking boots',
				],
				'readability'        => [
					'score'  => 30,
					'rating' => 'bad',
					'label'  => 'Needs improvement',
				],
				'inclusive_language' => [
					'score'  => 85,
					'rating' => 'good',
					'label'  => 'Good',
				],
			],
			$result,
		);
	}

	/**
	 * Tests get_all_scores with inclusive language disabled.
	 *
	 * @covers ::get_all_scores
	 *
	 * @return void
	 */
	public function test_get_all_scores_with_inclusive_language_disabled() {
		$indexable                              = Mockery::mock();
		$indexable->is_robots_noindex           = 0;
		$indexable->primary_focus_keyword_score = 78;
		$indexable->primary_focus_keyword       = 'best hiking boots';
		$indexable->readability_score           = 30;

		Monkey\Functions\expect( 'get_post' )
			->zeroOrMoreTimes()
			->with( 42 )
			->andReturn( (object) [ 'ID' => 42 ] );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->zeroOrMoreTimes()
			->with( 42, 'post', false )
			->andReturn( $indexable );

		$this->enabled_analysis_features_checker
			->expects( 'is_keyword_analysis_enabled' )
			->zeroOrMoreTimes()
			->andReturn( true );

		$this->enabled_analysis_features_checker
			->expects( 'is_content_analysis_enabled' )
			->zeroOrMoreTimes()
			->andReturn( true );

		$result = $this->instance->get_all_scores( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'seo'                => [
					'score'           => 78,
					'rating'          => 'good',
					'label'           => 'Good',
					'focus_keyphrase' => 'best hiking boots',
				],
				'readability'        => [
					'score'  => 30,
					'rating' => 'bad',
					'label'  => 'Needs improvement',
				],
				'inclusive_language' => null,
			],
			$result,
		);
	}
}
