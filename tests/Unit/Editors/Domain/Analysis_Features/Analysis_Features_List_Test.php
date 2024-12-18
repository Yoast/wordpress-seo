<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Analysis_Features;

use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Analysis_Features_List_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List
 */
final class Analysis_Features_List_Test extends TestCase {

	/**
	 * The Analysis_Features_List.
	 *
	 * @var Analysis_Features_List
	 */
	private $instance;

	/**
	 * Tests the getters.
	 *
	 * @covers ::add_feature
	 * @covers ::parse_to_legacy_array
	 *
	 * @return void
	 */
	public function test_parse_to_legacy_array(): void {
		$this->instance->add_feature( new Analysis_Feature( false, 'name', 'legacy-key-false' ) );
		$this->instance->add_feature( new Analysis_Feature( true, 'name', 'legacy-key-true' ) );
		$this->assertSame(
			[
				'legacy-key-false' => false,
				'legacy-key-true'  => true,
			],
			$this->instance->parse_to_legacy_array()
		);
	}

	/**
	 * Tests the to array.
	 *
	 * @covers ::add_feature
	 * @covers ::parse_to_array
	 *
	 * @return void
	 */
	public function test_parse_to_array(): void {
		$this->instance->add_feature( new Analysis_Feature( false, 'name-false', 'legacy-key-false' ) );
		$this->instance->add_feature( new Analysis_Feature( true, 'name-true', 'legacy-key-true' ) );
		$this->assertSame(
			[
				'name-false' => false,
				'name-true'  => true,
			],
			$this->instance->to_array()
		);
	}

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Analysis_Features_List();
	}
}
