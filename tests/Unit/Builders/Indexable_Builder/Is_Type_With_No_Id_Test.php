<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;

/**
 * Class Is_Type_With_No_Id_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Is_Type_With_No_Id_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

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
	 * Provider for testing save_indexable method.
	 *
	 * @return array The test data.
	 */
	public static function is_type_with_no_id_provider() {
		return [
			'Home page type' => [
				'type'     => 'home-page',
				'expected' => true,
			],
			'System page type' => [
				'type'     => 'system-page',
				'expected' => true,
			],
			'Post type archive' => [
				'type'     => 'post-type-archive',
				'expected' => true,
			],
			'Date archive type' => [
				'type'     => 'date-archive',
				'expected' => true,
			],
			'Type that is not in list' => [
				'type'     => 'not in list',
				'expected' => false,
			],
		];
	}

	/**
	 * Test is_type_with_no_id.
	 *
	 * @covers ::is_type_with_no_id
	 *
	 * @dataProvider is_type_with_no_id_provider
	 *
	 * @param string $type     The type to test.
	 * @param bool   $expected The expected result.
	 * @return void
	 */
	public function test_is_type_with_no_id( $type, $expected ) {
		$this->assertEquals( $expected, $this->instance->exposed_is_type_with_no_id( $type ) );
	}
}
