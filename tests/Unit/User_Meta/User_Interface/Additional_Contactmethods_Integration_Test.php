<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Collector;
use Yoast\WP\SEO\User_Meta\User_Interface\Additional_Contactmethods_Integration;

/**
 * Tests the additional contactmethods integration.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\User_Interface\Additional_Contactmethods_Integration
 */
final class Additional_Contactmethods_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Additional_Contactmethods_Integration
	 */
	private $instance;

	/**
	 * Holds the additional contactmethods collector.
	 *
	 * @var Mockery\MockInterface|Additional_Contactmethods_Collector
	 */
	private $additional_contactmethods_collector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->additional_contactmethods_collector = Mockery::mock( Additional_Contactmethods_Collector::class );

		$this->instance = new Additional_Contactmethods_Integration(
			$this->additional_contactmethods_collector
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Additional_Contactmethods_Integration::get_conditionals() );
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
			Additional_Contactmethods_Collector::class,
			$this->getPropertyValue( $this->instance, 'additional_contactmethods_collector' )
		);
	}

	/**
	 * Tests registering hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'user_contactmethods' )
			->once()
			->with( [ $this->instance, 'update_contactmethods' ] );

		Monkey\Filters\expectAdded( 'update_user_metadata' )
			->once()
			->with( [ $this->instance, 'stop_storing_empty_metadata' ], 10, 4 );

		$this->instance->register_hooks();
	}

	/**
	 * Tests updating contactmethods.
	 *
	 * @dataProvider provider_update_contactmethods
	 * @covers ::update_contactmethods
	 *
	 * @param array<string, string> $additional_contactmethods The additional contactmethods.
	 * @param array<string, string> $existing_contactmethods   The existing contactmethods.
	 * @param array<string, string> $expected_contactmethods   The expected final contactmethods.
	 *
	 * @return void
	 */
	public function test_update_contactmethods( $additional_contactmethods, $existing_contactmethods, $expected_contactmethods ) {
		$this->additional_contactmethods_collector
			->expects( 'get_additional_contactmethods_objects' )
			->once()
			->andReturn( $additional_contactmethods );

		$result = $this->instance->update_contactmethods( $existing_contactmethods );
		$this->assertSame( $expected_contactmethods, $result );
	}

	/**
	 * Tests stopping storing empty contactmethods.
	 *
	 * @dataProvider provider_stop_storing_empty_metadata
	 * @covers ::stop_storing_empty_metadata
	 *
	 * @param array<string> $additional_contactmethods The additional contactmethods.
	 * @param string        $meta_to_be_saved          The key of the meta that's being saved.
	 * @param string        $value_to_be_saved         The value of the meta that's being saved.
	 * @param bool          $check                     The $check value that's coming from the filter.
	 * @param int           $delete_times              The times user meta is deleted.
	 * @param bool          $expected_result           The expected result.
	 *
	 * @return void
	 */
	public function test_stop_storing_empty_metadata( $additional_contactmethods, $meta_to_be_saved, $value_to_be_saved, $check, $delete_times, $expected_result ) {
		$this->additional_contactmethods_collector
			->expects( 'get_additional_contactmethods_keys' )
			->once()
			->andReturn( $additional_contactmethods );

		Monkey\Functions\expect( 'delete_user_meta' )
			->with( 1, $meta_to_be_saved )
			->times( $delete_times )
			->andReturn( true );

		$result = $this->instance->stop_storing_empty_metadata( $check, 1, $meta_to_be_saved, $value_to_be_saved );
		$this->assertSame( $expected_result, $result );
	}

	/**
	 * Dataprovider for test_stop_storing_empty_metadata.
	 *
	 * @return array<string, array<string, string>> Data for test_stop_storing_empty_metadata.
	 */
	public static function provider_stop_storing_empty_metadata() {
		yield 'Save a non empty meta for a meta that is not supposed to be empty' => [
			'additional_contactmethods' => [
				'facebook',
				'twitter',
				'instagram',
				'linkedin',
			],
			'meta_to_be_saved'          => 'facebook',
			'value_to_be_saved'         => 'https://facebook/test',
			'check'                     => true,
			'delete_times'              => 0,
			'expected_result'           => true,
		];

		yield 'Save an empty meta for a meta that is not supposed to be empty' => [
			'additional_contactmethods' => [
				'facebook',
				'twitter',
				'instagram',
				'linkedin',
			],
			'meta_to_be_saved'          => 'facebook',
			'value_to_be_saved'         => '',
			'check'                     => true,
			'delete_times'              => 1,
			'expected_result'           => false,
		];

		yield 'Save an empty meta for a meta that is not supposed to be non-empty' => [
			'additional_contactmethods' => [
				'facebook',
				'twitter',
				'instagram',
				'linkedin',
			],
			'meta_to_be_saved'          => 'wikipedia',
			'value_to_be_saved'         => '',
			'check'                     => true,
			'delete_times'              => 0,
			'expected_result'           => true,
		];
	}

	/**
	 * Dataprovider for test_update_contactmethods.
	 *
	 * @return array<string, array<string, string>> Data for test_update_contactmethods.
	 */
	public static function provider_update_contactmethods() {
		yield 'Add no additional contacmethods to existing ones' => [
			'additional_contactmethods' => [],
			'existing_contactmethods'   => [
				'facebook'   => 'Give Facebook',
				'x'          => 'Give X',
				'instragram' => 'Give Instagram',
			],
			'expected_contactmethods'   => [
				'facebook'   => 'Give Facebook',
				'x'          => 'Give X',
				'instragram' => 'Give Instagram',
			],
		];

		yield 'Add additional contacmethods to existing ones' => [
			'additional_contactmethods' => [
				'tumblr'    => 'Give Tumblr',
				'wikipedia' => 'Give Wikipedia',
				'youtube'   => 'Give Youtube',
			],
			'existing_contactmethods'   => [
				'facebook'   => 'Give Facebook',
				'x'          => 'Give X',
				'instragram' => 'Give Instagram',
			],
			'expected_contactmethods'   => [
				'facebook'   => 'Give Facebook',
				'x'          => 'Give X',
				'instragram' => 'Give Instagram',
				'tumblr'     => 'Give Tumblr',
				'wikipedia'  => 'Give Wikipedia',
				'youtube'    => 'Give Youtube',
			],
		];

		yield 'Add additional contacmethods to no existing ones' => [
			'additional_contactmethods' => [
				'tumblr'    => 'Give Tumblr',
				'wikipedia' => 'Give Wikipedia',
				'youtube'   => 'Give Youtube',
			],
			'existing_contactmethods'   => [],
			'expected_contactmethods'   => [
				'tumblr'    => 'Give Tumblr',
				'wikipedia' => 'Give Wikipedia',
				'youtube'   => 'Give Youtube',
			],
		];
	}
}
