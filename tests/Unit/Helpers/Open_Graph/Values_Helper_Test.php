<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Open_Graph;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Open_Graph\Values_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Values_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Open_Graph\Values_Helper
 */
final class Values_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Values_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Values_Helper();
	}

	/**
	 * Tests the get_open_graph_title method.
	 *
	 * @covers ::get_open_graph_title
	 *
	 * @return void
	 */
	public function test_get_open_graph_title() {
		$title          = 'The SEO Title';
		$object_type    = 'post';
		$object_subtype = 'book';

		Monkey\Filters\expectApplied( 'Yoast\WP\SEO\open_graph_title_' . $object_type )
			->with( $title, $object_subtype );

		$this->instance->get_open_graph_title( $title, $object_type, $object_subtype );
	}

	/**
	 * Tests the get_open_graph_description method.
	 *
	 * @covers ::get_open_graph_description
	 *
	 * @return void
	 */
	public function test_get_open_graph_description() {
		$description    = 'The SEO Description';
		$object_type    = 'post';
		$object_subtype = 'book';

		Monkey\Filters\expectApplied( 'Yoast\WP\SEO\open_graph_description_' . $object_type )
			->with( $description, $object_subtype );

		$this->instance->get_open_graph_description( $description, $object_type, $object_subtype );
	}
}
