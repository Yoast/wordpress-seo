<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Framework\Additional_Contactmethods;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Wikipedia;

/**
 * Class Wikipedia_Test
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Framework\Additional_Contactmethods\Wikipedia
 */
final class Wikipedia_Test extends TestCase {

	/**
	 * The Wikipedia instance.
	 *
	 * @var Wikipedia
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Wikipedia();
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::get_key
	 * @covers ::get_label
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->stubTranslationFunctions();

		$this->assertSame( 'wikipedia', $this->instance->get_key() );
		$this->assertSame( 'Wikipedia page about you<br/><small>(if one exists)</small>', $this->instance->get_label() );
	}
}
