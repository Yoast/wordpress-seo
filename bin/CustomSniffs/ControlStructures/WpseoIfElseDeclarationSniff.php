<?php
/**
 * WordPress_Sniffs_ControlStructures_WpseoIfElseDeclarationSniff.
 *
 * PHP version 5
 *
 * @package   WPSEO
 * @author    Juliette Reinders Folmer
 */

/**
 * WordPress_Sniffs_ControlStructures_WpseoIfElseDeclarationSniff.
 *
 * Verifies that else statements are on a new line.
 *
 * @package   WPSEO
 * @author    Juliette Reinders Folmer
 */
class WordPress_Sniffs_ControlStructures_WpseoIfElseDeclarationSniff implements PHP_CodeSniffer_Sniff
{


    /**
     * Returns an array of tokens this test wants to listen for.
     *
     * @return array
     */
    public function register()
    {
        return array(
                T_ELSE,
                T_ELSEIF,
               );

    }//end register()


    /**
     * Processes this test, when one of its tokens is encountered.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token in the
     *                                        stack passed in $tokens.
     *
     * @return void
     */
    public function process( PHP_CodeSniffer_File $phpcsFile, $stackPtr )
    {
        $tokens     = $phpcsFile->getTokens();
		$has_errors = 0;

		if( isset( $tokens[ $stackPtr ]['scope_opener'] ) ) {
			$scope_open = $tokens[ $stackPtr ]['scope_opener'];
		}
		else if( $tokens[ ( $stackPtr + 2 ) ]['code'] === T_IF && isset( $tokens[ ( $stackPtr + 2 ) ]['scope_opener'] ) ) {
			$scope_open = $tokens[ ( $stackPtr + 2 ) ]['scope_opener'];
		}

		if ( isset( $scope_open ) && $tokens[ $scope_open ]['code'] !== T_COLON ) { // Ignore alternative syntax

			$previous = $phpcsFile->findPrevious( T_CLOSE_CURLY_BRACKET, $stackPtr, null, false );

			if ( $tokens[ $previous ]['line'] === $tokens[ $stackPtr ]['line'] ) {
				$error = 'else(if) statement must be on a new line';
				$phpcsFile->addError( $error, $stackPtr, 'NewLine' );
				$has_errors++;
				unset( $error );
			}

			$start        = ( $previous + 1 );
			$other_start  = null;
			$other_length = 0;
			for ( $i = $start; $i < $stackPtr; $i++ ) {
				if( $tokens[ $i ]['code'] !== T_COMMENT && $tokens[ $i ]['code'] !== T_WHITESPACE) {
					if( ! isset( $other_start ) ) {
						$other_start = $i;
					}
					$other_length++;
				}
			}
			unset( $i );

			if( isset( $other_start, $other_length ) ) {
				$error = 'Nothing but whitespace and comments allowed between closing bracket and else(if) statement, found "%s"';
				$data = $phpcsFile->getTokensAsString( $other_start, $other_length );
				$phpcsFile->addError( $error, $stackPtr, 'StatementFound', $data );
				$has_errors++;
				unset( $error, $data, $other_start, $other_length );

			}

			if ( $has_errors === 0 ) {
				if ( $tokens[ $previous ]['column'] !== $tokens[ $stackPtr ]['column'] ) {
					$error = 'else(if) statement not aligned with previous part of the control structure';
					$phpcsFile->addError( $error, $stackPtr, 'Alignment' );
					unset( $error );
				}
			}
		}

    }//end process()

}//end class
