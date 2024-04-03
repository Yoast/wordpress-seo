<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Brain\Monkey;
use Yoast\WP\SEO\Editors\Framework\Integrations\Jetpack_Markdown;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Jetpack_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\Jetpack_Markdown
 */
final class Jetpack_Markdown_Test extends TestCase {

	/**
	 * The Jetpack_Markdown feature.
	 *
	 * @var Jetpack_Markdown
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Jetpack_Markdown();
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @dataProvider data_provider_is_enabled
	 * @param bool $filter_return If the `wpseo_is_markdown_enabled` filter returns true.
	 * @param bool $expected      The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( bool $filter_return, bool $expected ) {
		Monkey\Functions\expect( 'apply_filters' )->with( 'wpseo_is_markdown_enabled' )
			->andReturn( $filter_return );
		$this->assertSame( $expected, $this->instance->is_enabled() );
		$this->assertSame( [ 'markdownEnabled' => $this->instance->is_enabled() ], $this->instance->to_legacy_array() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled'  => [
				'filter_return' => true,
				'expected'      => true,
			],
			'Disabled' => [
				'filter_return' => false,
				'expected'      => false,
			],
		];
	}
}
