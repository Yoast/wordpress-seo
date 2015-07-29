// Custom task (See grunt/custom/build_analyzer_translator.js)
module.exports = {
	analyzer: {
		files: {
			"admin/strings-js-analyzer.php": [ "bower_components/js-text-analysis/js/config/translation.json" ]
		}
	}
};
