<?php

namespace Yoast\WP\SEO\Commands;

use WP_CLI;

trait Ask_Trait {
	
	private function ask( $question, $options = [] ) {
		if ( ! empty( $options ) ) {
			fwrite( STDOUT, $question . ' [' . implode( '/', $options ) . '] ' . \PHP_EOL );

			$answer = strtolower( trim( fgets( STDIN ) ) );

			if ( ! in_array( $answer, $options, true ) ) {
				WP_CLI::error( 'Invalid answer', false );
				return $this->ask( $question, $options );
			}
			return $answer;
		}

		fwrite( STDOUT, $question . \PHP_EOL );

		return trim( fgets( STDIN ) );
	}
}
