<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application;

use Brain\Monkey;
use Generator;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Cron_Verification_Gate_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate
 */
final class Cron_Verification_Gate_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Cron_Verification_Gate
	 */
	private $instance;

	/**
	 * The indexable helper.
	 *
	 * @var MockInterface|Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Cron_Verification_Gate( $this->indexable_helper );
	}

	/**
	 * Tests if the should verify on cron function gives the expected response.
	 *
	 * @param bool   $expected     The expected result.
	 * @param string $should_index What the helper should return.
	 * @param string $filter_value What the filter should return.
	 *
	 * @covers ::should_verify_on_cron
	 * @covers ::__construct
	 * @dataProvider should_verify_on_cron_dataprovider
	 * @return void
	 */
	public function test_should_verify_on_cron( $expected, $should_index, $filter_value ) {
		$this->indexable_helper->expects()->should_index_indexables()->andReturn( $should_index );
		Monkey\Functions\expect( 'apply_filters' )->andReturn( $filter_value );

		$this->assertSame( $expected, $this->instance->should_verify_on_cron() );
	}

	/**
	 * Data provider for the `test_should_verify_on_cron` test.
	 *
	 * @return Generator
	 */
	public function should_verify_on_cron_dataprovider() {
		yield [
			'expected'     => false,
			'should_index' => false,
			'filter_value' => false,
		];

		yield [
			'expected'     => false,
			'should_index' => true,
			'filter_value' => false,
		];

		yield [
			'expected'     => true,
			'should_index' => true,
			'filter_value' => true,
		];
	}
}
