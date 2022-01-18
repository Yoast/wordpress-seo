import countCharactersFunction from "../../../../../src/languageProcessing/languages/ja/helpers/countCharacters.js";

describe( "counts characters in a string", function() {
	it( "returns the number of characters", function() {
		expect( countCharactersFunction( "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、" +
			"高速運転が可能な標準軌新線を建設することを決定。1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、" +
			"東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した。" ) ).toBe( 136 );
	} );
	it( "makes sure the countCharacters function still works when the input is a non-Japanese string", function() {
		expect( countCharactersFunction( "this is a string" ) ).toBe( 16 );
		expect( countCharactersFunction( "Низът в компютърните науки е крайна поредица от символи " +
			"(представляващи краен брой знаци)." ) ).toBe( 90 );
	} );
	it( "makes sure that the table of contents is excluded from the calculation", function() {
		const text = "<div class=\"wp-block-yoast-seo-table-of-contents yoast-table-of-contents\"><h2>目次</h2><ul><li><a " +
			"href=\"#h-\" data-level=\"2\">発表時期</a></li><li><a href=\"#h--1\" data-level=\"2\">制作状況</a></li><li><a href=\"#h--2\" " +
			"data-level=\"2\">教育現場での使用" +
			"</a></li></ul></div><p>「<strong>どんぐりころころ</strong>」は、大正時代に作られた" +
			"唱歌、広義の。</p><h2 id=\"h-\">発表時期[編集]</h2><p>大正時代に青木存義によって作られた唱歌集『かはいい唱歌』（共益商社書店）が初出である。発表年は2説ある。" +
			"これは初出の『かはいい唱歌 二冊目』の奥付が、初版本とその後の重版本とで異なることに起因する。巷に比較的現存している部数が多い重版本では、「一冊目」と同一日付の" +
			"「大正十年十月」発行との記載があり、この1921年（大正10年）10月であるとする説が主流である。もう1説は、初版本に由来する。青木の故郷である松島町では昭和後期から青木の歌" +
			"を歌い継ごうとする動きが活発となり、そうした活動を通じて地元の郷土史家らが青木家の関係者から本作が掲載されている「二冊目」を譲り受けた。</p>" +
			"<h2 id=\"h--1\">制作状況</h2>" +
			"<p>本作品が掲載された『かはいい唱歌』は「幼稚園又は小学校初年級程度」の子どもを対象として作成されている。青木は当時「文部省図書監修官」及び「小学校唱歌教科書編纂委員」" +
			"の任にあったものの、この唱歌集は私的に民間の出版社から出したものであり、いわゆる文部省編纂の「\">文部省唱歌」にはあたらない。「一冊目」「二冊目」ともに10編、" +
			"<img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' /> 計20編が収録されており、本作品は「二冊目」の第7番目に掲載されている。" +
			"作詞は全て青木自身であり、青木の詞に曲をつけた作曲者は計12名、本作品の作曲者である梁田貞は" +
			"『兎と狸』と併せ計2曲の作曲を担当している。</p>" +
			"<h2 id=\"h--2\">教育現場での使用[\">編集]</h2>" +
			"<p>戦後においては一般に広義の<a href=\"https://ja.wikipedia.org/wiki/%E7%AB%A5%E8%AC%A1\">童謡</a>にカテゴライズされる本作品は、" +
			"初出本の題名にもあるとおり青木自身は「唱歌」であるとし、「学校や家庭で」歌ってもらえれば本懐であるとしている。しかし発表当時の教育現場では、" +
			"本作品を歌うことは原則上はできなかった。</p>";
		expect( countCharactersFunction( text ) ).toBe( 757 );
	} );
} );
