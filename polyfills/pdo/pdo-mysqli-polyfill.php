<?php
/**
 * These are polyfills of PDO in case the extension isn't loaded.
 *
 * This code is primarily based on the MySQLi driver for Doctrine.
 *
 * The Doctrine license is included below:
 *
 * Copyright (c) 2006-2018 Doctrine Project
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

namespace Yoast\WP\Polyfills\PDO;

class PDO_MySQLi_Polyfill {
	/**
	 * Name of the option to set connection flags
	 */
	const OPTION_FLAGS = 'flags';

	/** @var mysqli */
	private $conn;

	/**
	 * @param array<string, mixed> $params        The params.
	 * @param array<int, mixed>    $driverOptions The driver options.
	 *
	 * @throws \Exception
	 */
	public function __construct( $params, $username, $password, $driverOptions = [] ) {
		if ( is_string( $params ) ) {
			$config = substr( $params, 6 );
			$parts  = explode( ';', $config );
			$params = [];
			foreach ( $parts as $part ) {
				if ( strpos( $part, '=' ) === false ) {
					continue;
				}
				list( $key, $value ) = explode( '=', $part );
				$params[ $key ] = $value;
			}
		}


		$port = isset( $params['port'] ) ? $params['port'] : (int) ini_get( 'mysqli.default_port' );

		// Fallback to default MySQL port if not given.
		if ( ! $port ) {
			$port = 3306;
		}

		$socket = isset( $params['unix_socket'] ) ? $params['unix_socket'] : ini_get( 'mysqli.default_socket' );
		$dbname = isset( $params['dbname'] ) ? $params['dbname'] : '';
		$host   = $params['host'];

		if ( ! empty( $params['persistent'] ) ) {
			$host = 'p:' . $host;
		}

		$flags = isset( $driverOptions[ static::OPTION_FLAGS ] ) ? $driverOptions[ static::OPTION_FLAGS ] : 0;

		$this->conn = mysqli_init();

		$this->setSecureConnection( $params );
		$this->setDriverOptions( $driverOptions );

		set_error_handler(static function () {
			return true;
		});
		try {
			if ( ! $this->conn->real_connect( $host, $username, $password, $dbname, $port, $socket, $flags ) ) {
				throw new \Exception( $this->conn->error, $this->conn->errno );
			}
		} finally {
			restore_error_handler();
		}

		if ( ! isset( $params['charset'] ) ) {
			return;
		}

		$this->conn->set_charset( $params['charset'] );
	}

	/**
	 * Retrieves mysqli native resource handle.
	 *
	 * Could be used if part of your application is not using DBAL.
	 */
	public function getWrappedResourceHandle() {
		return $this->conn;
	}

	/**
	 * @inheritdoc
	 *
	 * The server version detection includes a special case for MariaDB
	 * to support '5.5.5-' prefixed versions introduced in Maria 10+
	 *
	 * @link https://jira.mariadb.org/browse/MDEV-4088
	 */
	public function getServerVersion() {
		$serverInfos = $this->conn->get_server_info();
		if ( stripos( $serverInfos, 'mariadb' ) !== false ) {
			return $serverInfos;
		}

		$majorVersion = floor( $this->conn->server_version / 10000 );
		$minorVersion = floor( ($this->conn->server_version - $majorVersion * 10000) / 100 );
		$patchVersion = floor( $this->conn->server_version - $majorVersion * 10000 - $minorVersion * 100 );

		return $majorVersion . '.' . $minorVersion . '.' . $patchVersion;
	}

	/**
	 * @inheritDoc
	 */
	public function prepare( $sql ) {
		return new PDO_MySQLi_Statement_Polyfill( $this->conn, $sql );
	}

	/**
	 * @inheritDoc
	 */
	public function query( $sql ) {
		$stmt = $this->prepare( $sql );
		$stmt->execute();

		return $stmt;
	}

	/**
	 * @inheritDoc
	 */
	public function quote( $input ) {
		return "'" . $this->conn->escape_string( $input ) . "'";
	}

	/**
	 * @inheritDoc
	 */
	public function exec( $statement ) {
		if ( $this->conn->query( $statement ) === false ) {
			throw new \Exception( $this->conn->error, $this->conn->errno );
		}

		return $this->conn->affected_rows;
	}

	/**
	 * @inheritDoc
	 */
	public function lastInsertId( $name = null ) {
		return (string) $this->conn->insert_id;
	}

	/**
	 * @inheritDoc
	 */
	public function beginTransaction() {
		$this->conn->query( 'START TRANSACTION' );
	}

	/**
	 * @inheritDoc
	 */
	public function commit() {
		if ( ! $this->conn->commit() ) {
			throw new \Exception( $this->conn->error, $this->conn->errno );
		}
	}

	/**
	 * @inheritDoc
	 */
	public function rollBack() {
		if ( ! $this->conn->rollback() ) {
			throw new \Exception( $this->conn->error, $this->conn->errno );
		}
	}

	/**
	 * Apply the driver options to the connection.
	 *
	 * @param array<int, mixed> $driverOptions
	 *
	 * @throws \Exception When one of of the options is not supported.
	 * @throws \Exception When applying doesn't work - e.g. due to incorrect value.
	 */
	private function setDriverOptions( $driverOptions = [] ) {
		if ( empty( $driverOptions ) ) {
			return;
		}

		$supportedDriverOptions = [
			MYSQLI_OPT_CONNECT_TIMEOUT,
			MYSQLI_OPT_LOCAL_INFILE,
			MYSQLI_INIT_COMMAND,
			MYSQLI_READ_DEFAULT_FILE,
			MYSQLI_READ_DEFAULT_GROUP,
		];

		if ( defined( 'MYSQLI_SERVER_PUBLIC_KEY' ) ) {
			$supportedDriverOptions[] = MYSQLI_SERVER_PUBLIC_KEY;
		}

		$exceptionMsg = "%s option '%s' with value '%s'";

		foreach ( $driverOptions as $option => $value ) {
			if ( $option === static::OPTION_FLAGS ) {
				continue;
			}

			if ( ! in_array( $option, $supportedDriverOptions, true ) ) {
				throw new \Exception(
					sprintf( $exceptionMsg, 'Unsupported', $option, $value )
				);
			}

			if ( @mysqli_options( $this->conn, $option, $value ) ) {
				continue;
			}

			throw new \Exception( $this->conn->error, $this->conn->errno );
		}
	}

	/**
	 * Pings the server and re-connects when `mysqli.reconnect = 1`
	 *
	 * @inheritDoc
	 */
	public function ping() {
		if ( ! $this->conn->ping() ) {
			throw new \Exception( $this->conn->error, $this->conn->errno );
		}
	}

	/**
	 * @inheritDoc
	 */
	public function getAttribute( $name ) {
		if ( $name === \PDO::ATTR_DRIVER_NAME ) {
			return 'mysql';
		}
		return null;
	}

	/**
	 * @inheritDoc
	 */
	public function setAttribute( $attribute, $value ) {
		return false;
	}

	/**
	 * Establish a secure connection
	 *
	 * @param array<string, mixed> $params
	 *
	 * @throws \Exception
	 */
	private function setSecureConnection( $params ) {
		if ( ! isset( $params['ssl_key'] ) &&
			! isset( $params['ssl_cert'] ) &&
			! isset( $params['ssl_ca'] ) &&
			! isset( $params['ssl_capath'] ) &&
			! isset( $params['ssl_cipher'] )
		) {
			return;
		}

		$this->conn->ssl_set(
			isset( $params['ssl_key'] ) ? $params['ssl_key'] : null,
			isset( $params['ssl_cert'] ) ? $params['ssl_cert'] : null,
			isset( $params['ssl_ca'] ) ? $params['ssl_ca'] : null,
			isset( $params['ssl_capath'] ) ? $params['ssl_capath'] : null,
			isset( $params['ssl_cipher'] ) ? $params['ssl_cipher'] : null
		);
	}
}
