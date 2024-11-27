<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use WPSEO_Rank;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Rank_Test extends TestCase {

	/**
	 * Tests whether the get_rank function returns the correct rank.
	 *
	 * @covers WPSEO_Rank::get_rank
	 *
	 * @return void
	 */
	public function test_get_rank() {
		$rank = new WPSEO_Rank( WPSEO_Rank::GOOD );
		$this->assertEquals( WPSEO_Rank::GOOD, $rank->get_rank() );
	}

	/**
	 * Tests whether the defaults of the constructor are there.
	 *
	 * @covers WPSEO_Rank::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$rank_non_existant = new WPSEO_Rank( 100000 );
		$this->assertEquals( WPSEO_Rank::BAD, $rank_non_existant->get_rank() );
	}

	/**
	 * Tests whether the correct css class is returned.
	 *
	 * @dataProvider provider_get_css_class
	 * @covers       WPSEO_Rank::get_css_class
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected CSS class.
	 *
	 * @return void
	 */
	public function test_get_css_class( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_css_class() );
	}

	/**
	 * Data provider for test_get_css_class().
	 *
	 * @return array
	 */
	public static function provider_get_css_class() {
		return [
			[ WPSEO_Rank::BAD, 'bad' ],
			[ WPSEO_Rank::OK, 'ok' ],
			[ WPSEO_Rank::GOOD, 'good' ],
			[ WPSEO_Rank::NO_FOCUS, 'na' ],
			[ WPSEO_Rank::NO_INDEX, 'noindex' ],
		];
	}

	/**
	 * Tests whether the correct label is returned.
	 *
	 * @dataProvider provider_get_label
	 * @covers       WPSEO_Rank::get_label
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected label.
	 *
	 * @return void
	 */
	public function test_get_label( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_label() );
	}

	/**
	 * Data provider for test_get_label().
	 *
	 * @return array
	 */
	public static function provider_get_label() {
		return [
			[ WPSEO_Rank::NO_FOCUS, 'Not available' ],
			[ WPSEO_Rank::NO_INDEX, 'No index' ],
			[ WPSEO_Rank::BAD, 'Needs improvement' ],
			[ WPSEO_Rank::OK, 'OK' ],
			[ WPSEO_Rank::GOOD, 'Good' ],
		];
	}

	/**
	 * Tests whether the correct inclusive language label is returned.
	 *
	 * @dataProvider provider_get_inclusive_language_label
	 * @covers       WPSEO_Rank::get_inclusive_language_label
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected label.
	 *
	 * @return void
	 */
	public function test_get_inclusive_language_label( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_inclusive_language_label() );
	}

	/**
	 * Data provider for test_get_inclusive_language_label().
	 *
	 * @return array
	 */
	public static function provider_get_inclusive_language_label() {
		return [
			[ WPSEO_Rank::NO_FOCUS, 'Not available' ],
			[ WPSEO_Rank::NO_INDEX, 'No index' ],
			[ WPSEO_Rank::BAD, 'Needs improvement' ],
			[ WPSEO_Rank::OK, 'Potentially non-inclusive' ],
			[ WPSEO_Rank::GOOD, 'Good' ],
		];
	}

	/**
	 * Tests whether the correct label for the SEO drop down is returned.
	 *
	 * @dataProvider provider_get_drop_down_label
	 * @covers       WPSEO_Rank::get_drop_down_label
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected drop-down label.
	 *
	 * @return void
	 */
	public function test_get_drop_down_label( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_drop_down_label() );
	}

	/**
	 * Data provider for test_get_drop_down_label().
	 *
	 * @return array
	 */
	public static function provider_get_drop_down_label() {
		return [
			[ WPSEO_Rank::NO_FOCUS, 'SEO: No Focus Keyphrase' ],
			[ WPSEO_Rank::BAD, 'SEO: Needs improvement' ],
			[ WPSEO_Rank::OK, 'SEO: OK' ],
			[ WPSEO_Rank::GOOD, 'SEO: Good' ],
			[ WPSEO_Rank::NO_INDEX, 'SEO: Post Noindexed' ],
		];
	}

	/**
	 * Tests whether the correct label for the readability drop down is returned.
	 *
	 * @dataProvider provider_get_drop_down_readability_labels
	 * @covers       WPSEO_Rank::get_drop_down_readability_labels
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected drop-down label.
	 *
	 * @return void
	 */
	public function test_get_drop_down_readability_labels( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_drop_down_readability_labels() );
	}

	/**
	 * Data provider for test_get_drop_down_readability_labels().
	 *
	 * @return array
	 */
	public static function provider_get_drop_down_readability_labels() {
		return [
			[ WPSEO_Rank::BAD, 'Readability: Needs improvement' ],
			[ WPSEO_Rank::OK, 'Readability: OK' ],
			[ WPSEO_Rank::GOOD, 'Readability: Good' ],
			[ WPSEO_Rank::NO_FOCUS, 'Readability: Not analyzed' ],
		];
	}

	/**
	 * Tests whether the correct label for the inclusive language drop down is returned.
	 *
	 * @dataProvider provider_get_drop_down_inclusive_language_labels
	 * @covers       WPSEO_Rank::get_drop_down_inclusive_language_labels
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected drop-down label.
	 *
	 * @return void
	 */
	public function test_get_drop_down_inclusive_language_labels( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_drop_down_inclusive_language_labels() );
	}

	/**
	 * Data provider for test_get_drop_down_inclusive_language_labels().
	 *
	 * @return array
	 */
	public static function provider_get_drop_down_inclusive_language_labels() {
		return [
			[ WPSEO_Rank::BAD, 'Inclusive language: Needs improvement' ],
			[ WPSEO_Rank::OK, 'Inclusive language: Potentially non-inclusive' ],
			[ WPSEO_Rank::GOOD, 'Inclusive language: Good' ],
		];
	}

	/**
	 * Tests whether the correct starting score is returned for the passed rank.
	 *
	 * @dataProvider provider_get_starting_score
	 * @covers       WPSEO_Rank::get_starting_score
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected start score.
	 *
	 * @return void
	 */
	public function test_get_starting_score( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_starting_score() );
	}

	/**
	 * Data provider for test_get_starting_score().
	 *
	 * @return array
	 */
	public static function provider_get_starting_score() {
		return [
			[ WPSEO_Rank::NO_INDEX, -1 ],
			[ WPSEO_Rank::NO_FOCUS, 0 ],
			[ WPSEO_Rank::BAD, 1 ],
			[ WPSEO_Rank::OK, 41 ],
			[ WPSEO_Rank::GOOD, 71 ],
		];
	}

	/**
	 * Tests whether the correct end score is returned for the passed rank.
	 *
	 * @dataProvider provider_get_end_score
	 * @covers       WPSEO_Rank::get_end_score
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected end score.
	 *
	 * @return void
	 */
	public function test_get_end_score( $rank, $expected ) {
		$rank = new WPSEO_Rank( $rank );

		$this->assertEquals( $expected, $rank->get_end_score() );
	}

	/**
	 * Data provider for test_get_end_score().
	 *
	 * @return array
	 */
	public static function provider_get_end_score() {
		return [
			[ WPSEO_Rank::NO_INDEX, -1 ],
			[ WPSEO_Rank::NO_FOCUS, 0 ],
			[ WPSEO_Rank::BAD, 40 ],
			[ WPSEO_Rank::OK, 70 ],
			[ WPSEO_Rank::GOOD, 100 ],
		];
	}

	/**
	 * Tests whether the correct rank is returned for the passed numeric score.
	 *
	 * @dataProvider provider_from_numeric_score
	 * @covers       WPSEO_Rank::from_numeric_score
	 *
	 * @param int $score    Numeric score.
	 * @param int $expected Expected ranking.
	 *
	 * @return void
	 */
	public function test_from_numeric_score( $score, $expected ) {
		$rank = WPSEO_Rank::from_numeric_score( $score );

		$this->assertEquals( $expected, $rank->get_rank() );
	}

	/**
	 * Data provider for test_from_numeric_score().
	 *
	 * @return array
	 */
	public static function provider_from_numeric_score() {
		return [
			[ 0, WPSEO_Rank::NO_FOCUS ],
			[ 1, WPSEO_Rank::BAD ],
			[ 23, WPSEO_Rank::BAD ],
			[ 40, WPSEO_Rank::BAD ],
			[ 41, WPSEO_Rank::OK ],
			[ 55, WPSEO_Rank::OK ],
			[ 70, WPSEO_Rank::OK ],
			[ 71, WPSEO_Rank::GOOD ],
			[ 83, WPSEO_Rank::GOOD ],
			[ 100, WPSEO_Rank::GOOD ],
		];
	}

	/**
	 * Tests whether all the SEO ranks are instances of the WPSEO_Rank class.
	 *
	 * @covers WPSEO_Rank::get_all_ranks
	 *
	 * @return void
	 */
	public function test_get_all_ranks() {
		$ranks = WPSEO_Rank::get_all_ranks();

		foreach ( $ranks as $rank ) {
			$this->assertInstanceOf( WPSEO_Rank::class, $rank );
		}
	}

	/**
	 * Tests whether all the readability ranks are instances of the WPSEO_Rank class.
	 *
	 * @covers WPSEO_Rank::get_all_readability_ranks
	 *
	 * @return void
	 */
	public function test_get_all_readability_ranks() {
		$ranks = WPSEO_Rank::get_all_readability_ranks();

		foreach ( $ranks as $rank ) {
			$this->assertInstanceOf( WPSEO_Rank::class, $rank );
		}
	}

	/**
	 * Tests whether all the inclusive language ranks are instances of the WPSEO_Rank class.
	 *
	 * @covers WPSEO_Rank::get_all_inclusive_language_ranks
	 *
	 * @return void
	 */
	public function test_get_all_inclusive_language_ranks() {
		$ranks = WPSEO_Rank::get_all_inclusive_language_ranks();

		foreach ( $ranks as $rank ) {
			$this->assertInstanceOf( WPSEO_Rank::class, $rank );
		}
	}
}
