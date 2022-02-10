<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Sitemaps;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Sitemaps\Sitemap_State;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Sitemap_State_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Sitemaps\Sitemap_State
 * @covers \Yoast\WP\SEO\Services\Sitemaps\Sitemap_State
 *
 * @group  sitemaps
 */
class Sitemap_State_Test extends TestCase {
	/**
	 * A mocked Indexing_Helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * A mocked Options_Helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The SUT.
	 *
	 * @var Sitemap_State
	 */
	protected $instance;

	protected function set_up() {
		parent::set_up();
		$this->options_helper  = Mockery::mock( Options_Helper::class );
		$this->indexing_helper = Mockery::mock( Indexing_Helper::class );
		$this->instance        = new Sitemap_State(
			$this->options_helper,
			$this->indexing_helper
		);
	}

	/**
	 * Tests the is_enabled function to wrap the option value.
	 *
	 * @covers ::is_presentable
	 */
	public function test_is_enabled() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap' )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_enabled() );
	}


	/**
	 * @param bool $enabled    Whether the sitemaps are enabled.
	 * @param bool $up_to_date Whether the indexables are up to date.
	 * @param bool $expected   The expected result of the is_presentable funciton.
	 *
	 * @covers ::is_presentable
	 * @covers ::is_enabled
	 *
	 * @dataProvider  is_presentable_data_provider
	 */
	public function test_is_presentable( $enabled, $up_to_date, $expected ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_xml_sitemap' )
			->andReturn( $enabled );

		if ( $enabled ) {
			$this->indexing_helper
				->expects( 'is_index_up_to_date' )
				->once()
				->with( '2-2-3-3-3-3-3-2' )
				->andReturn( $up_to_date );
		}

		$this->assertSame( $expected, $this->instance->is_presentable() );
	}

	public function is_presentable_data_provider() {
		return [
			[ true, true, true ],
			[ true, false, false ],
			[ false, true, false ],
			[ false, false, false ],
		];
	}
}
