<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Score_Groups\SEO_Score_Groups;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Bad_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Good_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\No_SEO_Score_Group;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\Ok_SEO_Score_Group;

/**
 * Test class for the get_score_group method.
 *
 * @group SEO_Score_Groups_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository::get_score_group
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository::get_no_score_group
 * @covers Yoast\WP\SEO\Dashboard\Application\Score_Groups\Abstract_Score_Groups_Repository::get_score_group
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class SEO_Score_Groups_Repository_Get_Score_Group_Test extends Abstract_SEO_Score_Groups_Repository_Test {

	/**
	 * Tests that a null score returns the No_SEO_Score_Group.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_null_returns_no_score_group() {
		$result = $this->instance->get_score_group( null );

		$this->assertInstanceOf( No_SEO_Score_Group::class, $result );
		$this->assertSame( 'notAnalyzed', $result->get_name() );
	}

	/**
	 * Tests that a zero score returns the No_SEO_Score_Group.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_zero_returns_no_score_group() {
		$result = $this->instance->get_score_group( 0 );

		$this->assertInstanceOf( No_SEO_Score_Group::class, $result );
		$this->assertSame( 'notAnalyzed', $result->get_name() );
	}

	/**
	 * Tests that a bad score (1-40) returns the Bad_SEO_Score_Group.
	 *
	 * @dataProvider bad_score_provider
	 *
	 * @param int $score The score to test.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_bad_score( int $score ) {
		$result = $this->instance->get_score_group( $score );

		$this->assertInstanceOf( Bad_SEO_Score_Group::class, $result );
		$this->assertSame( 'bad', $result->get_name() );
	}

	/**
	 * Data provider for bad score tests.
	 *
	 * @return array<string, array<int>> The test data.
	 */
	public static function bad_score_provider(): array {
		return [
			'minimum bad score' => [ 1 ],
			'middle bad score'  => [ 20 ],
			'maximum bad score' => [ 40 ],
		];
	}

	/**
	 * Tests that an OK score (41-70) returns the Ok_SEO_Score_Group.
	 *
	 * @dataProvider ok_score_provider
	 *
	 * @param int $score The score to test.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_ok_score( int $score ) {
		$result = $this->instance->get_score_group( $score );

		$this->assertInstanceOf( Ok_SEO_Score_Group::class, $result );
		$this->assertSame( 'ok', $result->get_name() );
	}

	/**
	 * Data provider for OK score tests.
	 *
	 * @return array<string, array<int>> The test data.
	 */
	public static function ok_score_provider(): array {
		return [
			'minimum ok score' => [ 41 ],
			'middle ok score'  => [ 55 ],
			'maximum ok score' => [ 70 ],
		];
	}

	/**
	 * Tests that a good score (71-100) returns the Good_SEO_Score_Group.
	 *
	 * @dataProvider good_score_provider
	 *
	 * @param int $score The score to test.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_good_score( int $score ) {
		$result = $this->instance->get_score_group( $score );

		$this->assertInstanceOf( Good_SEO_Score_Group::class, $result );
		$this->assertSame( 'good', $result->get_name() );
	}

	/**
	 * Data provider for good score tests.
	 *
	 * @return array<string, array<int>> The test data.
	 */
	public static function good_score_provider(): array {
		return [
			'minimum good score' => [ 71 ],
			'middle good score'  => [ 85 ],
			'maximum good score' => [ 100 ],
		];
	}

	/**
	 * Tests that a score out of range returns the No_SEO_Score_Group.
	 *
	 * @dataProvider out_of_range_score_provider
	 *
	 * @param int $score The score to test.
	 *
	 * @return void
	 */
	public function test_get_score_group_with_out_of_range_score( int $score ) {
		$result = $this->instance->get_score_group( $score );

		$this->assertInstanceOf( No_SEO_Score_Group::class, $result );
		$this->assertSame( 'notAnalyzed', $result->get_name() );
	}

	/**
	 * Data provider for out of range score tests.
	 *
	 * @return array<string, array<int>> The test data.
	 */
	public static function out_of_range_score_provider(): array {
		return [
			'negative score'      => [ -1 ],
			'above maximum score' => [ 101 ],
		];
	}
}
