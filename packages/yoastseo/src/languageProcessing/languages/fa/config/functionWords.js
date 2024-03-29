import { singleWords as singleWordTransitionWords } from "./transitionWords";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

/**
 * Returns an array with function words.
 *
 * @returns {[]} The array filled with various categories of function words.
 */
const articles = [ "ی", "یک", "برخی از", "معدود", "چندتا", "مقداری" ];

const cardinalNumerals = [ "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده", "دوازده", "سیزده",
	"چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده", "بیست", "صد", "هزار", "میلیون", "میلیارد", "هفتده", "نونزده",
	"بیست و یک", "سی", "چهل", "پنجاه", "شصت ", "هفتاد", "هشتاد", "نود", "صد و یک", "دویست", "تریلیارد" ];

const ordinalNumerals = [ "اول", "اوّل", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم", "یازدهم",
	"دوازدهم", "سیزدهم", "چهاردهم", "پانزدهم", "شانزدهم", "هفدهم", "هجدهم", "نوزدهم", "بیستم", "پانزدهمین",
	"هفتهمین", "هجدهمین", "نوزدهمین", "بیستمین ", "بیست و یکم", "سی ام ", "چهلم", "پنجاهم", "شصتم", "هفتادم", "هشتادم",
	"نودم", "صدم", "صد و یکم", "دویستم", "هزارم", "میلیونم", "میلیاردم", "هفتهم" ];

const fractions = [ "نیم", "یک سوم", "یک چهارم", "یک پنجم", "یک ششم", "یک هفتم", "یک هشتم", "یک نهم", "یک دهم", "دو سوم",
	"دو چهارم", "دو پنجم", "دو ششم", "دو هفتم", "دو هشتم", "دو نهم", "سه چهارم", "سه پنجم" ];

const pronouns = [ "مرا", "من را", "من‌را", "به من", "تو را", "شما را", "شما", "به تو", "به شما",
	"اون رو", "اونو", "به اون", "اون", "او را", "به او", "او", "به ایشان", "ایشان را", "ایشان", "به ایشون", "ایشون رو",
	"ایشون را", "ایشون", "این", "این را", "آن", "به این", "به آن", "آن را", "این رو", "اینو", "ما را", "به ما", "به اونا",
	"آن‌ها", "آنها را", "آن‌ها را", "به آنها", "به آن‌ها", "اونا", "اونارو", "اونا رو", "من", "تو", "ما", "آنها", "همین", "همان",
	"اینان", "آنان" ];

const possessivePronouns = [ "مال من", "مال تو", "مال او", "مال آن", "مال ما ", "مال شما", "مال ایشان", "مال آنها" ];

const reflexivePronouns = [ "خودم", "خودت", "خودش", "یک نفر خودش", "خودمان", "خودتان", "خودشان" ];

const indefinitePronouns = [ "هر کس", "کسی", "هیچ", "فلان", "هیچ کس", "شخصی", "هیچ چیز", "همه چیز", "چیزی", "یکی دیگر",
	"هر کدام", "هر یک", "هیچ کدام", "کمی", "خیلی", "دیگری", "همه", "بعضی", "هر دو", "معدود", "اندکی", "خیلی", "دیگران ", "چندین" ];

const reciprocalNouns = [ "همدیگر", "یکدیگر" ];

const interrogatives = [ "کی", "کِی", "کجا", "چه", "چرا", "چطور", "آیا" ];

const quantifiers = [ "کمی", "زیاد", "فراوان", "بیشتر", "بسیار", "کم کم", "مشتی", "تعداد بسیارکم", "مقداربسیارکم",
	"تعداد زیادی", "مقدارزیادی", "بخش", "تعداد", "مقداری", "چند", "تمام", "خیلی زیاد" ];

const prepositions = [ "با", "باری", "نیز", "چندان که", "تا اینکه", "چون‌که", "اگرچه", "باوجوداین", "به شروطی که", "واسه‎ی",
	"بی", "بر", "چون", "چندان‌که", "تااینکه", "چون که", "اگر چنانچه", "با این وجود", "بعد از", "برای", "در", "چونان که",
	"زیرا که", "تا آنکه", "از این رو", "اگرچنانچه", "بس که", "قبل از", "واسه", "را", "برای این", "چونان‌که", "زیراکه",
	"تاآنکه", "ازاین‌رو", "الا این‌که", "از بس که", "از بعد از", "یا", "برای این که", "چنان", "همین که", "آن‌جا که", "ازین‌رو",
	"با این حال", "بس‌که", "از قبل از", "اگر", "برای آن که", "چنان‌چه", "همین‌که", "آن‌گاه که", "از بس", "بااین‌حال", "از بس‌که",
	"اندر", "نه", "از برای", "چنان‌که", "همان‌که", "ازآنجاکه", "بااین‌که", "به‌شرط آن‌که", "علیه", "مگر", "برای آن", "چنانچه",
	"همان که", "از آن‌جا که", "ازبس", "با این‌که", "به شرط آن‌که", "بدون", "چه", "خواه", "چونکه", "بلکه", "از آن‌که",
	"ازبس‌که", "بااینکه", "به شرطی که", "ضد", "زیرا", "جز", "ازآنکه", "از بهر آن‌که", "با وجود این", "الی", "غیر", "که",
	"الا", "اکنون که", "الاّ", "از", "بیرون", "به", "پایین", "پشت", "پهلوی", "پی", "تا", "توی", "درون", "دنبال", "روی",
	"زیر", "کنار", "مانند", "مثل", "مقابل", "شبیه", "نزدیک", "میان", "پیش", "برخی", "پر", "زی", "سوای", "بهر", "به غیر ",
	"به اضافه ی", "به علاوه ی", "به وسیله ی", "به استثنای", "به مجرد", "به جهت", "به خاطر", "از نظر", "از روی", "ازسر",
	"از قبیل", "از لحاظ", "از حیث", "از جمله ی", "در برابر", "در مقابل", "درباره ی", "درمورد", "درمیان", "درخصوص",
	"براثر", "براساس", "برطبق", "برحسب", "با وجود" ];

