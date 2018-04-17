<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Premium_Orphaned_Post_Query_Test extends WPSEO_UnitTestCase {

	/**
	 *  0: default: index         --> index
	 *  0: default: noindex       --> noindex
	 *  1: noindex, default index --> nonindex
	 *  2: index, default: noindex--> index
	 *  2: index, default: index  --> index
	 *
	 */

	/**
	 * @group test
	 *
	 * noindex, default index --> nonindex (3)
	 */
	public function test_post_noindex_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post_id ); // Noindex for the post.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default: index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		$this->assertNotContains( $post_id, $results );
	}

	/**
	 * @group test
	 *
	 * index, default: index  --> index (5)
	 */
	public function test_post_index_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post_id ); // Noindex for the post.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default: index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		$this->assertContains( $post_id, $results );
	}

	/**
	 * @group test
	 */
	public function test_post_index_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post_id ); // Noindex for the post.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default: index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		$this->assertContains( $post_id, $results );
	}


	/**
	 * @param int $post_id
	 */
	protected function update_link_count( $post_id ) {
		$storage = new WPSEO_Meta_Storage();
		$storage->update_incoming_link_count( array( $post_id ), new WPSEO_Link_Storage() );
	}
}
