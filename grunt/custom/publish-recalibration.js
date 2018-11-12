const fs = require( "fs" );
const path = require( "path" );
const request = require( "request" );

/**
 * A task which deploys the recalibration files to MyYoast.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"publish-recalibration",
		"Deploys the recalibration files to My Yoast.",
		function() {
			/**
			 * Post a request.
			 *
			 * @see https://github.com/request/request
			 *
			 * @param {Object} options The request options.
			 *
			 * @returns {Promise} The promise of a request response.
			 */
			function postRequest( options ) {
				return new Promise( ( resolve, reject ) => {
					request.post( options, function( error, response ) {
						if ( error || response.statusCode !== 200 ) {
							reject( { error, response } );
						}
						resolve( { options, response } );
					} );
				} );
			}

			// Post requests are async. Therefore, this task is too.
			const done = this.async();

			// Read the versions from the package.json file.
			const packageJson = grunt.file.readJSON( "./package.json" );
			const recalibrationVersion = parseInt( packageJson.yoast.recalibrationVersion, 10 );
			const pluginVersion = { package: packageJson.yoast.pluginVersion };

			// For the filename the dots need to be stripped.
			pluginVersion.dotless = pluginVersion.package.replace( ".", "" );

			// Plugin version should be in the form of `X.X`.
			const pluginMatch = pluginVersion.package.match( /^\d+\.\d+/ );
			if ( pluginMatch.length < 1 ) {
				grunt.log.error( "Plugin version is not valid. Should start with X.X where X is a digit." );
				return;
			}

			// Read the recalibration secrets.
			const secret = grunt.file.readYAML( "./.recalibration.yaml" );

			// Use the first match as prefix.
			const version = pluginMatch[ 0 ] + "." + recalibrationVersion;
			grunt.verbose.writeln();
			grunt.verbose.write( "Recalibration version " );
			grunt.verbose.ok( version );
			grunt.verbose.writeln();

			// Convert these entries to request data and collect the request promises.
			const requests = [];
			const entries = [
				{
					name: "analysis-worker",
					file: "wp-seo-analysis-worker",
				}, {
					name: "analysis",
					file: "analysis",
				},
			];
			entries.forEach( ( entry ) => {
				// Create the filename.
				const filename = "./js/dist/" + entry.file + "-" + pluginVersion.dotless + ".min.js";

				grunt.verbose.writeln( "Entry", entry.name );
				grunt.verbose.writeln( "File:", filename );

				// Sanity check the file.
				if ( grunt.file.exists( filename ) ) {
					grunt.verbose.ok();

					// Save the request promise.
					requests.push(
						postRequest( {
							url: "https://my.yoast.com/api/downloads/file/" + entry.name,
							formData: {
								file: fs.createReadStream( path.resolve( filename ) ),
								"content-type": "application/javascript",
								version: version,
								secret: secret[ entry.name ],
							},
						} )
					);
				} else {
					grunt.verbose.error();
				}
				grunt.verbose.writeln();
			} );

			// Wait on the promises.
			grunt.verbose.write( "Uploading..." );
			Promise.all( requests )
				.then( () => {
					grunt.verbose.ok();
					done();
				} )
				.catch( () => {
					grunt.verbose.error();
					done();
				} );
		}
	);
};
