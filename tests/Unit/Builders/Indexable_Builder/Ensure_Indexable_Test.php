<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Class Ensure_Indexable_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Ensure_Indexable_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->new_indexable              = new Indexable_Mock();
		$this->new_indexable->author_id   = 2000;
		$this->new_indexable->version     = 1;
		$this->new_indexable->object_type = 'post';
		$this->new_indexable->object_id   = 1338;

		$this->instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager,
			$this->link_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Test ensure_indexable.
	 *
	 * @covers ::ensure_indexable
	 *
	 * @return void
	 */
	public function test_ensure_indexable() {

		$result = $this->instance->exposed_ensure_indexable( $this->indexable );
		$this->assertEquals( $this->indexable, $result );
	}

	/**
	 * Test ensure_indexable.
	 *
	 * @covers ::ensure_indexable
	 *
	 * @return void
	 */
	public function test_ensure_indexable_new_indexable() {
		$defaults = [
			'object_type' => 'post',
			'object_id'   => 1338,
		];

		$this->expect_ensure_indexable( $defaults, $this->new_indexable );

		$result = $this->instance->exposed_ensure_indexable( false, $defaults );

		$this->assertEquals( $this->new_indexable, $result );
	}
}
