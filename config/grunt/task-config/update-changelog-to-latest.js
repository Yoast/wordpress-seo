/* eslint-disable no-useless-escape */
/* eslint-disable no-useless-concat */
// Custom task
module.exports = {
	"wordpress-seo": {
		options: {
			readmeFile: "./changelog.md",
			releaseInChangelog: /[#] \d+\.\d+(\.\d+)?\n\n/g,
			matchChangelogHeader: /Changelog\n=========\n/ig,
			newHeadertemplate: "Changelog\n=========\n\n" + "## " + "VERSIONNUMBER" + "\n\nRelease date: " + "DATESTRING"  + "\n",
			matchCorrectHeader: "## " + "VERSIONNUMBER" + "(.|\\n)*?\\n(?=(\\n#### \\w\+?\\n|## \\d+[\.\\d]+\\n|### Earlier versions|$))",
			matchCorrectLines: "## " + "VERSIONNUMBER" + "(.|\\n)*?(?=(\\n## \\d+[\.\\d]+|### Earlier versions|$))",
			matchCleanedChangelog: "## " + "VERSIONNUMBER" + "(.|\\n)*### Earlier versions|$",
			replaceCleanedChangelog: "### Earlier versions",
			pluginSlug: "wordpress-seo",
			defaultChangelogEntries: "",
			useANewLineAfterHeader: false,
			commitChangelog: true,
			changelogToInject: ".tmp/n8nchangelog.txt",
		},
	},

};
