<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Seo;

use Yoast\WP\SEO\Editors\Domain\Seo\Title;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Seo\Title
 */
final class Title_Test extends TestCase {

	/**
	 * The Title.
	 *
	 * @var Title
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Title( 'a-title', 'a-fb-title' );
	}

	/**
	 * Tests the to_array method.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array(): void {
		$this->assertSame(
			[
				'title_template'             => 'a-title',
				'title_template_no_fallback' => 'a-fb-title',
			],
			$this->instance->to_array()
		);
	}

	/**
	 * Tests the to_legacy_method method.
	 *
	 * @covers ::to_legacy_array
	 *
	 * @return void
	 */
	public function test_to_legacy_array(): void {
		$this->assertSame(
			[
				'title_template'             => 'a-title',
				'title_template_no_fallback' => 'a-fb-title',
			],
			$this->instance->to_legacy_array()
		);
	}
}
