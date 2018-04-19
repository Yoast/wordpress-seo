<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the orphaned post query.
 */
class WPSEO_Premium_Orphaned_Post_Query_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests scenario where post is set to default and default is set to index.
	 */
	public function test_post_default_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post_id ); // Post set to default.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default set to index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		// Expect post to be in results, because it's set to default and default is set to index.
		$this->assertContains( $post_id, $results );
	}

	/**
	 * Tests scenario where post is set to default and default is set to noindex.
	 */
	public function test_post_default_post_type_noindex() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post_id );  // Post set to default
		WPSEO_Options::set( 'noindex-test_post_type', true );           // Default set to noindex.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		// Expect post to not be in results, because it's set to default and default is set to no-index.
		$this->assertNotContains( $post_id, $results );
	}

	/**
	 * Tests scenario where post is set to noindex and default is set to index.
	 */
	public function test_post_noindex_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post_id ); // Post set to noindex.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default set to index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		// Expect post to be not in the results, because it's set to noindex. The default setting which is set to index should be ignored.
		$this->assertNotContains( $post_id, $results );
	}


	/**
	 * Tests scenario where post is set to index and default is set to noindex.
	 */
	public function test_post_index_post_type_noindex() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post_id ); // Post set to index.
		WPSEO_Options::set( 'noindex-test_post_type', true ); // Default set to noindex.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		// Expect post to be in results, because it's set to index. The default setting which is set to no-index should be ignored.
		$this->assertContains( $post_id, $results );
	}

	/**
	 * Tests scenario where post is set to index and default is set to index.
	 */
	public function test_post_index_post_type_index() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'test_post_type',
			)
		);

		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post_id ); // Post set to index.
		WPSEO_Options::set( 'noindex-test_post_type', false ); // Default set to index.

		$this->update_link_count( $post_id );

		$results = WPSEO_Premium_Orphaned_Post_Query::get_orphaned_object_ids();

		// Expect post to be in results because it's set to index. Default is also set to index.
		$this->assertContains( $post_id, $results );
	}

	/**
	 * Updates the link count in storage, so changed values can be tested.
	 *
	 * @param int $post_id
	 */
	protected function update_link_count( $post_id ) {
		$storage = new WPSEO_Meta_Storage();
		$storage->update_incoming_link_count( array( $post_id ), new WPSEO_Link_Storage() );
	}
}
