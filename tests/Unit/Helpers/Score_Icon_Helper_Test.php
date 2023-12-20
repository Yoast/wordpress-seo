<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Helpers\Score_Icon_Helper;
use Yoast\WP\SEO\Presenters\Score_Icon_Presenter;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Score_Icon_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Score_Icon_Helper
 */
final class Score_Icon_Helper_Test extends TestCase {

	/**
	 * Represents the Score_Icon_Helper.
	 *
	 * @var Score_Icon_Helper
	 */
	private $instance;

	/**
	 * Represents the Robots_Helper.
	 *
	 * @var Mockery\MockInterface|Robots_Helper
	 */
	protected $robots_helper;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->robots_helper = Mockery::mock( Robots_Helper::class );

		$this->instance = new Score_Icon_Helper( $this->robots_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Robots_Helper::class,
			$this->getPropertyValue( $this->instance, 'robots_helper' )
		);
	}

	/**
	 * Tests that the readability icon is as expected.
	 *
	 * @dataProvider readability_provider
	 *
	 * @covers ::for_readability
	 *
	 * @param int    $score       The score.
	 * @param string $extra_class The extra class.
	 * @param string $expected    The expected present output.
	 *
	 * @return void
	 */
	public function test_for_readability( $score, $extra_class, $expected ) {
		$actual = $this->instance->for_readability( $score, $extra_class );

		$this->assertInstanceOf( Score_Icon_Presenter::class, $actual );
		$this->assertSame( $expected, $actual->present() );
	}

	/**
	 * Provides the readability test data.
	 *
	 * @return array The readability data.
	 */
	public static function readability_provider() {
		return [
			'not available' => [
				'score'       => 0,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Not available" class="wpseo-score-icon na"><span class="wpseo-score-text screen-reader-text">Not available</span></div>',
			],
			'bad'           => [
				'score'       => 1,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Needs improvement" class="wpseo-score-icon bad"><span class="wpseo-score-text screen-reader-text">Needs improvement</span></div>',
			],
			'ok'            => [
				'score'       => 41,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="OK" class="wpseo-score-icon ok"><span class="wpseo-score-text screen-reader-text">OK</span></div>',
			],
			'good'          => [
				'score'       => 71,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Good" class="wpseo-score-icon good"><span class="wpseo-score-text screen-reader-text">Good</span></div>',
			],
			'with_class'    => [
				'score'       => 50,
				'extra_class' => 'FOO',
				'expected'    => '<div aria-hidden="true" title="OK" class="wpseo-score-icon ok FOO"><span class="wpseo-score-text screen-reader-text">OK</span></div>',
			],
		];
	}

	/**
	 * Tests that the inclusive language icon is as expected.
	 *
	 * @dataProvider inclusive_language_provider
	 *
	 * @covers ::for_inclusive_language
	 *
	 * @param int    $score       The score.
	 * @param string $extra_class The extra class.
	 * @param string $expected    The expected present output.
	 *
	 * @return void
	 */
	public function test_for_inclusive_language( $score, $extra_class, $expected ) {
		$actual = $this->instance->for_inclusive_language( $score, $extra_class );

		$this->assertInstanceOf( Score_Icon_Presenter::class, $actual );
		$this->assertSame( $expected, $actual->present() );
	}

	/**
	 * Provides the inclusive language test data.
	 *
	 * @return array The inclusive language data.
	 */
	public static function inclusive_language_provider() {
		return [
			'not available' => [
				'score'       => 0,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Not available" class="wpseo-score-icon na"><span class="wpseo-score-text screen-reader-text">Not available</span></div>',
			],
			'bad'           => [
				'score'       => 30,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Needs improvement" class="wpseo-score-icon bad"><span class="wpseo-score-text screen-reader-text">Needs improvement</span></div>',
			],
			'ok'            => [
				'score'       => 60,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Potentially non-inclusive" class="wpseo-score-icon ok"><span class="wpseo-score-text screen-reader-text">Potentially non-inclusive</span></div>',
			],
			'good'          => [
				'score'       => 90,
				'extra_class' => '',
				'expected'    => '<div aria-hidden="true" title="Good" class="wpseo-score-icon good"><span class="wpseo-score-text screen-reader-text">Good</span></div>',
			],
			'with_class'    => [
				'score'       => 60,
				'extra_class' => 'FOO',
				'expected'    => '<div aria-hidden="true" title="Potentially non-inclusive" class="wpseo-score-icon ok FOO"><span class="wpseo-score-text screen-reader-text">Potentially non-inclusive</span></div>',
			],
		];
	}

	/**
	 * Tests that the SEO icon is as expected.
	 *
	 * @dataProvider seo_provider
	 *
	 * @covers ::for_seo
	 *
	 * @param bool   $is_indexable   Whether we're dealing with an indexable.
	 * @param string $keyphrase      The keyphrase.
	 * @param int    $score          The score.
	 * @param string $extra_class    The extra class.
	 * @param string $no_index_title The title when noindex.
	 * @param string $expected       The expected present output.
	 *
	 * @return void
	 */
	public function test_for_seo( $is_indexable, $keyphrase, $score, $extra_class, $no_index_title, $expected ) {
		$indexable = $this->create_indexable_and_set_mocks_for_seo( $is_indexable, $keyphrase, $score );
		$actual    = $this->instance->for_seo( $indexable, $extra_class, $no_index_title );

		$this->assertInstanceOf( Score_Icon_Presenter::class, $actual );
		$this->assertSame( $expected, $actual->present() );
	}

	/**
	 * Provides the SEO test data.
	 *
	 * @return array The SEO data.
	 */
	public static function seo_provider() {
		return [
			'not available'      => [
				'is_indexable'   => true,
				'keyphrase'      => 'keyphrase',
				'score'          => 0,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="Not available" class="wpseo-score-icon na"><span class="wpseo-score-text screen-reader-text">Not available</span></div>',
			],
			'bad'                => [
				'is_indexable'   => true,
				'keyphrase'      => 'keyphrase',
				'score'          => 1,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="Needs improvement" class="wpseo-score-icon bad"><span class="wpseo-score-text screen-reader-text">Needs improvement</span></div>',
			],
			'ok'                 => [
				'is_indexable'   => true,
				'keyphrase'      => 'keyphrase',
				'score'          => 41,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="OK" class="wpseo-score-icon ok"><span class="wpseo-score-text screen-reader-text">OK</span></div>',
			],
			'good'               => [
				'is_indexable'   => true,
				'keyphrase'      => 'keyphrase',
				'score'          => 71,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="Good" class="wpseo-score-icon good"><span class="wpseo-score-text screen-reader-text">Good</span></div>',
			],
			'noindex'            => [
				'is_indexable'   => false,
				'keyphrase'      => 'keyphrase',
				'score'          => 50,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="No index" class="wpseo-score-icon noindex"><span class="wpseo-score-text screen-reader-text">No index</span></div>',
			],
			'noindex_with_title' => [
				'is_indexable'   => false,
				'keyphrase'      => 'keyphrase',
				'score'          => 50,
				'extra_class'    => '',
				'no_index_title' => 'FOO',
				'expected'       => '<div aria-hidden="true" title="FOO" class="wpseo-score-icon noindex"><span class="wpseo-score-text screen-reader-text">FOO</span></div>',
			],
			'without_keyphrase'  => [
				'is_indexable'   => true,
				'keyphrase'      => '',
				'score'          => 50,
				'extra_class'    => '',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="Focus keyphrase not set" class="wpseo-score-icon bad"><span class="wpseo-score-text screen-reader-text">Focus keyphrase not set</span></div>',
			],
			'with_class'         => [
				'is_indexable'   => true,
				'keyphrase'      => 'keyphrase',
				'score'          => 50,
				'extra_class'    => 'FOO',
				'no_index_title' => '',
				'expected'       => '<div aria-hidden="true" title="OK" class="wpseo-score-icon ok FOO"><span class="wpseo-score-text screen-reader-text">OK</span></div>',
			],
		];
	}

	/**
	 * Creates an indexable mock.
	 *
	 * @param bool   $is_indexable Whether we're dealing with an indexable.
	 * @param string $keyphrase    The keyphrase.
	 * @param int    $score        The score.
	 *
	 * @return Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable_Mock
	 */
	protected function create_indexable_and_set_mocks_for_seo( $is_indexable, $keyphrase, $score ) {
		$this->robots_helper->expects( 'is_indexable' )->andReturn( $is_indexable );

		$indexable                              = Mockery::mock( Indexable_Mock::class );
		$indexable->primary_focus_keyword       = $keyphrase;
		$indexable->primary_focus_keyword_score = $score;

		return $indexable;
	}
}
