<?php
/** Windows compatible way of executing this conditionally. **/
if ( ! getenv( 'TRAVIS' ) ) {
	exec( 'git checkout composer.lock' );
}
