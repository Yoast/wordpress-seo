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

final class PDO_MySQLi_Statement_Polyfill implements \IteratorAggregate {

	/** @var string[] */
	private static $paramTypeMap = [
		\PDO::PARAM_STR  => 's',
		16               => 's',
		\PDO::PARAM_BOOL => 'i',
		\PDO::PARAM_NULL => 's',
		\PDO::PARAM_INT  => 'i',
		\PDO::PARAM_LOB  => 'b',
	];

	/** @var mysqli */
	private $conn;

	/** @var mysqli_stmt */
	private $stmt;

	/**
	 * Whether the statement result metadata has been fetched.
	 *
	 * @var bool
	 */
	private $metadataFetched = false;

	/**
	 * Whether the statement result has columns. The property should be used only after the result metadata
	 * has been fetched ({@see $metadataFetched}). Otherwise, the property value is undetermined.
	 *
	 * @var bool
	 */
	private $hasColumns = false;

	/**
	 * Mapping of statement result column indexes to their names. The property should be used only
	 * if the statement result has columns ({@see $hasColumns}). Otherwise, the property value is undetermined.
	 *
	 * @var array<int,string>
	 */
	private $columnNames = [];

	/** @var mixed[] */
	private $rowBoundValues = [];

	/** @var mixed[] */
	private $boundValues = [];

	/** @var string */
	private $types;

	/**
	 * Contains ref values for bindValue().
	 *
	 * @var mixed[]
	 */
	private $values = [];

	/** @var int */
	private $defaultFetchMode = \PDO::FETCH_BOTH;

	/**
	 * Indicates whether the statement is in the state when fetching results is possible
	 *
	 * @var bool
	 */
	private $result = false;

	/**
	 * @throws \Exception
	 */
	public function __construct( $conn, $sql ) {
		$this->conn = $conn;

		$stmt = $conn->prepare( $sql );

		if ( $stmt === false ) {
			throw new \Exception( $this->conn->error, $this->conn->errno );
		}

		$this->stmt = $stmt;

		$paramCount = $this->stmt->param_count;
		if ( 0 >= $paramCount ) {
			return;
		}

		$this->types       = str_repeat( 's', $paramCount );
		$this->boundValues = array_fill( 1, $paramCount, null );
	}

	/**
	 * @inheritdoc
	 */
	public function bindParam( $param, &$variable, $type = \PDO::PARAM_STR, $length = null ) {
		assert( is_int( $param ) );

		if ( ! isset( self::$paramTypeMap[ $type ] ) ) {
			throw new \Exception( sprintf( 'Unknown type, %d given.', $type ) );
		}

		$this->boundValues[ $param ] =& $variable;
		$this->types[ ($param - 1) ]   = self::$paramTypeMap[ $type ];
	}

	/**
	 * @inheritdoc
	 */
	public function bindValue( $param, $value, $type = \PDO::PARAM_STR ) {
		assert( is_int( $param ) );

		if ( ! isset( self::$paramTypeMap[ $type ] ) ) {
			throw new \Exception( sprintf( 'Unknown type, %d given.', $type ) );
		}

		$this->values[ $param ]      = $value;
		$this->boundValues[ $param ] =& $this->values[ $param ];
		$this->types[ ($param - 1) ]   = self::$paramTypeMap[ $type ];
	}

	/**
	 * @inheritdoc
	 */
	public function execute( $params = null ) {
		if ( $params !== null && count( $params ) > 0 ) {
			if ( ! $this->bindUntypedValues( $params ) ) {
				throw new \Exception( $this->stmt->error, $this->stmt->errno );
			}
		} else {
			$this->bindTypedParameters();
		}

		if ( ! $this->stmt->execute() ) {
			throw new \Exception( $this->stmt->error, $this->stmt->errno );
		}

		if ( ! $this->metadataFetched ) {
			$meta = $this->stmt->result_metadata();
			if ( $meta !== false ) {
				$this->hasColumns = true;

				$fields = $meta->fetch_fields();
				assert( is_array( $fields ) );

				$this->columnNames = array_map(static function ( \stdClass $field ) {
					return $field->name;
				}, $fields);

				$meta->free();
			} else {
				$this->hasColumns = false;
			}

			$this->metadataFetched = true;
		}

		if ( $this->hasColumns ) {
			// Store result of every execution which has it. Otherwise it will be impossible
			// to execute a new statement in case if the previous one has non-fetched rows
			// @link http://dev.mysql.com/doc/refman/5.7/en/commands-out-of-sync.html
			$this->stmt->store_result();

			// Bind row values _after_ storing the result. Otherwise, if mysqli is compiled with libmysql,
			// it will have to allocate as much memory as it may be needed for the given column type
			// (e.g. for a LONGBLOB field it's 4 gigabytes)
			// @link https://bugs.php.net/bug.php?id=51386#1270673122
			//
			// Make sure that the values are bound after each execution. Otherwise, if closeCursor() has been
			// previously called on the statement, the values are unbound making the statement unusable.
			//
			// It's also important that row values are bound after _each_ call to store_result(). Otherwise,
			// if mysqli is compiled with libmysql, subsequently fetched string values will get truncated
			// to the length of the ones fetched during the previous execution.
			$this->rowBoundValues = array_fill( 0, count( $this->columnNames ), null );

			$refs = [];
			foreach ( $this->rowBoundValues as $key => &$value ) {
				$refs[ $key ] =& $value;
			}

			if ( ! $this->stmt->bind_result( ...$refs ) ) {
				throw new \Exception( $this->stmt->error, $this->stmt->errno );
			}
		}

		$this->result = true;
	}

