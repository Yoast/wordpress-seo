<?php
/**
 * Ruckusing configuration file.
 *
 * @package WPSEO
 */

// @codingStandardsIgnoreLine WordPress.VIP.TimezoneChange.date_default_timezone_set -- This is not a WordPress file.
date_default_timezone_set('UTC');

return [
	'db'             => [
		'development' => [
			'type'     => 'sqlite',
			'database' => '',
			'host'     => 'localhost',
			'port'     => '',
			'user'     => '',
			'password' => '',
		],
	],
	'migrations_dir' => [ 'default' => __DIR__ . '/migrations' ],
	'db_dir'         => __DIR__ . '/db',
	'log_dir'        => __DIR__ . '/logs',
	'ruckusing_base' => __DIR__ . '/vendor/ruckusing/ruckusing-migrations/',
];
