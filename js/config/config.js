/**
* default config
 * stopwords and wordstoremove require a leading space to make sure the regex works correctly
 * JavaScript doesn"t have lookbehinds in regular expressions.
*/

analyzerConfig = {
    stopWords: ["a","about","above","after","again","against","all","am","an","and","any","are","as","at","be","because","been","before","being","below","between","both","but","by","could","did","do","does","doing","down","during","each","few","for","from","further","had","has","have","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","it","it's","its","itself","let's","me","more","most","my","myself","nor","of","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","she","she'd","she'll","she's","should","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","we","we'd","we'll","we're","we've","were","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","would","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"],
    wordsToRemove: [" a", " in", " an", " on", " for", " the", " and"],
    maxSlugLength: 20,
    maxUrlLength: 40
};

preprocessorConfig = {
   syllables: {
       subtractSyllables: ["cial","tia","cius","cious","giu","ion","iou","sia$","[^aeiuoyt]{2,}ed$","[aeiouy][^aeiuoyts]{1,}e\\b",".ely$","[cg]h?e[sd]","rved$", "rved","[aeiouy][dt]es?$","[aeiouy][^aeiouydt]e[sd]?$","^[dr]e[aeiou][^aeiou]+$","[aeiouy]rse$"],
       addSyllables: ["ia","riet","dien","iu","io","ii","[aeiouym][bdp]l","[aeiou]{3}","^mc","ism$","([^aeiouy])\1l$","[^l]lien","^coa[dglx].","[^gq]ua[^auieo]","dnt$","uity$","ie(r|st)","[aeiouy]ing","[aeiouw]y[aeiou]"],
       exclusionWords: [
           {word: "shoreline", syllables: 2},
           {word:  "simile", syllables: 3}
       ]
   }
};


