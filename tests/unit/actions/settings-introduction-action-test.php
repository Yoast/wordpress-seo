<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions;

use Mockery;
use Yoast\WP\SEO\Actions\Settings_Introduction_Action;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Settings_Introduction_Action_Test class.
 *
 * @group actions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Settings_Introduction_Action
 */
class Settings_Introduction_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Settings_Introduction_Action
	 */
	protected $instance;

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Settings_Introduction_Action
	 */
	protected $mock_instance;

	/**
	 * Represents the User_Helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Settings_Introduction_Action( $this->user_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}

	/**
	 * Test retrieving the wistia embed permission: happy path.
	 *
	 * @covers ::get_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_get_wistia_embed_permission() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->assertTrue( $this->instance->get_wistia_embed_permission() );
	}

	/**
	 * Test setting the wistia embed permission: happy path.
	 *
	 * @covers ::set_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_set_wistia_embed_permission() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => false,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->with(
				1,
				'_yoast_settings_introduction',
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			)
			->andReturnTrue();

		$this->assertTrue( $this->instance->set_wistia_embed_permission( true ) );
	}

	/**
	 * Test setting the wistia embed permission: value is unchanged.
	 *
	 * @covers ::set_wistia_embed_permission
	 * @covers ::get_values_for_user
	 */
	public function test_set_wistia_embed_permission_unchanged() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->set_wistia_embed_permission( true ) );
	}

	/**
	 * Test retrieving show: happy path.
	 *
	 * @covers ::get_show
	 * @covers ::get_values_for_user
	 */
	public function test_get_show() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => false,
				]
			);

		$this->assertFalse( $this->instance->get_show() );
	}

	/**
	 * Test setting show: happy path.
	 *
	 * @covers ::set_show
	 * @covers ::get_values_for_user
	 */
	public function test_set_show() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->with(
				1,
				'_yoast_settings_introduction',
				[
					'wistia_embed_permission' => true,
					'show'                    => false,
				]
			)
			->andReturnTrue();

		$this->assertTrue( $this->instance->set_show( false ) );
	}

	/**
	 * Test setting show: value is unchanged.
	 *
	 * @covers ::set_show
	 * @covers ::get_values_for_user
	 */
	public function test_set_show_unchanged() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn(
				[
					'wistia_embed_permission' => true,
					'show'                    => true,
				]
			);

		$this->user_helper->expects( 'update_meta' )
			->never();

		$this->assertTrue( $this->instance->set_show( true ) );
	}

	/**
	 * Test retrieving the values with an invalid user ID.
	 *
	 * @covers ::get_values_for_user
	 */
	public function test_get_values_with_invalid_user_id() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( -1 );

		$this->user_helper->expects( 'get_meta' )
			->with( -1, '_yoast_settings_introduction', true )
			->andReturnFalse();

		$this->expectExceptionMessage( 'Invalid User ID' );

		$this->instance->get_show();
	}

	/**
	 * Test retrieving the values will use fallback values.
	 *
	 * @covers ::get_values_for_user
	 */
	public function test_get_values_fallback() {
		$this->user_helper->expects( 'get_current_user_id' )
			->withNoArgs()
			->andReturn( 1 );

		$this->user_helper->expects( 'get_meta' )
			->with( 1, '_yoast_settings_introduction', true )
			->andReturn( '' );

		$this->assertTrue( $this->instance->get_show() );
	}
}
