/**
 * Returns a configobject with maxSlugLength, maxURLLength and MaxMeta to be used
 * for analysis
 *
 * @returns {object} the config object
 */
module.exports = function(){
	return {
		maxSlugLength: 20,
		maxUrlLength: 40,
		maxMeta: 156
	}
};
