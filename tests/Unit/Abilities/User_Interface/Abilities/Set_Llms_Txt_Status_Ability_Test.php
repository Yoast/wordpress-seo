<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey\Functions;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Llms_Txt_Status_Ability;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Set_Llms_Txt_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Llms_Txt_Status_Ability
 */
final class Set_Llms_Txt_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The non-multisite conditional mock.
	 *
	 * @var Mockery\MockInterface|Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Set_Llms_Txt_Status_Ability
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->capability_helper         = Mockery::mock( Capability_Helper::class );
		$this->feature_status_updater    = Mockery::mock( Feature_Status_Updater::class );
		$this->non_multisite_conditional = Mockery::mock( Non_Multisite_Conditional::class );

		$this->instance = new Set_Llms_Txt_Status_Ability(
			$this->capability_helper,
			$this->feature_status_updater,
			$this->non_multisite_conditional,
		);
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_slug
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/set-llms-txt-status', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available follows the non-multisite conditional.
	 *
	 * @covers ::__construct
	 * @covers ::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $is_met Whether the site is not a multisite.
	 *
	 * @return void
	 */
	public function test_is_available( bool $is_met ) {
		$this->non_multisite_conditional->expects( 'is_met' )->once()->andReturn( $is_met );

		$this->assertSame( $is_met, $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute delegates to the updater with the llms.txt option and adds the URL, which is only given when the feature is enabled.
	 *
	 * @covers ::get_option_name
	 * @covers ::get_url
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::execute
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Url_Feature_Status_Ability::execute
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $enabled The requested status.
	 *
	 * @return void
	 */
	public function test_execute( bool $enabled ) {
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => $enabled ] )
			->andReturn( [ 'enabled' => $enabled ] );

		Functions\expect( 'home_url' )
			->times( ( $enabled === true ) ? 1 : 0 )
			->with( 'llms.txt' )
			->andReturn( 'https://example.com/llms.txt' );

		$this->assertSame(
			[
				'enabled' => $enabled,
				'url'     => ( ( $enabled === true ) ? 'https://example.com/llms.txt' : null ),
			],
			$this->instance->execute( [ 'enabled' => $enabled ] ),
		);
	}

	/**
	 * Tests that execute returns the updater's error untouched, without building the URL.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Url_Feature_Status_Ability::execute
	 *
	 * @return void
	 */
	public function test_execute_error() {
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => true ] )
			->andReturn( Mockery::mock( WP_Error::class ) );

		Functions\expect( 'home_url' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::get_feature_name
	 * @covers ::get_label
	 * @covers ::get_description
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Url_Feature_Status_Ability::get_additional_output_properties
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->assertSame(
			[
				'label'               => 'Set llms.txt Status',
				'description'         => 'Enable or disable Yoast SEO\'s llms.txt feature. Enabling it generates an llms.txt file for the site and keeps it up to date; disabling it removes the file.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'enabled' ],
					'properties'           => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s llms.txt feature should be enabled. true enables it; false disables it.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s llms.txt feature is enabled.',
						],
						'url'     => [
							'type'        => [ 'string', 'null' ],
							'format'      => 'uri',
							'description' => 'The URL at which Yoast SEO\'s llms.txt is served. null when the feature is disabled.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_manage_seo' ],
				'execute_callback'    => [ $this->instance, 'execute' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => false,
						'destructive' => null,
						'idempotent'  => true,
					],
					'mcp'          => [
						'public' => true,
					],
				],
			],
			$this->instance->get_args(),
		);
	}
}
