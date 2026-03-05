<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The language helper mock.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language_helper;

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

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->language_helper      = Mockery::mock( Language_Helper::class );

		$this->instance = new Score_Retriever(
			$this->indexable_repository,
			$this->options_helper,
			$this->language_helper,
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
	 * Tests get_seo_score with a post that has a keyphrase and good score.
	 *
	 * @covers ::get_seo_score
	 *
	 * @return void
	 */
	public function test_get_seo_score_with_keyphrase_and_good_score() {
		$indexable                              = Mockery::mock();
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

		$this->options_helper
			->expects( 'get' )
			->with( 'inclusive_language_analysis_active', false )
			->andReturn( true );

		$this->language_helper
			->expects( 'get_language' )
			->andReturn( 'en' );

		$this->language_helper
			->expects( 'has_inclusive_language_support' )
			->with( 'en' )
			->andReturn( true );

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
	 * Tests get_inclusive_language_score when the feature is disabled.
	 *
	 * @covers ::get_inclusive_language_score
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_score_feature_disabled() {
		$this->options_helper
			->expects( 'get' )
			->with( 'inclusive_language_analysis_active', false )
			->andReturn( false );

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

		$this->options_helper
			->expects( 'get' )
			->zeroOrMoreTimes()
			->with( 'inclusive_language_analysis_active', false )
			->andReturn( true );

		$this->language_helper
			->expects( 'get_language' )
			->zeroOrMoreTimes()
			->andReturn( 'en' );

		$this->language_helper
			->expects( 'has_inclusive_language_support' )
			->zeroOrMoreTimes()
			->with( 'en' )
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

		$this->options_helper
			->expects( 'get' )
			->zeroOrMoreTimes()
			->with( 'inclusive_language_analysis_active', false )
			->andReturn( false );

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
