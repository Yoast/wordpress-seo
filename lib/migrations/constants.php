<?php

namespace Yoast\WP\Lib\Migrations;

/**
 * Yoast migrations constants class.
 */
class Constants {

	const MYSQL_MAX_IDENTIFIER_LENGTH = 64;
	const SQL_UNKNOWN_QUERY_TYPE      = 1;
	const SQL_SELECT                  = 2;
	const SQL_INSERT                  = 4;
	const SQL_UPDATE                  = 8;
	const SQL_DELETE                  = 16;
	const SQL_ALTER                   = 32;
	const SQL_DROP                    = 64;
	const SQL_CREATE                  = 128;
	const SQL_SHOW                    = 256;
	const SQL_RENAME                  = 512;
	const SQL_SET                     = 1024;
}
