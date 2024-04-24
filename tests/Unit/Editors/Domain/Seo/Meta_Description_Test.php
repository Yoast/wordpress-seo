<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Domain\Seo;

use Yoast\WP\SEO\Editors\Domain\Seo\Meta_Description;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Keywords_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Domain\Seo\Meta_Description
 */
final class Meta_Description_Test extends TestCase {

	/**
	 * The Meta_Description.
	 *
	 * @var Meta_Description
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Meta_Description( '01-01-1970', 'a-template' );
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
				'meta_description_template' => 'a-template',
				'meta_description_date'     => '01-01-1970',
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
