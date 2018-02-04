<?php

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\YoastSEO\Yoast_Model;

class WpYoastPrimaryTerm extends Ruckusing_Migration_Base {
	public function up() {
		$table_name = $this->get_table_name();

		$indexable_table = $this->create_table( $table_name );

		$indexable_table->column( 'post_id', 'integer', array( 'unsigned' => true, 'null' => false, 'limit' => 11 ) );
		$indexable_table->column( 'term_id', 'integer', array( 'unsigned' => true, 'null' => false, 'limit' => 11 ) );
		$indexable_table->column( 'taxonomy', 'string', array( 'null' => false, 'limit' => 255 ) );

		// Exexcute the SQL to create the table.
		$indexable_table->finish();

		$this->add_index( $table_name, array(
			'post_id',
			'taxonomy',
		), array( 'name' => 'post_taxonomy' ) );

		$this->add_index( $table_name, array(
			'post_id',
			'term_id',
		), array( 'name' => 'post_term' ) );

		$this->add_timestamps( $table_name );
	}

	public function down() {
		$this->drop_table( $this->get_table_name() );
	}

	/**
	 * @return string
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Primary_Term' );
	}
}
