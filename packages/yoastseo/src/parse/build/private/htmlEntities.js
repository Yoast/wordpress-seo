export const htmlEntities = [ "amp;", "lt;", "gt;", "quot;", "ndash", "mdash;", "copy;",
	"reg;", "trade;", "asymp;", "ne;", "pound;", "euro;", "deg" ];

export const htmlEntitiesWithAmpersandRegex = new RegExp( "&(" + htmlEntities.join( "|" ) + ")", "ig" );

export const htmlEntitiesWithHashRegex = new RegExp( "#(" + htmlEntities.join( "|" ) + ")", "ig" );

export const htmlEntitiesArray = htmlEntities.map( entity => "&" + entity );
// Note: the order between these two arrays should align between the decoded and encoded version of the entities.
export const encodedHtmlEntitiesArray = [ "&", "<", ">", "\"", "–", "—", "©", "®", "™", "≈", "≠", "£", "€", "°" ];
