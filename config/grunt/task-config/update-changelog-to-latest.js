/* eslint-disable no-useless-escape */
/* eslint-disable no-useless-concat */
// Custom task
module.exports = {
	"wordpress-seo": {
		options: {
			// Header:
			// ## 15.7
			//
			// Release Date: January 26th, 2021
			//
			// Enhancements:
			readmeFile: "./readme.txt",
			releaseInChangelog: /[=] \d+\.\d+(\.\d+)? =/g,
			matchChangelogHeader: /[=]= Changelog ==\n\n/ig,
			newHeadertemplate: "== Changelog ==\n\n" + "= " + "VERSIONNUMBER" + " =\n\nRelease date: " + "DATESTRING"  + "\n",
			matchCorrectHeader: "= " + "VERSIONNUMBER" + "(.|\\n)*?\\n(?=(\\n#### \\w\+?\\n|= \\d+[\.\\d]+|= Earlier versions =))",
			matchCorrectLines: "= " + "VERSIONNUMBER" + "(.|\\n)*?(?=(\\n## \\d+[\.\\d]+ =|= Earlier versions =))",
			matchCleanedChangelog: "= " + "VERSIONNUMBER" + "(.|\\n)*= Earlier versions =",
			replaceCleanedChangelog: "= Earlier versions =",
			pluginSlug: "wordpress-seo",
			defaultChangelogEntries: "",
			useANewLineAfterHeader: true,
			commitChangelog: true,
			changelogToInject: ".tmp/n8nchangelog.txt",
		},
	},

};
