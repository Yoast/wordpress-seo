<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;


use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Editors\Framework\Content_Analysis;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;

/**
 * Class Content_Analysis_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Content_Analysis
 */
final class Content_Analysis_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Content_Analysis.
	 *
	 * @var Content_Analysis
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Content_Analysis( $this->options );
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::get_legacy_key
	 *
	 * @return void
	 */
	public function test_getters() {

		$this->assertSame( 'contentAnalysis', $this->instance->get_name() );
		$this->assertSame( 'contentAnalysisActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 * @covers ::is_user_enabled
	 * @covers ::is_globally_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param $content_analysis_active bool If the `content_analysis_active` option is enabled.
	 * @param $author_meta bool If the `wpseo_content_analysis_disable` option is disabled for the current user.
	 * @param $expected bool The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( $content_analysis_active, $author_meta, $expected ) {
		$this->options
			->expects( 'get' )
			->with( 'content_analysis_active', true )
			->andReturn( $content_analysis_active );

		Monkey\Functions\expect( 'get_current_user_id' )
			->andReturn( 1 );
		Monkey\Functions\expect( 'get_the_author_meta' )
			->with( 'wpseo_content_analysis_disable', 1 )
			->andReturn( $author_meta );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array
	 */
	public static function data_provider_is_enabled() {
		return [
			'Is globally enabled but not user enabled' => [
				'content_analysis_active' => true,
				'author_meta'             => false,
				'expected'                => true,
			],
			'Is user enabled but not globally enabled' => [
				'content_analysis_active' => false,
				'author_meta'             => false,
				'expected'                => false,
			],
			'Is disabled'                              => [
				'content_analysis_active' => false,
				'author_meta'             => false,
				'expected'                => false,
			],
		];
	}
}
