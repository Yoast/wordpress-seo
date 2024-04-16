<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Framework\Custom_Meta;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Metadesc;

/**
 * Class Author_Metadesc_Test
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Metadesc
 */
final class Author_Metadesc_Test extends TestCase {

	/**
	 * The Author_Metadesc instance.
	 *
	 * @var Author_Metadesc
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->instance = new Author_Metadesc();
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::get_key
	 * @covers ::get_field_id
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'wpseo_metadesc', $this->instance->get_key() );
		$this->assertSame( 'wpseo_author_metadesc', $this->instance->get_field_id() );
	}

	/**
	 * Tests getting if empty is allowed.
	 *
	 * @covers ::is_empty_allowed
	 *
	 * @return void
	 */
	public function test_is_empty_allowed() {
		$this->assertSame( true, $this->instance->is_empty_allowed() );
	}
}
