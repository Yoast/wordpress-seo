<?php

/**
 * Adds a backtrace to PHP errors
 *
 * Copied from: https://gist.github.com/jrfnl/5925642/
 *
 * Adjusted for output and code readability by joostdevalk
 *
 * @param string $error_severity
 * @param string $error_string
 * @param string $error_file
 * @param string $error_line
 */
function process_error_backtrace( $error_severity, $error_string, $error_file, $error_line ) {
	if ( ! ( error_reporting() & $error_severity ) ) {
		return;
	}
	switch ( $error_severity ) {
		case E_WARNING        :
		case E_USER_WARNING :
		case E_STRICT        :
		case E_NOTICE        :
		case ( defined( 'E_DEPRECATED' ) ? E_DEPRECATED : 8192 )   :
		case E_USER_NOTICE  :
			$type  = 'warning';
			$fatal = false;
			break;
		default             :
			$type  = 'fatal error';
			$fatal = true;
			break;
	}
	$trace = debug_backtrace();
	array_shift( $trace );
	echo "\n";
	if ( php_sapi_name() == 'cli' && ini_get( 'display_errors' ) ) {
		echo 'Backtrace from ' . $type . ' \'' . $error_string . '\' at ' . $error_file . ' ' . $error_line . ':' . "\n";
		foreach ( $trace as $item ) {
			echo '  ' . ( isset( $item['file'] ) ? $item['file'] : '<unknown file>' ) . ' ' . ( isset( $item['line'] ) ? $item['line'] : '<unknown line>' ) . ' calling ' . $item['function'] . '()' . "\n";
		}

		flush();
	} else if ( ini_get( 'display_errors' ) ) {
		echo '<p class="error_backtrace">' . "\n";
		echo '  Backtrace from ' . $type . ' \'' . $error_string . '\' at ' . $error_file . ' ' . $error_line . ':' . "\n";
		echo '  <ol>' . "\n";
		foreach ( $trace as $item ) {
			echo '	<li>' . ( isset( $item['file'] ) ? $item['file'] : '<unknown file>' ) . ' ' . ( isset( $item['line'] ) ? $item['line'] : '<unknown line>' ) . ' calling ' . $item['function'] . '()</li>' . "\n";
		}
		echo '  </ol>' . "\n";
		echo '</p>' . "\n";

		flush();
	}
	if ( ini_get( 'log_errors' ) ) {
		$items = array();
		foreach ( $trace as $item ) {
			$items[] = ( isset( $item['file'] ) ? $item['file'] : '<unknown file>' ) . ' ' . ( isset( $item['line'] ) ? $item['line'] : '<unknown line>' ) . ' calling ' . $item['function'] . '()';
		}
		$message = 'Backtrace from ' . $type . ' \'' . $error_string . '\' at ' . $error_file . ' ' . $error_line . ': ' . join( "\n", $items );
		$message .= "\n" . 'URL: ' . $_SERVER['REQUEST_URI'];
		error_log( $message );
	}

	return false;
}

set_error_handler( 'process_error_backtrace' );