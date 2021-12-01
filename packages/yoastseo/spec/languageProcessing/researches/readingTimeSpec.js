import { enableFeatures } from "@yoast/feature-flag";
import readingTime from "../../../src/languageProcessing/researches/readingTime.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";

describe( "Calculates the reading time for the paper (rounded up to the next highest full minute), using words per minute formula", function() {
	it( "calculates the reading time for a paper with a short text", function() {
		const mockPaper = new Paper( "This is a short text" );
		const researcher = new EnglishResearcher( mockPaper );
		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a long text", function() {
		const mockPaper = new Paper( "This is a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, " +
			"gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, " +
			"tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel " +
			"tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, " +
			"a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. " +
			"Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. " +
			"Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, " +
			"gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt " +
			"pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. " +
			"Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel " +
			"sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		const researcher = new EnglishResearcher( mockPaper );
		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper with a short text with images", function() {
		const mockPaper = new Paper( "This is a short text with images <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' />" );
		const researcher = new EnglishResearcher( mockPaper );
		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper with a long text with images", function() {
		const mockPaper = new Paper( "This is a long text with images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet " +
			"mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. " +
			"Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, " +
			"fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean " +
			"vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor " +
			"sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante " +
			"ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus " +
			"purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. " +
			"Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. " +
			"Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit " +
			"sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada." );
		const researcher = new EnglishResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 2 );
	} );

	it( "calculates the reading time for a paper in English with table of contents", function() {
		const mockPaper = new Paper( "<p></p> <div class='wp-block-yoast-seo-table-of-contents yoast-table-of-contents'> " +
			"<h2>Table of contents</h2> <a href='#h-food-that-are-raw' data-level='2'>Food that are raw</a> <a href='#h-food-from-fresh-meat'" +
			" data-level='3'>Food from fresh meat</a> <a href='#h-food-that-contains-vegetables' " +
			"data-level='3'>Food that contains vegetables</a> <a href='#h-food-that-are-cooked' " +
			"data-level='2'>Food that are cooked</a> </div> <p>Here is the list of food you can give your cat.</p>" +
			" <h2 id='h-food-that-are-raw'>Food that are raw</h2> " +
			"<p>Lorem ipsum dolor sit amet, est minim reprimique et, impetus interpretaris eos ea.</p> " +
			"<h3 id='h-food-from-fresh-meat'>Food from fresh meat</h3> " +
			"<p>Aperiri scripserit per cu, at mea graeci numquam.</p> " +
			"<h3 id='h-food-that-contains-vegetables'>Food that contains vegetables</h3> " +
			"<p>Ne vix clita soluta persecuti, vel at fugit labores, mentitum intellegebat ius ex. " +
			"Cu semper comprehensam duo, pro fugit animal reprehendunt et.</p> " +
			"<h2 id='h-food-that-are-cooked'>Food that are cooked</h2> " +
			"<p>Has an natum errem, vix oratio mediocrem an, pro ponderum senserit dignissim ut.</p>", { locale: "en_US" } );
		const researcher = new EnglishResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a long text with many images", function() {
		const mockPaper = new Paper( "This is a long text with many images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> <img src='http://plaatje3' alt='3' /> <img src='http://plaatje4' alt='4' /> <img src='http://plaatje5' " +
			"alt='5' />Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean " +
			"non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel " +
			"sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. " +
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non " +
			"placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor " +
			"vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		const researcher = new EnglishResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 2 );
	} );

	it( "calculates the reading time for a paper in English with some subheadings", function() {
		const mockPaper = new Paper( "This is a long text with some subheadings. <h2> This is subheading 1 </h2> Lorem ipsum dolor sit amet, " +
			"consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. <h2> This is subheading 2 </h2> Donec mollis diam vel " +
			"tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, " +
			"a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti." +
			" Mauris iaculis mollis tortor vel <h2> This is subheading 3 </h2>" +
			"sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. " +
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. <h2> This is subheading 4 </h2>" +
			"Donec mollis diam vel tempus accumsan. Aenean non " +
			"placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor " +
			"vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		const researcher = new EnglishResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in a language where we don't have the formula with a long text with many images", function() {
		const mockPaper = new Paper( "This is a long text with many images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> <img src='http://plaatje3' alt='3' /> <img src='http://plaatje4' alt='4' /> <img src='http://plaatje5' " +
			"alt='5' />Wikipédia iku bauwarna (encyclopedia) kang cumepak ing manéka basa (multilingual) tur olèh dibesut (edit), diturun (copy), " +
			"lan dipandum (share) sapa baé kanthi mardika (free). Amarga cumepak ing manéka basa, mula ana Wikipédia basa Jawa iki kang kababar " +
			"ing surya 8 Maret 2004. Saben wong olèh mbesut, nurun, lan mandum kaca ing Wikipédia iki. Tegesé, kowé bisa mèlu ngripta utawa " +
			"nggawé artikel anyar, ndandani artikel kang durung becik, mulihaké artikel kang dirusak, lan sapanunggalané. " +
			"Wong-wong kang tumandang mangkono aran naraguna (user). Kowé bisa nyawiji karo para naraguna liya ing paguyuban saperlu nuwuhaké, " +
			"ngrembakakaké, lan ngregengaké Wikipédia iki. Wikipédia iki minangka salah siji barang wetoning Wikimedia Foundation, " +
			"iji pakumpulan nirlaba, kang kanggo sapa baé tur lelahanan (gratis). Kowé ora perlu mbayar saperlu nggawé akun lan maca artikel " +
			"ing Wikipédia iki. Sapréné, wis ana 50.378 akun lan 64.537 artikel ing Wikipédia basa Jawa. Ayo ngéwangi mbecikaké Wikipédia Jawa iki!",
		{ locale: "jv_ID" } );
		const researcher = new DefaultResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 2 );
	} );
} );

enableFeatures( [ "JAPANESE_SUPPORT" ] );

describe( "Calculates the reading time for the paper (rounded up to the next highest full minute), using characters per minute formula", function() {
	it( "calculates the reading time for a Japanese paper with a short text", function() {
		const mockPaper = new Paper( "これは短いテキストです。", { locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in Japanese with a long text", function() {
		const mockPaper = new Paper( "野猫（ノネコ）と野良猫（ノラネコ）は、通常は同じ野生動物だが[2][3][4]、狩猟が可能かどうかで区別をする場合、野猫と野良猫は区別される[5]。" +
			"この場合の野猫の定義は、人間の生活圏への依存が全くみられない、山野に自生するものとされる[6]。野猫（ノネコ）と野良猫（ノラネコ）の両者に遺伝的な違いは全くなく、" +
			"食生活によって区別するとされるが、実際には解剖でもしない限り個体による判別は困難とされる[5]。両者は生物分類上はいずれもイエネコで厳密な区別はなく、" +
			"生活圏の違いで区別される。しかし野良猫がその本来の習性に則って野猫のように狩りをしたとしても、それをもってその個体が野猫であるということにはならない。野猫（ノネコ）" +
			"は山野に自生するイエネコで、飼い猫と相対比較すれば比較的広い縄張りを持つ。野猫は通常は人間からは全く餌を与えられず、野生のヤマネコ（山猫）と同様に、" +
			"野鳥やネズミ、カエルや蛇、昆虫などの小動物を獲って自生している。人里にはあまり近づかないが、まれに田畑などに住むノネズミなどを獲る姿が見られる。" +
			"野猫は非常に警戒心が強く、人にはなつきにくい。しかし餌付けされて野良猫化したり、さらには飼い猫となることもある。イエネコは従来、ネコ科ネコ属のネコという種 " +
			"(Felis catus) とされてきたが、最近になって、ヨーロッパヤマネコ (Felis silvestris) の一亜種 (Felis silvestris catus) もしくはそれ以下の変種等" +
			"とみなされるようになった。すなわち、野生化したイエネコである野猫と、本来的な野生動物であるヨーロッパヤマネコとは、亜種という区分においてのみ遺伝的に異なるグル" +
			"ープである。従って、イエネコとその他のヨーロッパヤマネコとは交雑する。ただし、日本に生息する対馬のツシマヤマネコ (Prionailurus bengalensis euptilura) 、" +
			"および西表島のイリオモテヤマネコ (Prionailurus bengalensis iriomotensis)では、イエネコと交雑した例は見つかっていない。この両者は共にベンガルヤマネコ " +
			"Prionailurus bengalensisの亜種であるが、ベンガルヤマネコの他の亜種では飼育下で交雑した例があり、それにより生まれた子猫がイエネコの品種の一つベン" +
			"ガルの基になったと言われる。日本には本来、自然界に存在するネコ科の動物は、イリオモテヤマネコとツシマヤマネコだけであったが、例えば奄美大島では、" +
			"畑や集落周辺には猛毒を持つハブが棲息しており、餌となるネズミを求めて人の生活圏にも出没する。そのため、ネコを放し飼いにしてネズミを獲らせ、ハブが近づかないようにした。" +
			"このように人が持ち込んだネコが放し飼いにされ、自力で小動物を捕食して生きていけるようになったネコが「ノネコ」と言われる[7]。",
		{ locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 4 );
	} );

	it( "calculates the reading time for a paper with a short text with images", function() {
		const mockPaper = new Paper( "これは画像付きの短いテキストです。 <img src='http://plaatje1' alt='かわいい猫' /> <img src='http://plaatje2' alt='かわいい猫' />",
			{ locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in Japanese with a long text with two images", function() {
		const mockPaper = new Paper( "これは、いくつかの画像を含む長いテキストです。 <img src='http://plaatje1' alt='かわいい猫' /> <img src='http://plaatje2' " +
			"alt='かわいい猫' /> 野猫（ノネコ）と野良猫（ノラネコ）は、通常は同じ野生動物だが[2][3][4]、狩猟が可能かどうかで区別をする場合、野猫と野良猫は区別される[5]。" +
			"この場合の野猫の定義は、人間の生活圏への依存が全くみられない、山野に自生するものとされる[6]。野猫（ノネコ）と野良猫（ノラネコ）の両者に遺伝的な違いは全くなく、" +
			"食生活によって区別するとされるが、実際には解剖でもしない限り個体による判別は困難とされる[5]。両者は生物分類上はいずれもイエネコで厳密な区別はなく、" +
			"生活圏の違いで区別される。しかし野良猫がその本来の習性に則って野猫のように狩りをしたとしても、それをもってその個体が野猫であるということにはならない。野猫（ノネコ）" +
			"は山野に自生するイエネコで、飼い猫と相対比較すれば比較的広い縄張りを持つ。野猫は通常は人間からは全く餌を与えられず、野生のヤマネコ（山猫）と同様に、" +
			"野鳥やネズミ、カエルや蛇、昆虫などの小動物を獲って自生している。人里にはあまり近づかないが、まれに田畑などに住むノネズミなどを獲る姿が見られる。" +
			"野猫は非常に警戒心が強く、人にはなつきにくい。しかし餌付けされて野良猫化したり、さらには飼い猫となることもある。イエネコは従来、ネコ科ネコ属のネコという種 " +
			"(Felis catus) とされてきたが、最近になって、ヨーロッパヤマネコ (Felis silvestris) の一亜種 (Felis silvestris catus) もしくはそれ以下の変種等" +
			"とみなされるようになった。すなわち、野生化したイエネコである野猫と、本来的な野生動物であるヨーロッパヤマネコとは、亜種という区分においてのみ遺伝的に異なるグル" +
			"ープである。従って、イエネコとその他のヨーロッパヤマネコとは交雑する。ただし、日本に生息する対馬のツシマヤマネコ (Prionailurus bengalensis euptilura) 、" +
			"および西表島のイリオモテヤマネコ (Prionailurus bengalensis iriomotensis)では、イエネコと交雑した例は見つかっていない。この両者は共にベンガルヤマネコ " +
			"Prionailurus bengalensisの亜種であるが、ベンガルヤマネコの他の亜種では飼育下で交雑した例があり、それにより生まれた子猫がイエネコの品種の一つベン" +
			"ガルの基になったと言われる。日本には本来、自然界に存在するネコ科の動物は、イリオモテヤマネコとツシマヤマネコだけであったが、例えば奄美大島では、" +
			"畑や集落周辺には猛毒を持つハブが棲息しており、餌となるネズミを求めて人の生活圏にも出没する。そのため、ネコを放し飼いにしてネズミを獲らせ、ハブが近づかないようにした。" +
			"このように人が持ち込んだネコが放し飼いにされ、自力で小動物を捕食して生きていけるようになったネコが「ノネコ」と言われる[7]。", { locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 4 );
	} );

	it( "calculates the reading time for a paper in Japanese with a long text with many images", function() {
		const mockPaper = new Paper( "これは多くの画像を含む長いテキストです。 <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' " +
			"alt='2' /> <img src='http://plaatje3' alt='3' /> <img src='http://plaatje4' alt='4' /> <img src='http://plaatje5' " +
			"alt='5' />野猫（ノネコ）と野良猫（ノラネコ）は、通常は同じ野生動物だが[2][3][4]、狩猟が可能かどうかで区別をする場合、野猫と野良猫は区別される[5]。" +
			"この場合の野猫の定義は、人間の生活圏への依存が全くみられない、山野に自生するものとされる[6]。野猫（ノネコ）と野良猫（ノラネコ）の両者に遺伝的な違いは全くなく、" +
			"食生活によって区別するとされるが、実際には解剖でもしない限り個体による判別は困難とされる[5]。両者は生物分類上はいずれもイエネコで厳密な区別はなく、" +
			"生活圏の違いで区別される。しかし野良猫がその本来の習性に則って野猫のように狩りをしたとしても、それをもってその個体が野猫であるということにはならない。野猫（ノネコ）" +
			"は山野に自生するイエネコで、飼い猫と相対比較すれば比較的広い縄張りを持つ。野猫は通常は人間からは全く餌を与えられず、野生のヤマネコ（山猫）と同様に、" +
			"野鳥やネズミ、カエルや蛇、昆虫などの小動物を獲って自生している。人里にはあまり近づかないが、まれに田畑などに住むノネズミなどを獲る姿が見られる。" +
			"野猫は非常に警戒心が強く、人にはなつきにくい。しかし餌付けされて野良猫化したり、さらには飼い猫となることもある。イエネコは従来、ネコ科ネコ属のネコという種 " +
			"(Felis catus) とされてきたが、最近になって、ヨーロッパヤマネコ (Felis silvestris) の一亜種 (Felis silvestris catus) もしくはそれ以下の変種等" +
			"とみなされるようになった。すなわち、野生化したイエネコである野猫と、本来的な野生動物であるヨーロッパヤマネコとは、亜種という区分においてのみ遺伝的に異なるグル" +
			"ープである。従って、イエネコとその他のヨーロッパヤマネコとは交雑する。ただし、日本に生息する対馬のツシマヤマネコ (Prionailurus bengalensis euptilura) 、" +
			"および西表島のイリオモテヤマネコ (Prionailurus bengalensis iriomotensis)では、イエネコと交雑した例は見つかっていない。この両者は共にベンガルヤマネコ " +
			"Prionailurus bengalensisの亜種であるが、ベンガルヤマネコの他の亜種では飼育下で交雑した例があり、それにより生まれた子猫がイエネコの品種の一つベン" +
			"ガルの基になったと言われる。日本には本来、自然界に存在するネコ科の動物は、イリオモテヤマネコとツシマヤマネコだけであったが、例えば奄美大島では、" +
			"畑や集落周辺には猛毒を持つハブが棲息しており、餌となるネズミを求めて人の生活圏にも出没する。そのため、ネコを放し飼いにしてネズミを獲らせ、ハブが近づかないようにした。" +
			"このように人が持ち込んだネコが放し飼いにされ、自力で小動物を捕食して生きていけるようになったネコが「ノネコ」と言われる[7]。", { locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 5 );
	} );

	it( "calculates the reading time for a paper in Japanese with table of contents and images", function() {
		const mockPaper = new Paper( "<div class=\"wp-block-yoast-seo-table-of-contents yoast-table-of-contents\"><h2>目次</h2><ul><li><a " +
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
			"本作品を歌うことは原則上はできなかった。</p>", { locale: "ja" } );
		const researcher = new JapaneseResearcher( mockPaper );

		expect( readingTime( mockPaper, researcher ) ).toEqual( 3 );
	} );
} );
