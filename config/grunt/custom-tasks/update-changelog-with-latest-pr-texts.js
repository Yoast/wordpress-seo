/**
 * escapes a string so it can be use as a regual expression.
 *
 * @param {Object} string The response object.
 * 
 * @returns {Object} string 
 */
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


/*********************
 * class for building a changelog entry
 * 
 * @method parseChancelogLines 
 * @param {Object} multiline string
 * 
 * @method parseYoastCliGeneratedChangelog 
 * @param {Object} multiline string
 * 
 * @get cleanChangelog
 * 
 * 
 */
class ChangelogBuilder {
	constructor(grunt , changelogIn, useEditDistanceComapair = false) {
		this.ChangelogMap = new Map();
		this.grunt = grunt;
		this.useEditDistanceComapair = useEditDistanceComapair;
		if (changelogIn) {
			this.parseChancelogLines(changelogIn);
		};
	};
	
	#addLinesPerHeader(value, index, array) {
		const key = `${value.match(new RegExp(  "[ a-zA-Z]+:" ))}`;
		const lines = value.match(new RegExp( "(?<=\n)\\*([\n]|.)+?(?=\Z|\n\n|\n\\*|\n$)", "gm" ));
		if (this.ChangelogMap.has(key)) {
			this.ChangelogMap.get(key).append(lines);
		} else {
			const uniqueLines = new Unique(this.grunt);
			uniqueLines.append(lines);
			this.ChangelogMap.set(key, uniqueLines);
		};
		if (this.useEditDistanceComapair) {
			this.ChangelogMap.get(key).test();
		}
	};
	

	parseChancelogLines(changelogIn){
		const parts = changelogIn.match(new RegExp( "\n[ a-zA-Z]+:(.|\\n)*?(?=(\n[ a-zA-Z]+:|\$))", "g" ));
		parts.forEach(this.#addLinesPerHeader.bind(this));
	};
	
	parseYoastCliGeneratedChangelog(changelogIn){
		//strip header from new file.
		changelogIn = changelogIn.replace( new RegExp( "# Yoast/wordpress-seo:(.|\\n)*?(?=\n[ a-zA-Z]+:)" ),
		""
		);
		// remove [#16525](https://github.com/Yoast/wordpress-seo/pull/16525) from lines
		changelogIn = changelogIn.replace( new RegExp( "\\W\\[#\\d+\\]\\(https://github.com/Yoast/.+?/pull/\\d+\\)" , "gm" ),
		""
		);
		this.parseChancelogLines(changelogIn)
	};


	get cleanChangelog(){
		this.grunt.verbose.writeln(this.ChangelogMap);
		var newlines = ""
		//console.log((this.ChangelogMap.has('Enhancements:')))
		if (this.ChangelogMap.has('Enhancements:')) {
			//console.log("jhe")
			newlines = newlines = "\nEnhancements:\n\n"
			newlines = newlines + this.ChangelogMap.get('Enhancements:').items.join("\n");
		};
		if (this.ChangelogMap.has('Bugfixes:')) {
			//console.log("jhe")
			newlines = newlines + "\n\nBugfixes:\n\n" + this.ChangelogMap.get('Bugfixes:').items.join("\n");
		};
		this.ChangelogMap.forEach(function (value, key, map) {
			//console.log(`map.get('${key}') = ${value}`);
			if (!(key === 'Enhancements:' || key === 'Bugfixes:' || key == 'Non user facing:')) {
				newlines = newlines + "\n\n" + key + "\n\n" + this.ChangelogMap.get(key).items.join("\n");
			};
	   }, this);
		return newlines
	};
};

class Unique {
	constructor(grunt, items) {
		this.items = new Array();
		this.grunt = grunt
		if (items) {
	  		this.items = items;
		};
	};
	append(newItems) {
	  newItems.forEach(function(newItem) {
		if (!this.items.includes(newItem)) {
		  this.items.push(newItem);
		};
	  }, this);    
	};
	test() {
		var toBeRemoved = new Array();
		for (var i = 0; i<this.items.length; i++) {
			var arrlen = this.items.length;
			for (var j = i+1; j<arrlen; j++) {
				
				if (this.#similarity(this.items[i], this.items[j]) > 0.9) {
					toBeRemoved.push(j)
					this.grunt.verbose.writeln ("---------------")
					this.grunt.verbose.writeln (`${j}: ${this.items[j]}`)
					this.grunt.verbose.writeln (`${i}: ${this.items[i]}`)
					this.grunt.verbose.writeln (`${this.#similarity(this.items[i], this.items[j])}`)
					this.grunt.verbose.writeln ("---------------")
				}
			}
		}
		//sort as we are removing index wize the biggest need to go first
		this.grunt.verbose.writeln(toBeRemoved)
		toBeRemoved.sort(function(a, b){return b-a});
		for (var i = 0; i<toBeRemoved.length; i++) {
			this.items.splice(toBeRemoved[i],1);
			this.grunt.verbose.writeln(toBeRemoved[i]);
		}
		
	}