const postposition = [ "را" ];

const conjunctions = [ "اگر", "اما", "پس", "تا", "چون", "چه", "خواه", "زیرا", "که", "لیکن", "نه", "نیز", "و", "ولی", "هم",
	"یا", "که", "همین که", "آنجا که", "از آنجا که", "از این روی", "از بس", "از بس که", "اکنون که", "اگر چنانچه", "اگر چنانکه",
	"اگر چه", "الا اینکه", "با این حال", "با اینکه", "با وجود اینکه", "با وجود این", "بس که", "به شرط آن که", "به طوری که",
	"بلکه", "بنابراین", "به هر حال", "بی آنکه", "تا اینکه", "تا جایی که", "چنانچه", "چندانکه", "چون که", "در حالی که",
	"در صورتی که", "در نتیجه", "زیرا که", "وانگهی", "وقتی که", "وگرنه", "هرچند", "هر گاه که", "هر وقت که", "همانطور که" ];

const interviewVerbs = [ "گفتن", "توضیح دادن", "اظهار کردن", "پرسیدن", "درخواست کردن", "بحث کردن", "اعلام کردن", "گفتگو کردن",
	"فهمیدن", "درک کردن", "پیشنهاد کردن", "بیان کردن", "فکر کردن", "عقیده داشتن", "مکالمه داشتن", "ابراز کردن", "مبادله کردن" ];

const intensifiers = [ "خیلی", "زیاد", "کاملا زیاد", "تقریباً", "انصافاً", "به طرز حیرت انگیزی", "به طور عظیمی", "بیش ازحد",
	"بخصوص", "فوق العاده", "وحشتناک", "به طور شگفت آوری", "به معنای واقعی کلمه", "نسبتا", "واقعاً", "بسیار", "به طور فوق العاده" ];

const auxiliariesAndDelexicalizedVerbs = [ "خواستن", "بایستن", "شایستن", "توانستن", "جرات کردن", "داشتن", "شدن" ];

const generalAdjectivesAdverbs = [ "سیاه", "سفید", "آبی", "قهوه ایی", "خاکستری", "سبز", "نارنجی", "ارغوانی", "قرمز", "سفید",
	"زرد", "دایره", "راست", "مربع", "مثلث", "تازه", "تلخ", "شور", "ترش", "تند", "شیرین", "بد", "تمیز", "پاک", "تاریک",
	"دشوار", "تار", "کثیف", "خشک", "ساده", "خالی", "گران", "سریع", "خارجی", "کامل", "خوب", "سخت", "سنگین", "سفت", "ارزان",
	"سبک", "محلی", "جدید", "پرسروصدا", "قدیمی", "قوی", "ساکت", "درست", "کند", "نرم", "بسیار", "ضعیف", "مرطوب", "اشتباه",
	"جوان", "بزرگ", "عمیق", "طولانی", "دراز", "کشیده", "باریک", "کوتاه", "کوچک", "وسیع", "ضخیم", "نازک", "ناخواسته",
	"ناپاک", "نااهل", "بعضی وقت ها", "شب", "امروز", "امسال", "فردا", "همیشه", "اینجا", "آنجا", "مدرسه", "هر کجا", "مسجد",
	"خوب", "با آرامی", "افتان و خیزان", "گریان", "افسوس", "متاسفانه", "عجبا", "شگفتا", "حتماً", "یقیناً", "چگونه", "چرا",
	"شاید", "پنداری", "به گمانم", "اندک اندک", "قطره قطره", "به جان", "به خدا", "مانا", "همانا", "چنان", "چنین", "بکردار",
	"بسان", "کاش", "ای کاش", "کاشکی", "اگر", "اگرچه", "وگر", "ور", "چنانچه", "نه", "هرگز", "هیچ", "به هیچ وجه", "اصلاً",
	"ابداً", "اول", "دوم", "نخست", "درآغاز", "پیاپی", "گروه گروه", "دسته دسته", "دوتا دوتا", "جز", "مگر", "جزکه",
	"مگر که", "اتفاقاً", "احتمالاً", "دائماً", " اجباراً", "معمولاً", "سریعاً", "مخصوصاً", "تقریباً", " آخرالامر", "الآن", "بالعکس ",
	"فی الفور", "بالطبع", "مادام", "حتی المقدور ", "هنوز", "از نو", "دوباره", "باز", "مجدد", "خارج", "بالا", "زیر",
	"عقب", "کنار", "همه جا", "باز", "امیدوارم", "الهی", "خداکند", "آرزومندم", "ان شالله ", "به نظرم", "مثل اینکه",
	"احتمال دارد", "امکان دارد", "تند", "کند", "آهسته", "سریع", "بد", "آسان", "ارزان", "نیک", "زشت ", "نالان", "دیروز" ];

