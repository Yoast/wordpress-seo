<?php
/**
 * WPSEO Free plugin test file.
 *
 * @package WPSEO\Tests\Free
 */

use Brain\Monkey\Functions;

$wpseo_file = realpath( __DIR__ . '/../../wp-seo.php' );

Brain\Monkey\setUp();

Functions\expect( 'plugin_dir_path' )
	->once()
	->with( $wpseo_file )
	->andReturn( dirname( $wpseo_file ) . '/' );

Functions\expect( 'plugin_basename' )
	->once()
	->with( $wpseo_file )
	->andReturn( 'wordpress-seo' );

Functions\expect( 'wp_installing' )
	->once()
	->andReturn( false );

Functions\expect( 'is_admin' )
	->once()
	->andReturn( false );

Functions\expect( 'is_multisite' )
	->once()
	->andReturn( false );

Functions\expect( 'register_activation_hook' )
	->once()
	->with( $wpseo_file, 'wpseo_activate' )
	->andReturn( true );

Functions\expect( 'register_deactivation_hook' )
	->once()
	->with( $wpseo_file, 'wpseo_deactivate' )
	->andReturn( true );

require_once __DIR__ . '/../../wp-seo.php';

Brain\Monkey\tearDown();
