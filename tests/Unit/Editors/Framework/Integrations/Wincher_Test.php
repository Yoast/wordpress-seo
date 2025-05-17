<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Mockery;
use Yoast\WP\SEO\Editors\Framework\Integrations\Wincher;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\Wincher
 */
final class Wincher_Test extends TestCase {

	/**
	 * Holds the classes surface.
	 *
	 * @var Classes_Surface|Mockery\MockInterface
	 */
	public $classes;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Holds the Wincher_Helper instance.
	 *
	 * @var Mockery\MockInterface|Wincher_Helper
	 */
	private $wincher_helper;

	/**
	 * The Wincher feature.
	 *
	 * @var Wincher
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->options        = Mockery::mock( Options_Helper::class );
		$this->wincher_helper = Mockery::mock( Wincher_Helper::class );
		$this->instance       = new Wincher( $this->wincher_helper, $this->options );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @return void
	 */
	public function test_is_enabled() {
		$this->wincher_helper
			->expects( 'is_active' )
			->andReturnTrue();

		$this->assertSame( true, $this->instance->is_enabled() );
	}

	/**
	 * Tests the to_legacy_array method.
	 *
	 * @return void
	 */
	public function test_to_legacy_array() {
		$this->wincher_helper
			->expects( 'is_active' )
			->twice()
			->andReturnTrue();
		$this->wincher_helper
			->expects( 'login_status' )
			->andReturnTrue();
		$this->options
			->expects( 'get' )
			->with( 'wincher_website_id', '' )
			->andReturn( 'some-id' );

		$this->options
			->expects( 'get' )
			->with( 'wincher_automatically_add_keyphrases', false )
			->andReturnTrue();

		$this->assertSame(
			[
				'wincherIntegrationActive' => true,
				'wincherLoginStatus'       => true,
				'wincherWebsiteId'         => 'some-id',
				'wincherAutoAddKeyphrases' => true,
			],
			$this->instance->to_legacy_array()
		);
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled ' => [
				'semrush_enabled' => true,
				'expected'        => true,
			],

			'Disabled' => [
				'semrush_enabled' => false,
				'expected'        => false,
			],
		];
	}
}