	/**
	 * Binds parameters with known types previously bound to the statement
	 *
	 * @throws \Exception
	 */
	private function bindTypedParameters() {
		$streams = $values = [];
		$types   = $this->types;

		foreach ( $this->boundValues as $parameter => $value ) {
			assert( is_int( $parameter ) );
			if ( ! isset( $types[ ($parameter - 1) ] ) ) {
				$types[ ($parameter - 1) ] = self::$paramTypeMap[ \PDO::PARAM_STR ];
			}

			if ( $types[ ($parameter - 1) ] === self::$paramTypeMap[ \PDO::PARAM_LOB ] ) {
				if ( is_resource( $value ) ) {
					if ( get_resource_type( $value ) !== 'stream' ) {
						throw new \Exception( 'Resources passed with the LARGE_OBJECT parameter type must be stream resources.' );
					}

					$streams[ $parameter ] = $value;
					$values[ $parameter ]  = null;
					continue;
				}

				$types[ ($parameter - 1) ] = self::$paramTypeMap[ \PDO::PARAM_STR ];
			}

			$values[ $parameter ] = $value;
		}

		if ( count( $values ) > 0 && ! $this->stmt->bind_param( $types, ...$values ) ) {
			throw new \Exception( $this->stmt->error, $this->stmt->errno );
		}

		$this->sendLongData( $streams );
	}

	/**
	 * Handle $this->_longData after regular query parameters have been bound
	 *
	 * @param array<int, resource> $streams
	 *
	 * @throws \Exception
	 */
	private function sendLongData( $streams ) {
		foreach ( $streams as $paramNr => $stream ) {
			while ( ! feof( $stream ) ) {
				$chunk = fread( $stream, 8192 );

				if ( $chunk === false ) {
					return new \Exception( sprintf( 'Failed reading the stream resource for parameter offset %d.', $paramNr ) );
				}

				if ( ! $this->stmt->send_long_data( ($paramNr - 1), $chunk ) ) {
					throw new \Exception( $this->stmt->error, $this->stmt->errno );
				}
			}
		}
	}

	/**
	 * Binds a array of values to bound parameters.
	 *
	 * @param mixed[] $values
	 */
	private function bindUntypedValues( $values ) {
		$params = [];
		$types  = str_repeat( 's', count( $values ) );

		foreach ( $values as &$v ) {
			$params[] =& $v;
		}

		return $this->stmt->bind_param( $types, ...$params );
	}

	/**
	 * @return mixed[]|false|null
	 */
	private function _fetch() {
		$ret = $this->stmt->fetch();

		if ( $ret === true ) {
			$values = [];
			foreach ( $this->rowBoundValues as $v ) {
				$values[] = $v;
			}

			return $values;
		}

		return $ret;
	}

	/**
	 * @inheritdoc
	 */
	public function fetch( $fetchMode = null, ...$args ) {
		// do not try fetching from the statement if it's not expected to contain result
		// in order to prevent exceptional situation
		if ( ! $this->result ) {
			return false;
		}

		$fetchMode = $fetchMode ?: $this->defaultFetchMode;

		if ( $fetchMode === \PDO::FETCH_COLUMN ) {
			return $this->fetchColumn();
		}

		$values = $this->_fetch();

		if ( $values === null ) {
			return false;
		}

		if ( $values === false ) {
			throw new \Exception( $this->stmt->error, $this->stmt->errno );
		}

		if ( $fetchMode === \PDO::FETCH_NUM ) {
			return $values;
		}

		$assoc = array_combine( $this->columnNames, $values );
		assert( is_array( $assoc ) );

		switch ( $fetchMode ) {
			case \PDO::FETCH_ASSOC:
				return $assoc;

			case \PDO::FETCH_BOTH:
				return ($assoc + $values);

			case \PDO::FETCH_OBJ:
				return (object) $assoc;

			default:
				throw new \Exception( sprintf( 'Unknown fetch mode %d.', $fetchMode ) );
		}
	}

	/**
	 * @inheritdoc
	 */
	public function fetchAll( $fetchMode = null, ...$args ) {
		$fetchMode = $fetchMode ?: $this->defaultFetchMode;

		$rows = [];

		if ( $fetchMode === \PDO::FETCH_COLUMN ) {
			while ( ($row = $this->fetchColumn()) !== false ) {
				$rows[] = $row;
			}
		} else {
			while ( ($row = $this->fetch( $fetchMode )) !== false ) {
				$rows[] = $row;
			}
		}

		return $rows;
	}

	/**
	 * @inheritdoc
	 */
	public function fetchColumn( $columnIndex = 0 ) {
		$row = $this->fetch( \PDO::FETCH_NUM );

		if ( $row === false ) {
			return false;
		}

		if ( ! array_key_exists( $columnIndex, $row ) ) {
			$count = count( $row );
			throw new \Exception( sprintf(
				'Invalid column index %d. The statement result contains %d column%s.',
				$columnIndex,
				$count,
				$count === 1 ? '' : 's'
			) );
		}

		return $row[ $columnIndex ];
	}


	/**
	 * @inheritDoc
	 */
	public function closeCursor() {
		$this->stmt->free_result();
		$this->result = false;
	}

	/**
	 * @inheritDoc
	 */
	public function rowCount() {
		if ( $this->hasColumns ) {
			return $this->stmt->num_rows;
		}

		return $this->stmt->affected_rows;
	}

	/**
	 * @inheritDoc
	 */
	public function columnCount() {
		return $this->stmt->field_count;
	}

	/**
	 * @inheritdoc
	 */
	public function setFetchMode( $fetchMode, ...$args ) {
		$this->defaultFetchMode = $fetchMode;
	}

	/**
	 * @inheritdoc
	 */
	public function getIterator() {
		while ( ($result = $this->fetch()) !== false ) {
			yield $result;
		}
	}
}
