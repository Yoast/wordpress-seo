<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Rank_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the get_rank function returns the correct rank.
	 *
	 * @covers WPSEO_Rank::get_rank
	 */
	public function test_get_rank() {
		$rank = new WPSEO_Rank( WPSEO_Rank::GOOD );
		$this->assertEquals( WPSEO_Rank::GOOD, $rank->get_rank() );
	}

	/**
	 * Tests whether the defaults of the constructor are there.
	 *
	 * @covers WPSEO_Rank::__construct
	 */
	public function test_constructor() {
		$rank_non_existant = new WPSEO_Rank( 100000 );
		$this->assertEquals( WPSEO_Rank::BAD, $rank_non_existant->get_rank() );
	}

	/**
	 * Tests whether the correct css class is returned.
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected CSS class.
	 *
	 * @dataProvider provider_get_css_class
	 * @covers       WPSEO_Rank::get_css_class
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
	public function provider_get_css_class() {
		return array(
			array( WPSEO_Rank::BAD, 'bad' ),
			array( WPSEO_Rank::OK, 'ok' ),
			array( WPSEO_Rank::GOOD, 'good' ),
			array( WPSEO_Rank::NO_FOCUS, 'na' ),
			array( WPSEO_Rank::NO_INDEX, 'noindex' ),
		);
	}

	/**
	 * Tests whether the correct label is returned.
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected label.
	 *
	 * @dataProvider provider_get_label
	 * @covers       WPSEO_Rank::get_label
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
	public function provider_get_label() {
		return array(
			array( WPSEO_Rank::NO_FOCUS, 'Not available' ),
			array( WPSEO_Rank::NO_INDEX, 'No index' ),
			array( WPSEO_Rank::BAD, 'Needs improvement' ),
			array( WPSEO_Rank::OK, 'OK' ),
			array( WPSEO_Rank::GOOD, 'Good' ),
		);
	}

	/**
	 * Tests whether the correct label for the drop down is returned.
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected drop-down label.
	 *
	 * @dataProvider provider_get_drop_down_label
	 * @covers       WPSEO_Rank::get_drop_down_label
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
	public function provider_get_drop_down_label() {
		return array(
			array( WPSEO_Rank::NO_FOCUS, 'SEO: No Focus Keyphrase' ),
			array( WPSEO_Rank::BAD, 'SEO: Needs improvement' ),
			array( WPSEO_Rank::OK, 'SEO: OK' ),
			array( WPSEO_Rank::GOOD, 'SEO: Good' ),
			array( WPSEO_Rank::NO_INDEX, 'SEO: Post Noindexed' ),
		);
	}

	/**
	 * Tests whether the correct starting score is returned for the passed rank.
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected start score.
	 *
	 * @dataProvider provider_get_starting_score
	 * @covers       WPSEO_Rank::get_starting_score
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
	public function provider_get_starting_score() {
		return array(
			array( WPSEO_Rank::NO_INDEX, -1 ),
			array( WPSEO_Rank::NO_FOCUS, 0 ),
			array( WPSEO_Rank::BAD, 1 ),
			array( WPSEO_Rank::OK, 41 ),
			array( WPSEO_Rank::GOOD, 71 ),
		);
	}

	/**
	 * Tests whether the correct end score is returned for the passed rank.
	 *
	 * @param int    $rank     Ranking.
	 * @param string $expected Expected end score.
	 *
	 * @dataProvider provider_get_end_score
	 * @covers       WPSEO_Rank::get_end_score
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
	public function provider_get_end_score() {
		return array(
			array( WPSEO_Rank::NO_INDEX, -1 ),
			array( WPSEO_Rank::NO_FOCUS, 0 ),
			array( WPSEO_Rank::BAD, 40 ),
			array( WPSEO_Rank::OK, 70 ),
			array( WPSEO_Rank::GOOD, 100 ),
		);
	}

	/**
	 * Tests whether the correct rank is returned for the passed numeric score.
	 *
	 * @param int $score    Numeric score.
	 * @param int $expected Expected ranking.
	 *
	 * @dataProvider provider_from_numeric_score
	 * @covers       WPSEO_Rank::from_numeric_score
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
	public function provider_from_numeric_score() {
		return array(
			array( 0, WPSEO_Rank::NO_FOCUS ),
			array( 1, WPSEO_Rank::BAD ),
			array( 23, WPSEO_Rank::BAD ),
			array( 40, WPSEO_Rank::BAD ),
			array( 41, WPSEO_Rank::OK ),
			array( 55, WPSEO_Rank::OK ),
			array( 70, WPSEO_Rank::OK ),
			array( 71, WPSEO_Rank::GOOD ),
			array( 83, WPSEO_Rank::GOOD ),
			array( 100, WPSEO_Rank::GOOD ),
		);
	}

	public function test_get_all_ranks() {
		$ranks = WPSEO_Rank::get_all_ranks();

		foreach ( $ranks as $rank ) {
			$this->assertInstanceOf( 'WPSEO_Rank', $rank );
		}
	}
}
