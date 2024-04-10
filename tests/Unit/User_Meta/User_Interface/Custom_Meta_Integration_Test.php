<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional;
use Yoast\WP\SEO\Conditionals\User_Edit_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Repository;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Metadesc;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Noindex_Author;
use Yoast\WP\SEO\User_Meta\User_Interface\Custom_Meta_Integration;

/**
 * Tests the custom meta integration.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\User_Interface\Custom_Meta_Integration
 */
final class Custom_Meta_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Custom_Meta_Integration
	 */
	private $instance;

	/**
	 * Holds the custom meta repository.
	 *
	 * @var Mockery\MockInterface|Custom_Meta_Repository
	 */
	private $custom_meta_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->custom_meta_repository = Mockery::mock( Custom_Meta_Repository::class );

		$this->instance = new Custom_Meta_Integration(
			$this->custom_meta_repository
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
		$expected_result = [
			Admin_Conditional::class,
			User_Can_Edit_Users_Conditional::class,
			User_Edit_Conditional::class,
		];

		$this->assertEquals( $expected_result, Custom_Meta_Integration::get_conditionals() );
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
			Custom_Meta_Repository::class,
			$this->getPropertyValue( $this->instance, 'custom_meta_repository' )
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
		Monkey\Actions\expectAdded( 'personal_options_update' )
			->once()
			->with( [ $this->instance, 'process_user_option_update' ] );

		Monkey\Actions\expectAdded( 'edit_user_profile_update' )
			->once()
			->with( [ $this->instance, 'process_user_option_update' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests processing user option updates.
	 *
	 * @dataProvider provider_process_user_option_update
	 * @covers ::process_user_option_update
	 *
	 * @param array<Custom_Meta_Interface> $custom_meta              The custom meta.
	 * @param string|null                  $metadesc_value           The value for the metadesc.
	 * @param string|null                  $noindex_value            The value for the noindex.
	 * @param int                          $times_update_custom_meta Times that we update the custom meta.
	 * @param int                          $times_delete_custom_meta Times that we delete the custom meta.
	 *
	 * @return void
	 */
	public function test_process_user_option_update( $custom_meta, $metadesc_value, $noindex_value, $times_update_custom_meta, $times_delete_custom_meta ) {

		Monkey\Functions\expect( 'update_user_meta' )
			->once();

		Monkey\Functions\expect( 'check_admin_referer' )
			->once()
			->andReturn( true );

		$this->custom_meta_repository
			->expects( 'get_custom_meta' )
			->once()
			->andReturn( $custom_meta );

		$_POST['wpseo_author_metadesc'] = $metadesc_value;
		$_POST['wpseo_noindex_author']  = $noindex_value;

		Monkey\Functions\expect( 'update_user_meta' )
			->times( $times_update_custom_meta );

		Monkey\Functions\expect( 'delete_user_meta' )
			->times( $times_delete_custom_meta );

		$this->instance->process_user_option_update( 1 );
	}

	/**
	 * Dataprovider for test_process_user_option_update.
	 *
	 * @return array<string, array<string, string>> Data for test_process_user_option_update.
	 */
	public static function provider_process_user_option_update() {
		yield 'User gives non-empty values for all custom meta' => [
			'custom_meta'              => [
				new Author_Metadesc(),
				new Noindex_Author(),
			],
			'metadesc_value'           => 'no',
			'noindex_value'            => 'no',
			'times_update_custom_meta' => 2,
			'times_delete_custom_meta' => 0,
		];

		yield 'User gives non-empty values for all custom meta that need value but empty value for meta that can be empty' => [
			'custom_meta'              => [
				new Author_Metadesc(),
				new Noindex_Author(),
			],
			'metadesc_value'           => '',
			'noindex_value'            => 'no',
			'times_update_custom_meta' => 2,
			'times_delete_custom_meta' => 0,
		];

		yield 'User gives empty values for all custom meta' => [
			'custom_meta'              => [
				new Author_Metadesc(),
				new Noindex_Author(),
			],
			'metadesc_value'           => '',
			'noindex_value'            => '',
			'times_update_custom_meta' => 1,
			'times_delete_custom_meta' => 1,
		];
	}
}
