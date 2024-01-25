<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Domain;

use Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Outdated_Post_Indexables_List_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Domain\Outdated_Post_Indexables_List
 */
final class Outdated_Post_Indexables_List_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Outdated_Post_Indexables_List
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Outdated_Post_Indexables_List();
	}

	/**
	 * Tests the add_post_indexable function.
	 *
	 * @covers ::add_post_indexable
	 * @covers ::current
	 * @covers ::__construct
	 * @return void
	 */
	public function test_add_post_indexable() {
		$indexable = new Indexable_Double();
		$this->instance->add_post_indexable( $indexable );
		$this->assertSame( $this->instance->current(), $indexable );
	}

	/**
	 * Tests the array functions.
	 *
	 * @covers ::add_post_indexable
	 * @covers ::key
	 * @covers ::next
	 * @covers ::rewind
	 * @covers ::valid
	 * @covers ::count
	 * @return void
	 */
	public function test_array_functions() {
		$indexable = new Indexable_Double();
		$this->instance->add_post_indexable( $indexable );

		$this->assertSame( 0, $this->instance->key() );
		$this->instance->next();
		$this->assertSame( 1, $this->instance->key() );
		$this->assertFalse( $this->instance->valid() );
		$this->assertSame( 1, $this->instance->count() );
		$this->instance->rewind();
		$this->assertSame( 0, $this->instance->key() );
	}
}
