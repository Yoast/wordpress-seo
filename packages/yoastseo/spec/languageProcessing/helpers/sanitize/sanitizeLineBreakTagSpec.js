import sanitizeLineBreakTag from "../../../../src/languageProcessing/helpers/sanitize/sanitizeLineBreakTag";

describe( "Test for replacing line break tags that contain attribute(s) with paragraph tag", function() {
	it( "returns sanitized text where the original text has <br> tags with a closing tag", function() {
		const text = "<p>Fruit and chips. Those are two words that seem worlds apart. One is healthy, you can eat it almost as much as you want, " +
			"and even your doctor recommends it. Guess which one that is? We're talking about the fruit, of course. " +
			"The other one (hint: chips) is a snack that people say you should rarely eat. It often comes with warnings like, " +
			"eat in moderation, do it occasionally, as a treat. That's bad news because it tastes so good!<br data-mce-fragment=\"1\">" +
			"</br><br data-mce-fragment=\"1\"></br>So, we set out to find balance in the world. We wanted to create something healthy, " +
			"like fruit. But, we also wanted it to quench the cravings for foods like chips. And we did it! We created the fruit chips! " +
			"It's chips, but made of fruit!<br data-mce-fragment=\"1\"></br><br data-mce-fragment=\"1\"></br>How do we make the chips " +
			"and what do they taste like?<br data-mce-fragment=\"1\"></br><br data-mce-fragment=\"1\"></br>How are fruit chips even made? " +
			"Do we make some fruit paste and then bake it at super high temperatures? No, quite the opposite, actually." +
			" It's not even very complicated. All we do is pick the best fruits at the prime of their ripeness and at the peak " +
			"of their season. We then slice them very thinly with our specialized tools. Finally, we put them in a dehydrator " +
			"to remove the juice and get the crunch. That's it! We are quite determined to let the fruit be the star. " +
			"So we don't add any additives, and we certainly don't add any sugars. We work with local farmers to get the freshest, " +
			"seasonal fruits. By buying locally, we also reduce our carbon footprint.<br data-mce-fragment=\"1\"></br>" +
			"<br data-mce-fragment=\"1\"></br>So, how does that taste? When you eat our chips, you'll get the crunch of chips, " +
			"coupled with the delicious, fragrant flavors of fruit. Your senses and your brain will be confused, " +
			"but your tastebuds will be overjoyed!</p>";
		expect( sanitizeLineBreakTag( text ) ).toBe( "<p>Fruit and chips. Those are two words that seem worlds apart. " +
			"One is healthy, you can eat it almost as much as you want, and even your doctor recommends it. " +
			"Guess which one that is? We're talking about the fruit, of course. The other one (hint: chips) is " +
			"a snack that people say you should rarely eat. It often comes with warnings like, eat in moderation, " +
			"do it occasionally, as a treat. That's bad news because it tastes so good!</p><p></p><p>So, we set out to " +
			"find balance in the world. We wanted to create something healthy, like fruit. But, we also wanted it " +
			"to quench the cravings for foods like chips. And we did it! We created the fruit chips! It's chips, " +
			"but made of fruit!</p><p></p><p>How do we make the chips and what do they taste like?</p><p></p><p>How are fruit c" +
			"hips even made? Do we make some fruit paste and then bake it at super high temperatures? " +
			"No, quite the opposite, actually. It's not even very complicated. All we do is pick the best fruits at " +
			"the prime of their ripeness and at the peak of their season. We then slice them very thinly with our specialized tools. " +
			"Finally, we put them in a dehydrator to remove the juice and get the crunch. That's it! We are quite determined " +
			"to let the fruit be the star. So we don't add any additives, and we certainly don't add any sugars. " +
			"We work with local farmers to get the freshest, seasonal fruits. By buying locally, we also reduce our carbon " +
			"footprint.</p><p></p><p>So, how does that taste? When you eat our chips, you'll get the crunch of chips, coupled with " +
			"the delicious, fragrant flavors of fruit. Your senses and your brain will be confused, " +
			"but your tastebuds will be overjoyed!</p>"
		);
	} );
	it( "returns sanitized text where the original text has <br> tags without a closing tag", function() {
		const text = "<p>Fruit and chips. Those are two words that seem worlds apart. One is healthy, you can eat it almost as much as you want, " +
			"and even your doctor recommends it. Guess which one that is? We're talking about the fruit, of course. " +
			"The other one (hint: chips) is a snack that people say you should rarely eat. It often comes with warnings like, " +
			"eat in moderation, do it occasionally, as a treat. That's bad news because it tastes so good!<br data-mce-fragment=\"1\">" +
			"<br data-mce-fragment=\"1\">So, we set out to find balance in the world. We wanted to create something healthy, " +
			"like fruit. But, we also wanted it to quench the cravings for foods like chips. And we did it! We created the fruit chips! " +
			"It's chips, but made of fruit!<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">How do we make the chips " +
			"and what do they taste like?<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">How are fruit chips even made? " +
			"Do we make some fruit paste and then bake it at super high temperatures? No, quite the opposite, actually." +
			" It's not even very complicated. All we do is pick the best fruits at the prime of their ripeness and at the peak " +
			"of their season. We then slice them very thinly with our specialized tools. Finally, we put them in a dehydrator " +
			"to remove the juice and get the crunch. That's it! We are quite determined to let the fruit be the star. " +
			"So we don't add any additives, and we certainly don't add any sugars. We work with local farmers to get the freshest, " +
			"seasonal fruits. By buying locally, we also reduce our carbon footprint.<br data-mce-fragment=\"1\">" +
			"<br data-mce-fragment=\"1\">So, how does that taste? When you eat our chips, you'll get the crunch of chips, " +
			"coupled with the delicious, fragrant flavors of fruit. Your senses and your brain will be confused, " +
			"but your tastebuds will be overjoyed!</p>";
		expect( sanitizeLineBreakTag( text ) ).toBe( "<p>Fruit and chips. Those are two words that seem worlds apart. " +
			"One is healthy, you can eat it almost as much as you want, and even your doctor recommends it. " +
			"Guess which one that is? We're talking about the fruit, of course. The other one (hint: chips) is " +
			"a snack that people say you should rarely eat. It often comes with warnings like, eat in moderation, " +
			"do it occasionally, as a treat. That's bad news because it tastes so good!</p><p>So, we set out to " +
			"find balance in the world. We wanted to create something healthy, like fruit. But, we also wanted it " +
			"to quench the cravings for foods like chips. And we did it! We created the fruit chips! It's chips, " +
			"but made of fruit!</p><p>How do we make the chips and what do they taste like?</p><p>How are fruit c" +
			"hips even made? Do we make some fruit paste and then bake it at super high temperatures? " +
			"No, quite the opposite, actually. It's not even very complicated. All we do is pick the best fruits at " +
			"the prime of their ripeness and at the peak of their season. We then slice them very thinly with our specialized tools. " +
			"Finally, we put them in a dehydrator to remove the juice and get the crunch. That's it! We are quite determined " +
			"to let the fruit be the star. So we don't add any additives, and we certainly don't add any sugars. " +
			"We work with local farmers to get the freshest, seasonal fruits. By buying locally, we also reduce our carbon " +
			"footprint.</p><p>So, how does that taste? When you eat our chips, you'll get the crunch of chips, coupled with " +
			"the delicious, fragrant flavors of fruit. Your senses and your brain will be confused, " +
			"but your tastebuds will be overjoyed!</p>"
		);
	} );
	it( "returns the original text if the text doesn't contain line break tag", function() {
		const text = "<p>Fruit and chips. Those are two words that seem worlds apart. " +
			"One is healthy, you can eat it almost as much as you want, and even your doctor recommends it. " +
			"Guess which one that is? We're talking about the fruit, of course. The other one (hint: chips) is " +
			"a snack that people say you should rarely eat. It often comes with warnings like, eat in moderation, " +
			"do it occasionally, as a treat. That's bad news because it tastes so good!</p><p>So, we set out to " +
			"find balance in the world. We wanted to create something healthy, like fruit. But, we also wanted it " +
			"to quench the cravings for foods like chips. And we did it! We created the fruit chips! It's chips, " +
			"but made of fruit!</p><p>How do we make the chips and what do they taste like?</p><p>How are fruit c" +
			"hips even made? Do we make some fruit paste and then bake it at super high temperatures? " +
			"No, quite the opposite, actually. It's not even very complicated. All we do is pick the best fruits at " +
			"the prime of their ripeness and at the peak of their season. We then slice them very thinly with our specialized tools. " +
			"Finally, we put them in a dehydrator to remove the juice and get the crunch. That's it! We are quite determined " +
			"to let the fruit be the star. So we don't add any additives, and we certainly don't add any sugars. " +
			"We work with local farmers to get the freshest, seasonal fruits. By buying locally, we also reduce our carbon " +
			"footprint.</p><p>So, how does that taste? When you eat our chips, you'll get the crunch of chips, coupled with " +
			"the delicious, fragrant flavors of fruit. Your senses and your brain will be confused, " +
			"but your tastebuds will be overjoyed!</p>";
		expect( sanitizeLineBreakTag( text ) ).toBe( text );
	} );
	it( "doesn't break when the input text is empty", function() {
		expect( sanitizeLineBreakTag( "" ) ).toBe( "" );
	} );
} );
