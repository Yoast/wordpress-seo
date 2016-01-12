/**
 * Returns a configobject with maxSlugLength, maxUrlLength and MaxMeta to be used
 * for analysis
 *
 * @returns {object} the config object containing the maxSlugLength, maxUrlLength and the MaxMeta values
 */
module.exports = function(){
	return {
		maxSlugLength: 20,
		maxUrlLength: 40,
		maxMeta: 156
	}
};
