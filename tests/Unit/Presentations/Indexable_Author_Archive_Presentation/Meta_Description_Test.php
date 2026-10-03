<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Description_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
 *
 * @group presentations
 * @group meta-description
 */
final class Meta_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether the meta description is returned when it is set.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_meta_description() {
		$this->indexable->description = 'Meta description example';

		$this->assertEquals( 'Meta description example', $this->instance->generate_meta_description() );
	}

	/**
	 * Tests whether the options meta description is returned when there is no indexable meta description.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_meta_description_without_indexable() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'metadesc-author-wpseo' )
			->andReturn( 'Options meta description example' );

		$this->assertEquals( 'Options meta description example', $this->instance->generate_meta_description() );
	}

	/**
	 * Tests whether the default meta description (an empty string)) is returned when there is no options meta description.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_meta_description_without_options_meta_description() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'metadesc-author-wpseo' )
			->andReturn( '' );

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'metadesc-author-wpseo' )
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_meta_description() );
	}
}
