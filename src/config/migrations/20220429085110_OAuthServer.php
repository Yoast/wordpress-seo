<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\WP\SEO\Config\Migrations
 */

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * Oauth class.
 */
class OAuthServer extends Migration {

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {
		$this->add_table_access_tokens();
		$this->add_table_refresh_tokens();
		$this->add_table_auth_code();
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$this->drop_tables();
	}

	private function add_table_access_tokens() {
		$table_name         = Model::get_table_name( 'Access_Token' );
		$access_token_table = $this->create_table( $table_name, [ 'id' => false ] );

		$access_token_table->column(
			'identifier',
			'string',
			[
				'primary_key' => true,
			]
		);
		$access_token_table->column( 'expiry_date_time', 'datetime' );
		$access_token_table->column(
			'user_identifier',
			'string',
			[
				'null' => true,
			]
		);
		$access_token_table->column( 'scopes', 'string' );
		$access_token_table->column( 'client_identifier', 'string' );
		$access_token_table->finish();
		$this->add_timestamps( $table_name );
	}

	private function add_table_refresh_tokens() {
		$table_name          = Model::get_table_name( 'Refresh_Token' );
		$refresh_token_table = $this->create_table( $table_name, [ 'id' => false ] );

		$refresh_token_table->column(
			'identifier',
			'string',
			[
				'primary_key' => true,
			]
		);
		$refresh_token_table->column( 'expiry_date_time', 'datetime' );
		$refresh_token_table->column( 'access_token', 'string' );
		$refresh_token_table->finish();
		$this->add_timestamps( $table_name );
	}

	private function add_table_auth_code() {
		$table_name       = Model::get_table_name( 'Auth_Token' );
		$auth_token_table = $this->create_table( $table_name, [ 'id' => false ] );

		$auth_token_table->column(
			'identifier',
			'string',
			[
				'primary_key' => true,
			]
		);
		$auth_token_table->column( 'expiry_date_time', 'datetime' );
		$auth_token_table->column(
			'user_identifier',
			'string',
			[
				'null' => true,
			]
		);
		$auth_token_table->column( 'scopes', 'string' );
		$auth_token_table->column( 'client_identifier', 'string' );
		$auth_token_table->finish();
		$this->add_timestamps( $table_name );
	}

	private function drop_tables() {
		$this->drop_table( Model::get_table_name( 'Access_Token' ) );
		$this->drop_table( Model::get_table_name( 'Refresh_Token' ) );
		$this->drop_table( Model::get_table_name( 'Auth_Token' ) );
	}
}
