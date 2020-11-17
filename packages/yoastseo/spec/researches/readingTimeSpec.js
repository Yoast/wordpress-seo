import readingTime from "../../src/researches/readingTime.js";
import Paper from "../../src/values/Paper.js";

describe( "Calculates the reading time for the paper (rounded up to the next highest full minute)", function() {
	it( "calculates the reading time for a paper in English with a short text", function() {
		const mockPaper = new Paper( "This is a short text", { locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a long text", function() {
		const mockPaper = new Paper( "This is a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, " +
			"gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, " +
			"tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. " +
			"Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. " +
			"Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada. " +
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. " +
			"Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. " +
			"Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a short text with images", function() {
		const mockPaper = new Paper( "This is a short text with images <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' />",
			{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in English with a long text with images", function() {
		const mockPaper = new Paper( "This is a long text with images. <img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2'" +
			" /> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. " +
			"Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. " +
			"Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. " +
			"Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, " +
			"a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. " +
			"Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. " +
			"Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
			"Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. " +
			"Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. " +
			"Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. " +
			"Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, " +
			"commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. " +
			"In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 2 );
	} );

	it( "calculates the reading time for a paper in English with a long text with many images", function() {
		const mockPaper = new Paper( "This is a long text with many images. " +
			"<img src='http://plaatje1' alt='1' /> <img src='http://plaatje2' alt='2' /> <img src='http://plaatje3' alt='3' " +
			"/> <img src='http://plaatje4' alt='4' /> <img src='http://plaatje5' alt='5' />Lorem ipsum dolor sit amet, " +
			"consectetur adipiscing elit. Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante " +
			"ipsum primis in faucibus. Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, " +
			"vitae finibus purus imperdiet. Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. " +
			"Morbi mollis sapien et gravida convallis. Phasellus gravida consequat leo, a pretium eros interdum ac. " +
			"Pellentesque est metus, fringilla vel ultricies eu, commodo non lacus. Suspendisse potenti. " +
			"Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. In et lorem at velit sollicitudin volutpat. " +
			"Suspendisse potenti. Maecenas malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
			"Aenean vel dapibus leo, gravida consectetur metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. " +
			"Cras ut euismod eros, tincidunt pharetra ipsum. Donec aliquet mauris eu est accumsan, vitae finibus purus imperdiet. " +
			"Donec mollis diam vel tempus accumsan. Aenean non placerat arcu. Morbi mollis sapien et gravida convallis. " +
			"Phasellus gravida consequat leo, a pretium eros interdum ac. Pellentesque est metus, fringilla vel ultricies eu, " +
			"commodo non lacus. Suspendisse potenti. Mauris iaculis mollis tortor vel sodales. Aenean vulputate mauris augue. " +
			"In et lorem at velit sollicitudin volutpat. Suspendisse potenti. Maecenas malesuada.",
		{ locale: "en_US" } );
		expect( readingTime( mockPaper ) ).toEqual( 2 );
	} );

	it( "calculates the reading time for a paper in Arabic", function() {
		const mockPaper = new Paper( "نهر المسيسيبي هو الثاني بطوله في " +
			"الولايات المتحدة، وينبع من بحيرة إتاسكا (بالإنجليزية: Lake Itasca)‏ في شمال غربي مينيسوتا." +
			" ويقطع 10 ولايات: مينيسوتا، ويسكونسن، أيوا، إيلينوي، ميسوري، كنتاكي، تينيسي،" +
			" اركنساس، مسيسيبي، ولويزيانا حيث يصب مشكلا دلتا في خليج المكسيك قاطعا مسافة إجمالية 3,734 كم." +
			"للنهر فصلان تعلو بهما كمية تدفق المياه إلى الحد الأقصى:" +
			"الفصل الأول: بين كانون الأول حتى كانون ثاني (في الشتاء)-الأمطار التي تهطل في جبال الروكي والافلزيم، الذروة الصغرى." +
			"الفصل الثاني: بين نيسان حتى أيار (في الربيع)- ذوبان الثلوج،" +
			" على طول النهر أقيمت سور واقي من التراب مقوى بحلقات عالية من البطون لكي تمنع الفيضانات وأضرار بالنهر.",
		{ locale: "ar" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in Russian", function() {
		const mockPaper = new Paper( "Волнистая толстоголовка[1] (лат. Rhagologus leucostigma) — вид птиц отряда воробьинообразных. " +
			"Неприметная птица среднего размера с тусклым коричневато-серым оперением, самки окрашены ярче самцов. " +
			"Обитает в реликтовых лесах в горах Новой Гвинеи, питается в нижнем ярусе леса ягодами, фруктами, иногда насекомыми. " +
			"Строит чашеобразные гнёзда среди маленьких веточек в кроне дерева и скрывает их мхами и печёночниками. " +
			"Откладывает одно яйцо. Волнистая толстоголовка была описана Томмазо Сальвадори в 1876 году. В 1934 году Эрвин Штреземан " +
			"и Кнуд Палудан[de] выделили вид в монотипический род волнистых толстоголовок[1] (Rhagologus). Долгое время вид относили " +
			"к семейству свистуновых отряда воробьинообразных. В ходе многочисленных молекулярных исследований в начале XXI века вид " +
			"был выделен в монотипическое семейство Rhagologidae, близкородственное с йоровыми, ласточковыми сорокопутами, " +
			"лодкоклювыми мухоловками или личинкоедовыми. Международный союз орнитологов выделяет два подвида.",
		{ locale: "ru" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );

	it( "calculates the reading time for a paper in a language that is not available in the config", function() {
		const mockPaper = new Paper( "This is a short text.", { locale: "lt_LT" } );
		expect( readingTime( mockPaper ) ).toEqual( 1 );
	} );
} );

