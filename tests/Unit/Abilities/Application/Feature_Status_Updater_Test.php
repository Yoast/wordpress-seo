<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Feature_Status_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater
 */
final class Feature_Status_Updater_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Feature_Status_Updater
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );
		$this->stubTranslationFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Feature_Status_Updater( $this->options_helper );
	}

	/**
	 * Data provider for the option name and status combinations.
	 *
	 * @return array<string, array<string|bool>> The combinations.
	 */
	public static function provide_options_and_statuses(): array {
		return [
			'llms.txt enabled'      => [ 'enable_llms_txt', true ],
			'llms.txt disabled'     => [ 'enable_llms_txt', false ],
			'XML sitemap enabled'   => [ 'enable_xml_sitemap', true ],
			'XML sitemap disabled'  => [ 'enable_xml_sitemap', false ],
		];
	}

	/**
	 * Tests that set_status writes the requested status to the given option and returns it.
	 *
	 * @covers ::__construct
	 * @covers ::set_status
	 *
	 * @dataProvider provide_options_and_statuses
	 *
	 * @param string $option_name The option name.
	 * @param bool   $enabled     The requested status.
	 *
	 * @return void
	 */
	public function test_set_status( string $option_name, bool $enabled ) {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( $option_name, $enabled )
			->andReturn( true );

		$this->assertSame( [ 'enabled' => $enabled ], $this->instance->set_status( $option_name, [ 'enabled' => $enabled ] ) );
	}

	/**
	 * Data provider for the invalid inputs.
	 *
	 * @return array<string, array<array<string, mixed>>> The invalid inputs.
	 */
	public static function provide_invalid_inputs(): array {
		return [
			'missing' => [ [] ],
			'null'    => [ [ 'enabled' => null ] ],
			'string'  => [ [ 'enabled' => 'true' ] ],
			'integer' => [ [ 'enabled' => 1 ] ],
		];
	}

	/**
	 * Tests that set_status returns an error, without touching the option, when the enabled status is missing or not a boolean.
	 *
	 * @covers ::set_status
	 *
	 * @dataProvider provide_invalid_inputs
	 *
	 * @param array<string, mixed> $input The invalid input.
	 *
	 * @return void
	 */
	public function test_set_status_invalid_input( array $input ) {
		$this->options_helper->expects( 'set' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->set_status( 'enable_llms_txt', $input ) );
	}

	/**
	 * Tests that set_status returns an error when the option could not be saved.
	 *
	 * @covers ::set_status
	 *
	 * @return void
	 */
	public function test_set_status_not_saved() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'enable_llms_txt', true )
			->andReturn( false );

		$this->assertInstanceOf( WP_Error::class, $this->instance->set_status( 'enable_llms_txt', [ 'enabled' => true ] ) );
	}
}
