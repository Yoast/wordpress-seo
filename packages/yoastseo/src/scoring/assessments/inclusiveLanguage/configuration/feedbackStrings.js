const alternative = "Consider using an alternative, such as \"%2$s\" instead.";
const alternativeUnless = "Consider using an alternative, such as \"%2$s\" instead, unless referring to " +
	"someone who explicitly wants to be referred to with this term.";

const harmfulNonInclusive = "Avoid using \"%1$s\" as it is potentially harmful.";
const harmfulPotentiallyNonInclusive = "Be careful when using \"%1$s\" as it is potentially harmful.";

export const potentiallyHarmful = [ harmfulNonInclusive, alternative ].join( " " );
export const potentiallyHarmfulCareful = [ harmfulPotentiallyNonInclusive, alternative ].join( " " );
export const potentiallyHarmfulOrBeSpecific = potentiallyHarmful.slice( 0, -1 ) + " or be specific about what you're checking.";

export const potentiallyHarmfulUnless = [ harmfulPotentiallyNonInclusive, alternativeUnless ].join( " " );
export const potentiallyHarmfulUnlessNonInclusive = [ harmfulNonInclusive, alternativeUnless ].join( " " );

export const preferredDescriptorIfKnown = "Alternatively, if talking about a specific person, use their preferred descriptor if known.";
