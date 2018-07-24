<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Post_Indexable_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the creation of a new Post Indexable object.
	 *
	 * @covers WPSEO_Post_Indexable::from_object()
	 */
	public function test_from_object() {
		$post = $this
			->factory()
			->post
			->create_and_get(
				array(
					'title'     => 'test post',
					'post_type' => 'post',
				)
			);

		$instance = WPSEO_Post_Indexable::from_object( $post->ID );
		$this->assertInstanceOf( 'WPSEO_Post_Indexable', $instance );
	}

	/**
	 * Tests the creation of an invalid Post Indexable object.
	 *
	 * @covers WPSEO_Post_Indexable::from_object()
	 * @expectedException WPSEO_Invalid_Argument_Exception
	 */
	public function test_from_object_invalid_post() {
		$invalid_instance = WPSEO_Post_Indexable::from_object( -1 );
	}

	/**
	 * Tests the updating of an existing Post Indexable object.
	 *
	 * @covers WPSEO_Post_Indexable::update()
	 */
	public function test_update() {
		$post = $this
			->factory()
			->post
			->create_and_get(
				array(
					'title'     => 'test post',
					'post_type' => 'post',
				)
			);

		$instance = WPSEO_Post_Indexable::from_object( $post->ID );
		$new_instance = $instance->update(
			array( 'is_robots_noindex' => true )
		);

		$this->assertInstanceOf( 'WPSEO_Post_Indexable', $new_instance );

		$new_instance_array = $new_instance->to_array();

		$this->assertEquals( true, $new_instance_array['is_robots_noindex'] );
	}
}