const interjections = [ "اِه", "دِ", "به به", "اَه اَه", "آخ", "آخیش", "آخیییی", "وا", "ای بابا", "ای وای", "اِواا", "نُچّ",
	"اَاَ بابا", "هیس", "ای وای من ", "اُوه حالا", "اُوه " ];

const recipeWords = [ "شکستن", "آب کردن", "پخش کردن", "لایه", "ورقه", "رول کردن", "سرخ کردن", "پوست کندن", "مخلوط کردن",
	"هم زدن", "تفت دادن", "قاطی کردن", "چشیدن", "برش", "تکه کردن", "نصف کردن", "رنده کردن", "جوشیدن", "بخار کردن",
	"ریختن", "آبکش کردن", "اضافه کردن", "دم کردن", "تخمیر کردن", "باربیکیو", "پختن", "وزن کردن", "رل کردن", "خورد کردن",
	"بخار پز کردن", "غل زدن", "آشپزی", "مواد اولیه", "دستور پخت", "دستورالعمل", "چرب کردن", "در فر پختن", "با ملاقه کشیدن",
	"ریزریز کردن", "مکعب خورد کردن", "چرخ کردن", "تیکه تیکه کردن", "به آرامی جوشاندن", "سریع هم زدن", "با دست هم زدن",
	"هم زن برقی", "هم زدن با حرکت دایره ایی", "گرم کردن", "هم زدن باحرکت جلووعقب", "تزیین کردن", "ورز دادن", "بریان کردن",
	"گریل کردن", "کباب کردن", "با آتش مستقیم پختن", "ادویه زدن", "روغن اضافی را گرفتن", "طعم دار کردن", "پیچیدن",
	"پخته نشده", "زیاد پخته شده", "کاملا پخته شده", "نیم پز", "خام", "یخ زده", "قاشق چایخوری", "فر ", "گاز", "سطح روی گاز",
	"حرارت ملایم", "عصاره مرغ", "عصاره گوشت", "عصاره سبزیجات", "سبک پخت وپز", "ادویه", "خمیر", "بی ادویه", "کتاب آشپزی" ];

const timeWords = [ "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
	"صبح", "ظهر", "عصر", "نصف شب", "مغرب", "غروب", "پیش از ظهر", "بامداد", "قبل از ظهر", "نیمه ظهر", "ساعت", "روز", "زمان",
	"تقویم", "سال", "دقیقه", "اوایل شب", "سر شب", "هفته", "گذشته", "آینده", "حال", "بهار", "تابستان", "پاییز", "زمستان",
	"گرینویچ", "دهه", "تقویم قمری", "تقویم شمسی", "تقویم نجومی", "ساعت شنی", "ساعت عقربه ایی", "ساعت جهانی", "سریع",
	"سال کبیسه", "ساعت خورشیدی", "لحظه لحظه", "ماه", "الان", "وقت", "نصف النهار", "حال حاضر", "اکنون", "ربع", "روزمره",
	"روزانه", "زمان سنج", "تاخیر", "دیروز", "امروز" ];

const vagueNouns = [ "هر", "همه", "هیچ", "فلان", "چندین", "خیلی ", "کمی", "بسیاری", "اندکی", "قدری", "برخی", "بعضی", "پاره ایی", "چندان" ];

const titles = [ "آقا", "خانم", "دوشیزه", "جناب", "سرکار خانم", "سرکار آقا", "دکتر", "جناب آقا" ];

const transitionWords = [ "دوباره", "قطعاً", "حتماً", "اصلاً", "قاعدتاً", "ظبیعتاً", "شاید", "کاملاً", "به", "از", "و", "همچنین",
	"هم", "مانند", "مثل", "شبیه به", "ولی", "اما", "امّا", "لیکن", "ولو", "در ضمن", "در کنار", "ترجیحاً", "وگرنه", "پس", "سپس",
	"وقتی", "زمانی که", "به خاطر", "مخصوصاً", "مشخصاً", "در کل", "بعد", "قبل", "تا" ];

export const all = transformWordsWithHyphens( [].concat( cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, titles, transitionWords, postposition, reciprocalNouns, possessivePronouns, fractions,
	articles, singleWordTransitionWords ) );

export default all;
