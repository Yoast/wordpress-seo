<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Seo;

use Yoast\WP\SEO\Editors\Domain\Seo\Description;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Description_Test.
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Seo\Description
 */
final class Description_Test extends TestCase {

	/**
	 * The Description.
	 *
	 * @var Description
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Description( '01-01-1970', 'a-template' );
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
				'description_template' => 'a-template',
				'description_date'     => '01-01-1970',
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
				'metadesc_template'   => 'a-template',
				'metaDescriptionDate' => '01-01-1970',
			],
			$this->instance->to_legacy_array()
		);
	}
}
