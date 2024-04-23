<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Application;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Collector;
use Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Facebook;
use Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Youtube;

/**
 * Tests the additional contactmethods collector.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Collector
 */
final class Additional_Contactmethods_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Additional_Contactmethods_Collector
	 */
	private $instance;

	/**
	 * Holds mocked Facebook class.
	 *
	 * @var Mockery\MockInterface|Facebook
	 */
	private $facebook;

	/**
	 * Holds mocked YouTube class.
	 *
	 * @var Mockery\MockInterface|Youtube
	 */
	private $youtube;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->facebook = Mockery::mock( Facebook::class );
		$this->youtube  = Mockery::mock( Youtube::class );

		$this->instance = new Additional_Contactmethods_Collector(
			$this->facebook,
			$this->youtube
		);
	}

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsArray( $this->getPropertyValue( $this->instance, 'additional_contactmethods' ) );
	}

	/**
	 * Tests get_additional_contactmethods.
	 *
	 * @covers ::get_additional_contactmethods
	 *
	 * @return void
	 */
	public function test_get_additional_contactmethods() {
		$expected_result = [
			$this->facebook,
			$this->youtube,
		];

		Monkey\Filters\expectApplied( 'wpseo_additional_contactmethods' )
			->with( $expected_result )
			->once()
			->andReturn( $expected_result );

		$this->assertSame( $expected_result, $this->instance->get_additional_contactmethods() );
	}

	/**
	 * Tests get_additional_contactmethods_objects.
	 *
	 * @covers ::get_additional_contactmethods_objects
	 *
	 * @return void
	 */
	public function test_get_additional_contactmethods_objects() {
		$expected_result = [
			$this->facebook,
			$this->youtube,
		];

		Monkey\Filters\expectApplied( 'wpseo_additional_contactmethods' )
			->with( $expected_result )
			->once()
			->andReturn( $expected_result );

		$this->facebook
			->expects( 'get_key' )
			->once()
			->andReturn( 'facebook' );

		$this->facebook
			->expects( 'get_label' )
			->once()
			->andReturn( 'Facebook URL' );

		$this->youtube
			->expects( 'get_key' )
			->once()
			->andReturn( 'youtube' );

		$this->youtube
			->expects( 'get_label' )
			->once()
			->andReturn( 'Youtube URL' );

		$expected_result = [
			'facebook' => 'Facebook URL',
			'youtube'  => 'Youtube URL',
		];
		$this->assertSame( $expected_result, $this->instance->get_additional_contactmethods_objects() );
	}

	/**
	 * Tests get_additional_contactmethods_keys.
	 *
	 * @covers ::get_additional_contactmethods_keys
	 *
	 * @return void
	 */
	public function test_get_additional_contactmethods_keys() {
		$expected_result = [
			$this->facebook,
			$this->youtube,
		];

		Monkey\Filters\expectApplied( 'wpseo_additional_contactmethods' )
			->with( $expected_result )
			->once()
			->andReturn( $expected_result );

		$this->facebook
			->expects( 'get_key' )
			->once()
			->andReturn( 'facebook' );

		$this->youtube
			->expects( 'get_key' )
			->once()
			->andReturn( 'youtube' );

		$expected_result = [
			'facebook',
			'youtube',
		];
		$this->assertSame( $expected_result, $this->instance->get_additional_contactmethods_keys() );
	}
}
