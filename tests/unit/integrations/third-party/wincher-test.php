<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\Wincher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Wincher
 *
 * @group integrations
 */
class Wincher_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Wincher|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * The Wincher helper instance.
	 *
	 * @var Wincher_Helper|Mockery\Mock
	 */
	protected $wincher;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->wincher  = Mockery::mock( Wincher_Helper::class );
		$this->instance = Mockery::mock( Wincher::class, [ $this->wincher ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

	}

	/**
	 * Tests if given dependencies are set as expected.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Wincher::class, $this->instance );
		$this->assertInstanceOf(
			Wincher_Helper::class,
			$this->getPropertyValue( $this->instance, 'wincher' )
		);
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
			],
			Wincher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_integration_toggles', [
			$this->instance,
			'add_integration_toggle',
		] ) );

		$this->assertNotFalse( Monkey\Actions\has( 'Yoast\WP\SEO\admin_integration_after', [
			$this->instance,
			'after_integration_toggle',
		] ) );
	}

	/**
	 * Tests the add_integration_toggle request function.
	 *
	 * @covers ::add_integration_toggle
	 */
	public function test_add_integration_toggle() {
		Monkey\Functions\stubTranslationFunctions();

		$this->wincher->expects( 'is_active' )->once()->andReturnTrue();

		$result = $this->instance->add_integration_toggle(
			[
				(object) [
					'name'    => 'Semrush integration',
					'setting' => 'semrush_integration_active',
					'label'   => 'The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.',
					'order'   => 10,
				],
				(object) [
					'name'            => 'Ryte integration',
					'setting'         => 'ryte_indexability',
					'label'           => 'Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case.',
					'read_more_label' => 'Read more about how Ryte works.',
					'read_more_url'   => 'https://yoa.st/2an',
					'order'           => 15,
				],
			]
		);
		$this->assertEquals(
			(object) [
				'name'     => 'Wincher integration',
				'setting'  => 'wincher_integration_active',
				'label'    => 'The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.',
				'order'    => 11,
				'disabled' => false,
			],
			$result[2]
		);
	}

	/**
	 * Tests the after_integration_toggle method.
	 *
	 * @covers ::after_integration_toggle
	 */
	public function test_after_integration_toggle() {
		$wincher_integration_toggle = (object) [
			'setting'  => 'wincher_integration_active',
			'disabled' => true,
		];

		$this->wincher->expects( 'is_active' )->once()->andReturn( 'Non_Multisite_Conditional' );
		$this->instance->expects( 'get_disabled_note' )->once();

		$this->instance->after_integration_toggle( $wincher_integration_toggle );
	}

	/**
	 * Tests the after_network_integration_toggle method.
	 *
	 * @covers ::after_network_integration_toggle
	 */
	public function test_after_network_integration_toggle() {

		$wincher_integration_toggle = (object) [
			'setting'  => 'wincher_integration_active',
			'disabled' => true,
		];

		$this->instance->expects( 'get_disabled_note' )->once();

		$this->instance->after_network_integration_toggle( $wincher_integration_toggle );
	}

	/**
	 * Tests the get_disabled_note method.
	 *
	 * @covers ::get_disabled_note
	 */
	public function test_get_disabled_note() {
		$this->assertContains( 'Currently, the Wincher integration is not available for multisites.', $this->instance->get_disabled_note() );
	}
}
