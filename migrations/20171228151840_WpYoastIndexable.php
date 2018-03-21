<?php

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\YoastSEO\Yoast_Model;

class WpYoastIndexable extends Ruckusing_Migration_Base {
	public function up() {
		$table_name = $this->get_table_name();

		$indexable_table = $this->create_table( $table_name );

		$indexable_table->column( 'object_id', 'integer', array( 'unsigned' => true, 'null' => true, 'limit' => 11 ) );
		$indexable_table->column( 'object_type', 'string', array( 'limit' => 16 ) );
		$indexable_table->column( 'object_sub_type', 'string', array( 'null' => true, 'limit' => 100 ) );

		$indexable_table->column( 'permalink', 'string', array( 'null' => true, 'limit' => 255 ) );
		$indexable_table->column( 'canonical', 'string', array( 'null' => true, 'limit' => 255 ) );

		$indexable_table->column( 'title', 'string', array( 'null' => true, 'limit' => 255 ) );
		$indexable_table->column( 'description', 'text', array( 'null' => true ) );
		$indexable_table->column( 'breadcrumb_title', 'string', array( 'null' => true, 'limit' => 255 ) );

		$indexable_table->column( 'og_title', 'string', array( 'null' => true, 'limit' => 255 ) );
		$indexable_table->column( 'og_description', 'text', array( 'null' => true ) );
		$indexable_table->column( 'og_image', 'string', array( 'null' => true, 'limit' => 255 ) );

		$indexable_table->column( 'twitter_title', 'string', array( 'null' => true, 'limit' => 255 ) );
		$indexable_table->column( 'twitter_description', 'text', array( 'null' => true ) );
		$indexable_table->column( 'twitter_image', 'string', array( 'null' => true, 'limit' => 255 ) );

		$indexable_table->column( 'is_robots_noindex', 'boolean', array( 'null' => true ) ); // @todo default: false
		$indexable_table->column( 'is_robots_nofollow', 'boolean', array( 'null' => true ) ); // @todo default: false
		$indexable_table->column( 'is_robots_noarchive', 'boolean', array( 'null' => true ) ); // @todo default: false
		$indexable_table->column( 'is_robots_noimageindex', 'boolean', array( 'null' => true ) ); // @todo default: false
		$indexable_table->column( 'is_robots_nosnippet', 'boolean', array( 'null' => true ) ); // @todo default: false

		$indexable_table->column( 'primary_focus_keyword', 'string', array( 'null' => true, 'limit' => 255 ) );
		$indexable_table->column( 'primary_focus_keyword_score', 'integer', array( 'null' => true, 'limit' => 3 ) );

		$indexable_table->column( 'readability_score', 'integer', array( 'null' => true, 'limit' => 3 ) );

		$indexable_table->column( 'is_cornerstone', 'boolean' ); // @todo default: false

		$indexable_table->column( 'link_count', 'integer', array( 'null' => true, 'limit' => 11 ) );
		$indexable_table->column( 'incoming_link_count', 'integer', array( 'null' => true, 'limit' => 11 ) );

		// Exexcute the SQL to create the table.
		$indexable_table->finish();

		$this->add_index( $table_name, array(
			'object_id',
			'object_type',
			'object_sub_type',
		), array( 'name' => 'object' ) );

		$this->add_index( $table_name, array(
			'content_score',
			'object_type',
			'object_sub_type',
		), array( 'name' => 'content_score' ) );

		$this->add_index( $table_name, array(
			'cornerstone',
			'object_type',
			'object_sub_type',
		), array( 'name' => 'cornerstone' ) );

		$this->add_index( $table_name, array(
			'incoming_link_count',
			'object_type',
			'object_sub_type',
		), array( 'name' => 'orphaned_content' ) );

		$this->add_index( $table_name, array(
			'include_in_sitemap',
			'object_id',
			'object_type',
			'object_sub_type',
		), array( 'name' => 'sitemap' ) );

		$this->add_timestamps( $table_name );
	}

	public function down() {
		$this->drop_table( $this->get_table_name() );
	}

	/**
	 * @return string
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