	#similarity(s1, s2) {
		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
		  longer = s2;
		  shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength == 0) {
		  return 1.0;
		}
		return (longerLength - this.#editDistance(longer, shorter)) / parseFloat(longerLength);
	  }
	
	  #editDistance(s1, s2) {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();
	  
		var costs = new Array();
		for (var i = 0; i <= s1.length; i++) {
		  var lastValue = i;
		  for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
			  costs[j] = j;
			else {
			  if (j > 0) {
				var newValue = costs[j - 1];
				if (s1.charAt(i - 1) != s2.charAt(j - 1))
				  newValue = Math.min(Math.min(newValue, lastValue),
					costs[j]) + 1;
				costs[j - 1] = lastValue;
				lastValue = newValue;
			  }
			}
		  }
		  if (i > 0)
			costs[s2.length] = lastValue;
		}
		return costs[s2.length];
	  }

 };

//const mergeChangeLog = require( "../lib/merge-changelog" );
const parseVersion = require( "../lib/parse-version" );
const _isEmpty = require( "lodash/isEmpty" );

/**
 * A task to remove old changelog entries and add new ones in changlog file..
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"update-changelog-with-latest-pr-texts",
		"Prompts the user for the changelog entries and updates the readme.txt",
		function() {
			const done = this.async();

			const newVersion = grunt.option( "plugin-version" );
			const versionNumber = parseVersion( newVersion );
			const suffixes = {
				'one': 'st',
				'two': 'nd',
				'few': 'rd',
				'other': 'th'
			}
			const pr = new Intl.PluralRules('en-US', {
				type: 'ordinal'
			})
			const format = (number) => `${number}${suffixes[pr.select(number)]}`

			let changelog = grunt.file.read( "./readme.txt" );
			// let changelogIn = grunt.file.read( "./.tmp/change_in_log.md" );

			const releaseInChangelog = /[=] \d+\.\d+(\.\d+)? =/g;
			const allReleasesInChangelog = changelog.match( releaseInChangelog );
			const changelogVersions = allReleasesInChangelog.map(
				element => parseVersion( element.slice( 2, element.length - 2 ) )
			);

			// Check if the current version already exists in the changelog.
			const containsCurrentVersion = ! _isEmpty(
				changelogVersions.filter( version => {
					return (
						versionNumber.major === version.major &&
						versionNumber.minor === version.minor &&
						versionNumber.patch === version.patch
					);
				} )
			);

			// Only if the current version is not in the changelog yet, and is not a patch, we remove old changelog entries.
			if ( ! containsCurrentVersion && versionNumber.patch === 0 ) {
				let cleanedChangelog = changelog;
				const highestMajor = Math.max( ...changelogVersions.map( version => version.major ) );
				const lowestMajor = Math.min( ...changelogVersions.map( version => version.major ) );

				if ( highestMajor === lowestMajor ) {
					// If there are only multiple minor versions of the same major version, remove all entries from the oldest minor version.
					const lowestMinor = Math.min( ...changelogVersions.map( version => version.minor ) );
					const lowestVersion = `${lowestMajor}.${lowestMinor}`;
					cleanedChangelog = changelog.replace(
						new RegExp( "= " + lowestVersion + "(.|\\n)*= Earlier versions =" ),
						"= Earlier versions ="
					);
				} else {
					// If there are multiple major versions in the changelog, remove all entries from the oldest major version.
					cleanedChangelog = changelog.replace(
						new RegExp( "= " + lowestMajor + "(.|\\n)*= Earlier versions =" ),
						"= Earlier versions ="
					);
				}

				// If something has changed, persist this.
				if ( cleanedChangelog !== changelog ) {
					changelog = cleanedChangelog;

					// Update the grunt reference to the changelog.
					grunt.option( "changelog", changelog );

					// Write changes to the file.
					grunt.file.write( "./readme.txt", changelog );
				}
			}

			const changelogBuilder = new ChangelogBuilder(grunt, null , options.useEditDistanceComapair);
			// changelogBuilder.parseYoastCliGeneratedChangelog( grunt.file.read( "./.tmp/change_in_log.md" ) );

			// If the current version is already in the changelog, retrieve the full readme and let the user edit it.
			if ( containsCurrentVersion ) {
				// get the changelog entry's for the current version from the readme.
				let changelogVersionNumber = versionNumber.major + "." + versionNumber.minor;
				currentChangelogEntriesMatches = changelog.match(new RegExp( "= " + changelogVersionNumber + "(.|\\n)*?(?=(= \\d+[\.\\d]+ =|= Earlier versions =))",  ))
				if (currentChangelogEntriesMatches) {
					currentChangelogEntries = `${currentChangelogEntriesMatches[0]}`;
				};
				//console.log(currentChangelogEntries);

				// get the header from the changelog entry's
				currentChangelogEntriesHeaderMatches = changelog.match(new RegExp( "= " + changelogVersionNumber + "(.|\\n)*?(?=(\\n\\n))",  ))
				if (currentChangelogEntriesHeaderMatches){
					currentChangelogEntriesHeader = `${currentChangelogEntriesHeaderMatches[0]}`
				}
				//console.log(currentChangelogEntriesHeader)
				currentChangelogEntries = currentChangelogEntries.replace(new RegExp( escapeRegExp(currentChangelogEntriesHeader)), "")
				//console.log(currentChangelogEntriesLines)
				
				// create uniyoe linses using class ChangelogBuilder
				changelogBuilder.parseChancelogLines(currentChangelogEntries)
				changelogBuilder.parseYoastCliGeneratedChangelog( grunt.file.read( "./.tmp/" + grunt.config.data.pluginSlug + "-" + newVersion+ ".md" ) );
				//console.log(changelogBuilder.Changelog)
				
				// pul all parts togethor agian
				mergedReadme = changelog.replace(new RegExp( escapeRegExp(currentChangelogEntries)),  "\n" + changelogBuilder.cleanChangelog + "\n\n")

				
				// Write changes to the file.
				grunt.file.write( "./readme.txt", mergedReadme );
				done();
			
			} else {
				changelogBuilder.parseYoastCliGeneratedChangelog( grunt.file.read( "./.tmp/" + grunt.config.data.pluginSlug + "-" + newVersion+ ".md" ) );
				// If the current version is not in the changelog, build a new one from input file.
				let changelogVersionNumber = versionNumber.major + "." + versionNumber.minor;

				// Only add the patch number if we're actually doing a patch.
				if ( versionNumber.patch !== 0 ) {
					changelogVersionNumber += "." + versionNumber.patch;
				}
				var d = new Date();
				// guess release date, probaly tuesday in two weeks time
				// options for better logic, get latest tag
				// is date tag within 14 day next release 14 days
				// if not next teleas 28 days
				// login to jira get it there... 
				d.setDate(d.getDate() + (2 + 14 - d.getDay()));
				const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
				const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
				const da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
				datestring = `${mo} ${format(da)}, ${ye}`
				newChangelog = `= ${changelogVersionNumber} =\nRelease Date: ${datestring}\n${changelogBuilder.cleanChangelog}`
				// Add the changelog, behind the == Changelog == header.
				changelog = changelog.replace( /[=]= Changelog ==/ig, "== Changelog ==\n\n" + newChangelog.trim() );
				// Write changes to the file.
				grunt.file.write( "./readme.txt", changelog );
				done();
				
			}

			// // Stage the changed readme.txt.
			// grunt.config( "gitadd.addChangelog.files", { src: [ "./readme.txt" ] } );
			// grunt.task.run( "gitadd:addChangelog" );

			// // Check if there is something to commit with `git status` first.
			// grunt.config( "gitstatus.checkChangelog.options.callback", function( changes ) {
			// 	// First character of the code checks the status in the index.
			// 	const hasStagedChangelog = changes.some( change => change.code[ 0 ] !== " " && change.file === "readme.txt" );

			// 	if ( hasStagedChangelog ) {
			// 		// Commit the changed readme.txt.
			// 		grunt.config( "gitcommit.commitChangelog.options.message", "Add changelog" );
			// 		grunt.task.run( "gitcommit:commitChangelog" );
			// 	} else {
			// 		grunt.log.writeln( "Changelog is unchanged. Nothing to commit." );
			// 	}
			// } );

			// grunt.task.run( "gitstatus:checkChangelog" );
		}
	);
};
