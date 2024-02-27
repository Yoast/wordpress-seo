<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Analysis_Features;

use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Analysis_Feature_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature
 */
final class Analysis_Feature_Test extends TestCase {

	/**
	 * The Analysis_Feature.
	 *
	 * @var Analysis_Feature
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Analysis_Feature( true, 'name', 'legacy-name' );
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::__construct
	 * @covers ::is_enabled
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters(): void {
		$this->assertTrue( $this->instance->is_enabled() );
		$this->assertSame( 'name', $this->instance->get_name() );
	}

	/**
	 * Tests the to_array method.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array(): void {
		$this->assertSame( [ 'name' => true ], $this->instance->to_array() );
	}

	/**
	 * Tests the to_legacy_method method.
	 *
	 * @covers ::to_legacy_array
	 *
	 * @return void
	 */
	public function test_to_legacy_array(): void {
		$this->assertSame( [ 'legacy-name' => true ], $this->instance->to_legacy_array() );
	}
}
