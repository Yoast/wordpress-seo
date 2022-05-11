/**
 * Creates a try catch for a web worker around a script.
 *
 * @param 		{string} originalScript 	The script to put a try-catch around.
 * @returns 	{string} 					The new script including a try-catch.
 */
function createExceptionHandler( originalScript ) {
	return `
		try {
			${ originalScript }
		} catch ( error ) {
			console.log( "Error occurred during worker initialization:" );
			console.log( error );
		}
	`;
}

/**
 * Creates the script to run inside the fallback web worker.
 *
 * @param 		{string} url 				The URL for which to create a script.
 * @returns 	{string} 					A script that can be run inside a worker as a blob.
 */
function createBlobScript( url ) {
	return `
		self.yoastOriginalUrl = '${ url }';
		importScripts('${ url }');
	`;
}

/**
 * Determines whether or not two URLs have the same origin.
 *
 * @param 		{string} urlA 				First URL to test.
 * @param 		{string} urlB 				Second URL to test.
 *
 * @returns {boolean} Whether the URLs have the same origin.
 */
function isSameOrigin( urlA, urlB ) {
	urlA = new URL( urlA, window.location.origin );
	urlB = new URL( urlB, window.location.origin );

	return urlA.hostname === urlB.hostname &&
		urlA.port === urlB.port &&
		urlA.protocol === urlB.protocol;
}

/**
 * Creates a URL to a blob. This blob imports a script for use in a web worker (using `importScripts`).
 *
 * @param 		{string} url 				The URL to the script that has to be loaded.
 * @returns 	{string} 					The URL to the blob.
 */
function createBlobURL( url ) {
	const URL = window.URL || window.webkitURL;
	const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

	const blobScript = createExceptionHandler(
		createBlobScript( url )
	);

	let blob;
	try {
		blob = new Blob( [ blobScript ], { type: "application/javascript" } );
	} catch ( e1 ) {
		const blobBuilder = new BlobBuilder();
		blobBuilder.append( blobScript );
		blob = blobBuilder.getBlob( "application/javascript" );
	}
	return URL.createObjectURL( blob );
}

/**
 * Creates a worker fallback using the blob URL method.
 *
 * @param 		{string} url 				The URL to create a worker for.
 * @returns 	{Worker} 					The web worker.
 */
function createWorkerFallback( url ) {
	const blobUrl = createBlobURL( url );

	return new Worker( blobUrl );
}

/**
 * Creates a WebWorker using the given url.
 *
 * @param 		{string} url 				The url of the worker.
 * @returns 	{Worker} 					The worker.
 */
function createWorker( url ) {
	// If we are not on the same domain, we require a fallback worker.
	if ( ! isSameOrigin( window.location, url ) ) {
		return createWorkerFallback( url );
	}

	let worker = null;
	try {
		worker = new Worker( url );
	} catch ( e ) {
		try {
			worker = createWorkerFallback( url );
		} catch ( e2 ) {
			throw e2;
		}
	}
	return worker;
}

export {
	createExceptionHandler,
	isSameOrigin,
	createBlobURL,
	createWorker,
	createBlobScript,
	createWorkerFallback,
};

