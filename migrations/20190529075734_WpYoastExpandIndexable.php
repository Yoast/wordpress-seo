<?php

use YoastSEO_Vendor\Ruckusing_Migration_Base;
use Yoast\WP\Free\Yoast_Model;

class WpYoastExpandIndexable extends Ruckusing_Migration_Base
{
	public function up() {
		$table_name = $this->get_table_name();

		$this->add_column( $table_name, 'og_title', 'string', array( 'null' => true, 'limit' => 191 ) );
		$this->add_column( $table_name, 'og_image', 'mediumtext', array( 'null' => true ) );
		$this->add_column( $table_name, 'og_description', 'mediumtext', array( 'null' => true ) );
		$this->add_column( $table_name, 'twitter_title', 'string', array( 'null' => true, 'limit' => 191 ) );
		$this->add_column( $table_name, 'twitter_image', 'mediumtext', array( 'null' => true ) );
		$this->add_column( $table_name, 'twitter_description', 'mediumtext', array( 'null' => true ) );

		$this->add_column( $table_name, 'permalink_hash', 'string', array( 'null' => true, 'limit' => 191 ) );
		$this->add_index( $table_name, 'permalink_hash' );

		$this->change_column( $table_name, 'permalink', 'mediumtext', array( 'null' => true ) );
		$this->change_column( $table_name, 'canonical', 'mediumtext', array( 'null' => true ) );
	}

	public function down() {
		$table_name = $this->get_table_name();

		$this->remove_column( $table_name, 'og_title' );
		$this->remove_column( $table_name, 'og_image' );
		$this->remove_column( $table_name, 'og_description' );
		$this->remove_column( $table_name, 'twitter_title' );
		$this->remove_column( $table_name, 'twitter_image' );
		$this->remove_column( $table_name, 'twitter_description' );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
