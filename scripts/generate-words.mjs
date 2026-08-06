import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "src", "lib", "data", "words.ts");

const cats = [
  "Travel",
  "Business",
  "Medical",
  "Technology",
  "Daily English",
  "University",
  "Grammar",
  "Verbs",
  "Phrasal Verbs",
  "Idioms",
  "IELTS",
  "TOEFL",
];

/** word|ru|emoji — compact lines */
const RAW = `
Travel
passport|паспорт|🛂
suitcase|чемодан|🧳
airport|аэропорт|✈️
boarding pass|посадочный талон|🎫
departure|вылет|🛫
arrival|прибытие|🛬
customs|таможня|🛃
visa|виза|📄
itinerary|маршрут|🗺️
layover|пересадка|⏱️
hostel|хостел|🛏️
hotel|отель|🏨
reservation|бронь|📅
sightseeing|осмотр достопримечательностей|📸
souvenir|сувенир|🎁
guidebook|путеводитель|📘
currency|валюта|💱
exchange rate|курс обмена|💹
jet lag|джетлаг|😴
luggage|багаж|🧳
delay|задержка|⏳
platform|платформа|🚉
ticket|билет|🎟️
destination|пункт назначения|📍
backpack|рюкзак|🎒
map|карта|🗺️
tourist|турист|📷
embassy|посольство|🏛️
border|граница|🚧
cruise|круиз|🛳️
ferry|паром|⛴️
cabin|каюта|🚪
check-in|регистрация|✅
check-out|выезд|🚪
tour|экскурсия|🚶
adventure|приключение|⛰️
explore|исследовать|🔍
abroad|за границей|🌍
local|местный|🏠
scenic|живописный|🌄
crowded|многолюдный|👥
remote|отдалённый|🏝️
gate|выход на посадку|🚪
aisle|проход|💺
window seat|место у окна|🪟
turbulence|турбулентность|😬
transit|транзит|🔁
travel insurance|страховка|🛡️
backpacker|бэкпекер|🎒
road trip|автопутешествие|🚗
landmark|достопримечательность|🗽
duty-free|дьюти-фри|🛍️
boarding|посадка|🚶
seatbelt|ремень безопасности|🔒
cabin crew|бортпроводники|👩‍✈️
immigration|иммиграционный контроль|🛂
travel adapter|переходник|🔌
carry-on|ручная кладь|👜
checked bag|сдаваемый багаж|🧳
lost luggage|утерянный багаж|😰
bucket list|список желаний|✅
wanderlust|тяга к странствиям|✈️
city pass|городской проездной|🎫
time zone|часовой пояс|🕒
homestay|проживание в семье|🏡
scenic route|живописный маршрут|🛣️
lounge|зал ожидания|🛋️
baggage claim|выдача багажа|🛄
security check|досмотр|🛡️
overbooked|переполненный рейс|😤
stopover|остановка|⏸️
railway|железная дорога|🚆
subway|метро|🚇
taxi|такси|🚕
rideshare|каршеринг|🚗
passport control|паспортный контроль|🛂
travel blog|тревел-блог|✍️
guidebook map|карта в путеводителе|🗺️
travel buddy|спутник|🤝
peak season|высокий сезон|☀️
off-season|несезон|🍂
resort|курорт|🏖️
beach|пляж|🏖️
mountain|гора|🏔️
hiking|поход|🥾
camping|кемпинг|⛺
museum pass|музейный билет|🎫
local cuisine|местная кухня|🍜
street food|уличная еда|🌮
tipping|чаевые|💵
travel ban|запрет на въезд|🚫

Business
meeting|встреча|📋
deadline|срок|⏰
salary|зарплата|💰
contract|контракт|📜
client|клиент|🤝
budget|бюджет|💵
profit|прибыль|📈
loss|убыток|📉
invoice|счёт|🧾
negotiate|вести переговоры|🗣️
presentation|презентация|📊
colleague|коллега|👥
manager|менеджер|👔
promotion|повышение|🚀
resign|уволиться|📤
hire|нанимать|📥
interview|собеседование|🎤
resume|резюме|📄
brand|бренд|✨
market|рынок|🏪
strategy|стратегия|♟️
investment|инвестиция|💎
stakeholder|стейкхолдер|🧩
revenue|выручка|💹
expense|расход|💸
shareholder|акционер|🏢
startup|стартап|🚀
entrepreneur|предприниматель|💡
freelance|фриланс|💻
overtime|сверхурочные|🌙
remote work|удалённая работа|🏠
productivity|продуктивность|⚡
efficiency|эффективность|🎯
feedback|обратная связь|💬
performance|результативность|🏅
goal|цель|🎯
milestone|веха|🏁
agenda|повестка|📝
conference|конференция|🏛️
networking|нетворкинг|🔗
pitch|питч|📣
proposal|предложение|📑
partnership|партнёрство|🤝
merger|слияние|🔀
competitor|конкурент|🥊
supply chain|цепочка поставок|🚚
logistics|логистика|📦
inventory|запасы|📦
wholesale|опт|🏬
retail|розница|🛍️
customer service|обслуживание клиентов|🎧
loyalty|лояльность|💚
advertising|реклама|📢
campaign|кампания|🎬
cash flow|денежный поток|💵
forecast|прогноз|🔮
benchmark|ориентир|📏
outsourcing|аутсорсинг|🌐
headquarters|штаб-квартира|🏢
branch|филиал|🌳
franchise|франшиза|🏪
patent|патент|©️
compliance|соответствие нормам|✅
risk|риск|⚠️
asset|актив|🏦
equity|капитал|💎
dividend|дивиденд|💵
interest rate|процентная ставка|📉
loan|кредит|💳
mortgage|ипотека|🏠
tax|налог|🧾
audit|аудит|🔍
accountant|бухгалтер|🧮
payroll|зарплатная ведомость|💶
bonus|премия|🎁
commission|комиссия|💸
quota|квота|📈
lead|лид|🧲
conversion|конверсия|🔄
branding|брендинг|🎨
slogan|слоган|💬
workshop|воркшоп|🛠️
webinar|вебинар|💻
negotiation|переговоры|🗣️
supplier|поставщик|📦
buyer|покупатель|🛒
margin|маржа|📊
overhead|накладные расходы|💼
turnover|оборот|🔁
bankruptcy|банкротство|💥
venture capital|венчурный капитал|💰
soft skills|мягкие навыки|🧠
hard skills|профессиональные навыки|🛠️
onboarding|адаптация сотрудника|🚪
layoff|сокращение|📉
internship|стажировка|💼

Medical
doctor|врач|👨‍⚕️
nurse|медсестра|👩‍⚕️
hospital|больница|🏥
clinic|клиника|🏨
patient|пациент|🤒
symptom|симптом|🌡️
diagnosis|диагноз|🩺
prescription|рецепт|💊
medicine|лекарство|💊
pharmacy|аптека|⚕️
allergy|аллергия|🤧
fever|температура|🤒
cough|кашель|😷
headache|головная боль|🤕
injury|травма|🩹
surgery|операция|🔪
vaccine|вакцина|💉
infection|инфекция|🦠
virus|вирус|🦠
bacteria|бактерии|🔬
blood pressure|давление|❤️
heartbeat|сердцебиение|💓
x-ray|рентген|🦴
appointment|запись к врачу|📅
emergency|неотложка|🚨
ambulance|скорая|🚑
bandage|бинт|🩹
pain|боль|😣
recovery|выздоровление|🌱
therapy|терапия|🧘
mental health|психическое здоровье|🧠
anxiety|тревожность|😰
depression|депрессия|🌧️
nutrition|питание|🥗
vitamin|витамин|🍊
immune system|иммунитет|🛡️
chronic|хронический|⏳
acute|острый|⚡
side effect|побочный эффект|⚠️
dosage|дозировка|📏
antibiotic|антибиотик|💊
inflammation|воспаление|🔥
fracture|перелом|🦴
sprain|растяжение|🦵
bruise|синяк|🟣
blood test|анализ крови|🩸
ultrasound|УЗИ|📡
specialist|специалист|👨‍🔬
surgeon|хирург|⚕️
dentist|стоматолог|🦷
pregnancy|беременность|🤰
first aid|первая помощь|🆘
stethoscope|стетоскоп|🩺
wheelchair|инвалидная коляска|♿
nausea|тошнота|🤢
dizziness|головокружение|💫
insomnia|бессонница|😴
fatigue|усталость|😮‍💨
hydration|гидратация|💧
diabetes|диабет|🩸
asthma|астма|😮‍💨
migraine|мигрень|💥
health insurance|медстраховка|🧾
checkup|осмотр|✅
prevention|профилактика|🛡️
contagious|заразный|🦠
quarantine|карантин|🚧
pandemic|пандемия|🌍
hygiene|гигиена|🧼
sanitizer|санитайзер|🧴
mask|маска|😷
wound|рана|🩸
heal|заживать|🌿
outbreak|вспышка|📈
screening|скрининг|🔬
pulse|пульс|💓
temperature|температура тела|🌡️
prescription refill|повтор рецепта|🔁
waiting room|приёмная|🪑
referral|направление|📨
immune|иммунный|🛡️
scar|шрам|〰️
rash|сыпь|🔴
crutches|костыли|🩼
protein|белок|🥩
calorie|калория|🔥
cholesterol|холестерин|🫀
pneumonia|пневмония|🫁
optician|окулист|👓
lab result|результат анализа|🧪
painkiller|обезболивающее|💊
sneeze|чихать|🤧
sore throat|боль в горле|throat
bruise cream|мазь от синяков|🧴

Technology
computer|компьютер|💻
laptop|ноутбук|💻
smartphone|смартфон|📱
tablet|планшет|📲
software|программное обеспечение|💿
hardware|аппаратное обеспечение|🔧
app|приложение|📦
website|сайт|🌐
browser|браузер|🌍
password|пароль|🔑
username|имя пользователя|👤
download|скачать|⬇️
upload|загрузить|⬆️
cloud|облако|☁️
server|сервер|🖥️
database|база данных|🗄️
algorithm|алгоритм|🧮
artificial intelligence|искусственный интеллект|🤖
machine learning|машинное обучение|🧠
code|код|👨‍💻
bug|баг|🐛
debug|отлаживать|🔍
update|обновление|🔄
install|установить|📥
wifi|вайфай|📶
bluetooth|блютуз|🔵
battery|батарея|🔋
charger|зарядка|🔌
screen|экран|🖥️
keyboard|клавиатура|⌨️
mouse|мышь|🖱️
headphones|наушники|🎧
notification|уведомление|🔔
privacy|конфиденциальность|🔒
encryption|шифрование|🔐
firewall|файрвол|🧱
malware|вредоносное ПО|☠️
phishing|фишинг|🎣
API|API|🔌
framework|фреймворк|🧱
repository|репозиторий|📁
commit|коммит|💾
deploy|деплой|🚀
frontend|фронтенд|🎨
backend|бэкенд|⚙️
responsive|адаптивный|📱
user interface|интерфейс|🖱️
user experience|пользовательский опыт|✨
bandwidth|пропускная способность|📡
latency|задержка|⏱️
cache|кэш|⚡
cookie|cookie|🍪
domain|домен|🌍
hosting|хостинг|🖥️
open source|открытый код|💚
gadget|гаджет|⌚
drone|дрон|🛸
virtual reality|виртуальная реальность|🥽
blockchain|блокчейн|⛓️
cryptocurrency|криптовалюта|🪙
robot|робот|🤖
sensor|датчик|📡
processor|процессор|🧠
storage|хранилище|🗄️
streaming|стриминг|📺
podcast|подкаст|🎙️
hashtag|хештег|#️⃣
dark mode|тёмная тема|🌙
screenshot|скриншот|📸
shortcut|горячая клавиша|⌨️
plugin|плагин|🧩
beta|бета-версия|🧪
two-factor authentication|двухфакторная аутентификация|🔐
pixel|пиксель|🟦
resolution|разрешение|🖼️
fullscreen|полный экран|🖥️
scroll|прокрутка|📜
click|клик|🖱️
swipe|свайп|👆
backup|резервная копия|💾
sync|синхронизация|🔄
offline|офлайн|📴
online|онлайн|🟢
search engine|поисковик|🔎
social media|соцсети|📱
inbox|входящие|📥
spam|спам|🚫
attachment|вложение|📎
spreadsheet|таблица|📊
presentation slide|слайд|📽️
operating system|операционная система|💻
driver|драйвер|🧰
firmware|прошивка|⚙️
neural network|нейросеть|🧬
chatbot|чат-бот|🤖
prompt|промпт|💬

Daily English
hello|привет|👋
goodbye|пока|👋
please|пожалуйста|🙏
thanks|спасибо|😊
sorry|извини|😔
excuse me|простите|🙋
breakfast|завтрак|🍳
lunch|обед|🥗
dinner|ужин|🍽️
hungry|голодный|😋
thirsty|хочет пить|🥤
tired|усталый|😩
happy|счастливый|😄
sad|грустный|😢
angry|злой|😠
busy|занятый|📅
weather|погода|⛅
sunny|солнечно|☀️
rainy|дождливо|🌧️
cloudy|облачно|☁️
windy|ветрено|💨
snow|снег|❄️
hot|жарко|🔥
cold|холодно|🥶
family|семья|👨‍👩‍👧‍👦
friend|друг|🤝
neighbor|сосед|🏠
kitchen|кухня|🍳
bathroom|ванная|🚿
bedroom|спальня|🛏️
supermarket|супермаркет|🏪
receipt|чек|🧾
cash|наличные|💵
price|цена|🏷️
cheap|дешёвый|💸
expensive|дорогой|💎
discount|скидка|🏷️
queue|очередь|🧍
hobby|хобби|🎨
weekend|выходные|🎉
morning|утро|🌅
evening|вечер|🌇
yesterday|вчера|⏪
today|сегодня|📍
tomorrow|завтра|⏩
always|всегда|♾️
never|никогда|🚫
sometimes|иногда|🔀
often|часто|🔁
usually|обычно|🆗
early|рано|⏰
late|поздно|🕐
hurry|спешить|🏃
wait|ждать|⏳
help|помощь|🆘
problem|проблема|❗
solution|решение|💡
idea|идея|💭
plan|план|📝
habit|привычка|🔄
chores|домашние дела|🧹
laundry|стирка|👕
umbrella|зонт|☂️
wallet|кошелёк|👛
keys|ключи|🔑
coffee|кофе|☕
tea|чай|🍵
water|вода|💧
bread|хлеб|🍞
cheese|сыр|🧀
fruit|фрукты|🍎
vegetable|овощ|🥦
restaurant|ресторан|🍽️
menu|меню|📜
delicious|вкусно|😋
spicy|острый|🌶️
sweet|сладкий|🍭
traffic jam|пробка|🚗
pedestrian|пешеход|🚶
crosswalk|пешеходный переход|🚸
alarm clock|будильник|⏰
shower|душ|🚿
pillow|подушка|🛏️
candle|свеча|🕯️
phone call|звонок|📞
text message|смс|💬
grocery|продукты|🛒
mirror|зеркало|🪞
toothbrush|зубная щётка|🪥
blanket|одеяло|🛏️
juice|сок|🧃
butter|масло|🧈
egg|яйцо|🥚
sugar|сахар|🍬
salt|соль|🧂
bill|счёт|🧾
tip|чаевые|💵
sour|кислый|🍋
bitter|горький|☕
afternoon|день|☀️
night|ночь|🌙
free|свободный|🆓
warm|тепло|🌤️
sale|распродажа|🛍️
weekday|будний день|📆
routine|рутина|📆
trash|мусор|🗑️
living room|гостиная|🛋️

University
lecture|лекция|🎓
seminar|семинар|💬
assignment|задание|📝
essay|эссе|📄
thesis|диплом|📘
research|исследование|🔬
professor|профессор|👨‍🏫
student|студент|🎒
campus|кампус|🏫
dormitory|общежитие|🏠
scholarship|стипендия|💰
tuition|плата за обучение|💳
degree|степень|🎓
bachelor|бакалавр|📘
master|магистр|📕
exam|экзамен|📝
quiz|тест|❓
midterm|промежуточный экзамен|📆
finals|сессия|📚
grade|оценка|🅰️
GPA|средний балл|📊
syllabus|программа курса|📋
plagiarism|плагиат|🚫
citation|цитирование|🔗
bibliography|библиография|📚
laboratory|лаборатория|🧪
experiment|эксперимент|⚗️
hypothesis|гипотеза|💭
theory|теория|📖
analysis|анализ|🔎
argument|аргумент|⚖️
evidence|доказательство|📎
critical thinking|критическое мышление|🧠
group project|групповой проект|👥
peer review|рецензирование|👀
office hours|часы консультаций|🕐
advisor|научный руководитель|🧑‍🏫
major|специальность|🎯
minor|доп. специализация|📌
elective|факультатив|✨
enrollment|зачисление|📝
graduate|выпускник|🎓
alumni|выпускники|👥
library|библиотека|📚
textbook|учебник|📖
attendance|посещаемость|✅
absence|отсутствие|❌
exchange program|программа обмена|🌍
dissertation|диссертация|📕
abstract|аннотация|📄
methodology|методология|🧭
findings|результаты|📌
conclusion|заключение|🏁
oral exam|устный экзамен|🗣️
retake|пересдача|🔁
dean|декан|🏛️
faculty|факультет|🏫
curriculum|учебный план|🧭
semester|семестр|📅
credit|зачётная единица|⭐
transcript|выписка оценок|📄
study group|учебная группа|👥
note-taking|конспектирование|✍️
cram|зубрить|😵
all-nighter|бессонная ночь|🌙
PhD|аспирантура|📙
compulsory|обязательный|❗
dropout|отчисление|🚪
highlighter|маркер|🟨
footnote|сноска|⬇️
seminar paper|семинарская работа|📝
pass|сдать|✅
fail|провалить|❌
recommendation letter|рекомендательное письмо|✉️
orientation|ознакомительная встреча|🧭
tuition fee|стоимость обучения|💳
lab report|лабораторный отчёт|🧪
field study|полевое исследование|🌿
study abroad|учёба за рубежом|✈️

Grammar
noun|существительное|📦
verb|глагол|🏃
adjective|прилагательное|🎨
adverb|наречие|⏩
pronoun|местоимение|👤
preposition|предлог|➡️
conjunction|союз|🔗
article|артикль|🅰️
clause|придаточное|🧩
sentence|предложение|💬
phrase|фраза|🗣️
tense|время|⏰
subject|подлежащее|🧍
object|дополнение|🎯
plural|множественное число|👥
singular|единственное число|1️⃣
irregular verb|неправильный глагол|🌀
regular verb|правильный глагол|✅
infinitive|инфинитив|♾️
gerund|герундий|🌀
participle|причастие|📎
modal verb|модальный глагол|🎛️
auxiliary verb|вспомогательный глагол|🛠️
passive voice|пассивный залог|🔄
active voice|активный залог|▶️
conditional|условное предложение|❓
relative clause|относительное придаточное|🔗
reported speech|косвенная речь|📢
question tag|разделительный вопрос|❔
comparative|сравнительная степень|📊
superlative|превосходная степень|🏆
countable|исчисляемое|🔢
uncountable|неисчисляемое|🌊
collocation|коллокация|🤝
idiom|идиома|🎭
phrasal verb|фразовый глагол|🧩
prefix|приставка|⬅️
suffix|суффикс|➡️
synonym|синоним|🟢
antonym|антоним|🔴
punctuation|пунктуация|❗
comma|запятая|,
apostrophe|апостроф|'
word order|порядок слов|🔀
subject-verb agreement|согласование|✅
formal|формальный|👔
informal|неформальный|😊
slang|сленг|😎
accent|акцент|🎙️
syllable|слог|🔤
vowel|гласный|🅰️
consonant|согласный|🅱️
spelling|правописание|✏️
pronunciation|произношение|👄
grammar rule|правило грамматики|📏
exception|исключение|⚠️
determiner|определитель|📌
quantifier|квантификатор|🔢
homophone|омофон|🔊
intonation|интонация|📈
register|регистр речи|🎩
dialect|диалект|🗺️
direct speech|прямая речь|💬
aspect|вид глагола|🔄
predicate|сказуемое|⚡
root|корень слова|🌱
capital letter|заглавная буква|🔠
filler word|слово-паразит|🗣️
example sentence|пример предложения|💡
zero article|нулевой артикль|∅
present perfect|Present Perfect|🔗
past simple|Past Simple|📅
future continuous|Future Continuous|⏳

Verbs
be|быть|✨
have|иметь|🤲
do|делать|🛠️
say|сказать|💬
go|идти|🚶
get|получать|📥
make|создавать|🛠️
know|знать|🧠
think|думать|💭
take|брать|🤲
see|видеть|👀
come|приходить|➡️
want|хотеть|💖
look|смотреть|👀
use|использовать|🔧
find|находить|🔎
give|давать|🎁
tell|рассказывать|🗣️
work|работать|💼
call|звонить|📞
try|пытаться|💪
ask|спрашивать|❓
need|нуждаться|🆘
feel|чувствовать|💓
become|становиться|🌱
leave|уходить|🚪
put|класть|📦
mean|значить|💡
keep|хранить|📦
begin|начинать|▶️
help|помогать|🤝
talk|говорить|💬
start|начинать|🚀
show|показывать|👆
hear|слышать|👂
play|играть|🎮
run|бегать|🏃
live|жить|🏠
believe|верить|🙏
bring|приносить|📦
happen|случаться|🎲
write|писать|✍️
sit|сидеть|🪑
stand|стоять|🧍
lose|терять|😢
pay|платить|💳
meet|встречать|🤝
include|включать|➕
continue|продолжать|➡️
learn|учить|📚
change|менять|🔄
understand|понимать|💡
watch|смотреть|📺
follow|следовать|👣
stop|останавливать|🛑
create|создавать|✨
speak|говорить|🗣️
read|читать|📖
allow|разрешать|✅
add|добавлять|➕
spend|тратить|💸
grow|расти|🌱
open|открывать|📂
walk|гулять|🚶
win|побеждать|🏆
offer|предлагать|🎁
remember|помнить|🧠
love|любить|❤️
consider|рассматривать|🤔
buy|покупать|🛒
wait|ждать|⏳
send|отправлять|📤
expect|ожидать|👀
build|строить|🧱
stay|оставаться|🏠
fall|падать|📉
cut|резать|✂️
reach|достигать|🎯
suggest|предлагать|💡
raise|поднимать|⬆️
pass|проходить|✅
sell|продавать|🏷️
require|требовать|❗
report|сообщать|📰
decide|решать|✅
pull|тянуть|🧲
choose|выбирать|☝️
improve|улучшать|📈
enjoy|наслаждаться|😄
prefer|предпочитать|⭐
forget|забывать|🫥
hope|надеяться|🌈
promise|обещать|🤞
agree|соглашаться|🤝
disagree|не соглашаться|🙅
explain|объяснять|💡
describe|описывать|📝
compare|сравнивать|⚖️
prepare|готовить|🎒
practice|практиковать|🏋️
travel|путешествовать|✈️
cook|готовить еду|👨‍🍳
clean|убирать|🧹
drive|водить|🚗
fly|летать|🛫
swim|плавать|🏊
sing|петь|🎤
dance|танцевать|💃
laugh|смеяться|😂
cry|плакать|😢
sleep|спать|😴
wake|просыпаться|☀️
dream|мечтать|💭
smile|улыбаться|😊

Phrasal Verbs
look forward to|с нетерпением ждать|✨
give up|сдаваться|🏳️
put off|откладывать|⏳
take off|взлетать / снимать|✈️
get over|оправиться|💪
look after|присматривать|👀
look for|искать|🔎
look up|искать в словаре|📘
turn on|включать|🔛
turn off|выключать|📴
turn up|появиться|🔊
turn down|отклонить|🔇
pick up|поднять / заехать|📦
drop off|высадить|🚪
run out of|закончиться|🚫
come across|случайно встретить|🎲
find out|узнать|🔍
figure out|разобраться|🧩
work out|получиться / тренироваться|🏋️
break down|сломаться|🛠️
break up|расстаться|💔
bring up|поднять тему|💬
call off|отменить|❌
carry on|продолжать|➡️
catch up|догнать|🏃
check in|зарегистрироваться|✅
check out|выехать / глянуть|👀
come up with|придумать|💡
cut down on|сократить|✂️
end up|оказаться в итоге|🏁
fill in|заполнить|📝
get along|ладить|🤝
get away|уехать отдохнуть|🏝️
get back|вернуться|↩️
get by|сводить концы с концами|💰
get up|вставать|⏰
give in|уступить|🏳️
go on|продолжать|▶️
go over|повторить|📑
grow up|вырастать|🌱
hang out|тусоваться|😎
hold on|подожди|✋
keep on|продолжать|🔁
keep up|успевать|⚡
let down|подвести|😞
look into|расследовать|🕵️
make up|помириться|🕊️
pass out|потерять сознание|😵
pay back|вернуть долг|💵
point out|указать|👉
put on|надеть|👕
put up with|терпеть|😤
run into|случайно встретить|👋
set up|настроить|⚙️
show up|появиться|👋
shut down|выключить|🛑
slow down|замедлиться|🐢
speak up|высказаться|📢
take after|быть похожим|👪
take care of|заботиться|💚
take part in|участвовать|🙋
think over|обдумать|🤔
throw away|выбросить|🗑️
try on|примерить|👗
wake up|просыпаться|☀️
warm up|разминаться|🔥
watch out|осторожно|⚠️
write down|записать|✍️
calm down|успокоиться|😌
cheer up|взбодриться|😄
clean up|убрать|🧹
dress up|нарядиться|👗
eat out|есть вне дома|🍽️
go back|вернуться|⬅️
hand in|сдать работу|📥
hand out|раздавать|📤
log in|войти|🔑
log out|выйти|🚪
mix up|перепутать|🔀
sort out|разобраться|🗂️
break into|ворваться|🚪
fall apart|развалиться|💥
get in|войти|🚪
get out|выйти|🚪
sit down|сесть|🪑
stand up|встать|🧍
zip up|застегнуть молнию|🤐
zoom in|приблизить|🔍
wear out|износить|🧦
pass away|скончаться|🕊️
fill out|заполнить форму|📄
do over|переделать|🔁
go through|пройти через|📘
look out|осторожно|👀
move on|двигаться дальше|➡️
catch on|входить в моду / понимать|💡
drop by|зайти ненадолго|🚪
kick off|начать|⚽
wrap up|завершить|🎁
sign up|записаться|✍️
back up|поддержать / сделать бэкап|💾
blow up|взорваться / разозлиться|💥
burn out|выгореть|🔥
chip in|скинуться|🪙

Idioms
piece of cake|проще простого|🍰
break the ice|растопить лёд|🧊
hit the books|сесть за учёбу|📚
under the weather|неважно себя чувствовать|🤒
once in a blue moon|очень редко|🔵
cost an arm and a leg|очень дорого|💸
spill the beans|выдать секрет|🫘
bite the bullet|собраться с духом|😬
hit the nail on the head|попасть в точку|🔨
the ball is in your court|очередь за тобой|🏀
burn the midnight oil|сидеть допоздна|🕯️
call it a day|на сегодня хватит|🏁
cut corners|халтурить|✂️
get out of hand|выйти из-под контроля|🙌
hang in there|держись|💪
let the cat out of the bag|выдать секрет|🐱
miss the boat|упустить шанс|⛵
on the same page|на одной волне|📄
pull someone's leg|прикалываться|🦵
speak of the devil|лёгок на помине|😈
time flies|время летит|⏰
when pigs fly|когда рак на горе свистнет|🐷
a blessing in disguise|нет худа без добра|🎁
beat around the bush|ходить вокруг да около|🌿
better late than never|лучше поздно чем никогда|⏰
break a leg|ни пуха ни пера|🦵
by the book|строго по правилам|📘
cry over spilt milk|горевать о прошлом|🥛
every cloud has a silver lining|нет худа без добра|☁️
get cold feet|струсить|🦶
go the extra mile|сделать больше обычного|🏃
hit the sack|пойти спать|🛏️
in a nutshell|в двух словах|🥜
jump on the bandwagon|присоединиться к тренду|🚌
keep your chin up|не вешай нос|😊
kill two birds with one stone|убить двух зайцев|🐦
make a long story short|короче говоря|📖
no pain no gain|без труда не выловишь рыбку|💪
on thin ice|на тонком льду|🧊
out of the blue|как снег на голову|💙
play it by ear|действовать по ситуации|👂
pull yourself together|возьми себя в руки|🧘
see eye to eye|сходиться во мнениях|👀
sit on the fence|не определиться|🚧
take it with a grain of salt|относиться скептически|🧂
the elephant in the room|очевидная проблема|🐘
through thick and thin|и в горе и в радости|💪
throw in the towel|сдаться|🏳️
up in the air|в подвешенном состоянии|☁️
wrap your head around|уложить в голове|🧠
back to square one|снова на старте|1️⃣
down to earth|приземлённый|🌍
caught red-handed|пойман с поличным|✋
all ears|весь во внимании|👂
a stone's throw|рукой подать|🪨
against the clock|наперегонки со временем|⏱️
barking up the wrong tree|обвинять не того|🌳
burn bridges|сжигать мосты|🔥
feel under the weather|приболеть|🤒
rain on someone's parade|испортить праздник|🌧️
steal someone's thunder|перехватить лавры|⚡
wear your heart on your sleeve|не скрывать чувств|❤️
zero in on|сосредоточиться на|🎯
you hit the jackpot|сорвал куш|🎰
a dime a dozen|как грязи|🪙
bite off more than you can chew|хватить лишнего|😬
cross that bridge when you come to it|решим по ходу|🌉
cut someone some slack|дать послабление|🧵
easy does it|полегче|🐢
get a kick out of|кайфовать от|😄
it takes two to tango|нужны двое|💃
let sleeping dogs lie|не буди лихо|🐕
curiosity killed the cat|любопытство до добра не доведёт|🐱
the best of both worlds|лучшее из обоих миров|🌍
under one's belt|в активе|🥋
when in Rome|в чужой монастырь|🏛️
in hot water|в беде|🥵
once bitten twice shy|обжёгшись на молоке|🥛
actions speak louder than words|дела важнее слов|📢
add fuel to the fire|подлить масла в огонь|🔥
at the drop of a hat|мгновенно|🎩
bark is worse than bite|собака лает|🐕
beat a dead horse|толочь воду в ступе|🐴
bend over backwards|из кожи вон|🤸
bite your tongue|прикусить язык|👅
blow off steam|выпустить пар|💨
born with a silver spoon|родиться в рубашке|🥄
break the bank|разориться|🏦
butter someone up|подлизываться|🧈
call a spade a spade|называть вещи своими именами|♠️
can't judge a book by its cover|не суди по обложке|📕

IELTS
analyze|анализировать|🔎
significant|значительный|⭐
furthermore|более того|➕
however|однако|↔️
therefore|следовательно|➡️
whereas|в то время как|⚖️
approximately|примерно|≈
indicate|указывать|👉
demonstrate|демонстрировать|📊
evaluate|оценивать|📏
conclude|делать вывод|🏁
contrast|противопоставлять|⚖️
illustrate|иллюстрировать|🖼️
emphasize|подчёркивать|❗
imply|подразумевать|💭
trend|тенденция|📈
fluctuate|колебаться|📉
peak|пик|⛰️
decline|снижение|📉
increase|рост|📈
decrease|уменьшение|📉
stable|стабильный|➖
proportion|доля|🥧
percentage|процент|%
majority|большинство|👥
minority|меньшинство|👤
factor|фактор|🧩
impact|влияние|💥
consequence|последствие|🎯
cause|причина|🔗
effect|следствие|➡️
benefit|польза|✅
drawback|недостаток|⚠️
advantage|преимущество|👍
disadvantage|минус|👎
perspective|точка зрения|👁️
approach|подход|🧭
method|метод|🛠️
process|процесс|⚙️
outcome|результат|🏁
reliable|надёжный|🔒
valid|обоснованный|✅
accurate|точный|🎯
relevant|релевантный|📌
crucial|ключевой|🔑
essential|необходимый|❗
substantial|существенный|📦
urban|городской|🏙️
rural|сельский|🌾
environment|окружающая среда|🌍
pollution|загрязнение|🏭
sustainable|устойчивый|♻️
renewable|возобновляемый|🌱
consumption|потребление|🛒
production|производство|🏭
infrastructure|инфраструктура|🛣️
housing|жильё|🏠
education|образование|🎓
healthcare|здравоохранение|🏥
employment|занятость|💼
unemployment|безработица|📉
poverty|бедность|😔
inequality|неравенство|⚖️
globalization|глобализация|🌐
innovation|инновация|💡
generation|поколение|👨‍👩‍👧
attitude|отношение|😊
behavior|поведение|🧍
challenge|вызов|⛰️
opportunity|возможность|🚪
recommendation|рекомендация|📌
overview|обзор|🗺️
summary|краткое изложение|🧾
cohesion|связность|🔗
coherence|логичность|🧠
fluency|беглость|🗣️
band score|балл IELTS|📊
negligible|ничтожный|🔹
transport|транспорт|🚌
culture|культура|🎭
tradition|традиция|🏺
technology|символ технологий|💻
communication|общение|💬
assess|оценивать|🧾
compare|сравнивать|📊
suggest|предполагать|💡
evidence|доказательства|📎
paragraph|абзац|📄
lexical resource|словарный запас|📚
furthermore moreover|более того|➕
in contrast|напротив|↔️
as a result|в результате|➡️
on the other hand|с другой стороны|🤚
for instance|например|💡
in addition|вдобавок|➕
nevertheless|тем не менее|🧱
consequently|следовательно|➡️
notably|в частности|⭐
primarily|в первую очередь|1️⃣
ultimately|в конечном счёте|🏁
widespread|широко распространённый|🌐
controversial|спорный|🔥
inevitable|неизбежный|⏳
feasible|осуществимый|✅
detrimental|вредный|☠️
beneficial|полезный|💚

TOEFL
academic|академический|🎓
comprehension|понимание|🧠
passage|отрывок|📄
inference|вывод|💭
detail|деталь|🔎
main idea|главная идея|💡
supporting evidence|подтверждающие факты|📎
rhetoric|риторика|🗣️
persuade|убеждать|🎯
argue|аргументировать|⚖️
claim|утверждение|📣
counterargument|контраргумент|↔️
refute|опровергать|❌
summarize|суммировать|🧾
paraphrase|перефразировать|🔄
synthesize|синтезировать|🧩
integrate|объединять|🔗
cite|цитировать|🔗
source|источник|📚
author|автор|✍️
journal|журнал|📰
article|статья|📄
introduction|введение|▶️
body paragraph|основной абзац|📄
thesis statement|тезис|📌
topic sentence|тематическое предложение|🧵
transition|переход|➡️
listening lecture|лекция на аудирование|🎧
campus conversation|диалог в кампусе|🗣️
outline|план|📋
draft|черновик|📝
revise|редактировать|✏️
edit|править|🖊️
proofread|вычитывать|👀
score|балл|📊
rubric|критерии оценки|📏
independent task|независимое задание|🧍
integrated task|интегрированное задание|🧩
speaking prompt|задание Speaking|🎤
writing prompt|задание Writing|✍️
time limit|лимит времени|⏱️
multiple choice|выбор ответа|🔤
vocabulary in context|слова в контексте|📘
registrar|учебная часть|🏢
financial aid|финансовая помощь|💵
roommate|сосед по комнате|🛏️
survey|опрос|📋
sample|выборка|🧪
variable|переменная|🔢
data|данные|📊
statistic|статистика|📈
chart|диаграмма|📊
graph|график|📉
table|таблица|▦
figure|иллюстрация|🖼️
caption|подпись|✏️
appendix|приложение|📎
glossary|глоссарий|📗
index|указатель|📑
academic integrity|академическая честность|⚖️
extension|продление|📅
prerequisite|пререквизит|🔗
discipline|дисциплина|📘
publisher|издатель|🏢
cohesive device|средство связности|🔗
discourse|дискурс|💬
note taking|конспектирование|✍️
plagiarism checker|проверка на плагиат|🕵️
office hour|час консультаций|🕐
dorm|общага|🏠
lab report|лабораторный отчёт|🧪
field study|полевое исследование|🌿
tuition fee|плата за обучение|💳
orientation week|неделя адаптации|🧭
reading section|секция Reading|📖
listening section|секция Listening|🎧
speaking section|секция Speaking|🗣️
writing section|секция Writing|✍️
academic word|академическое слово|📚
context clue|подсказка из контекста|🔎
skim|просматривать|👀
scan|сканировать текст|⚡
annotate|делать пометки|✏️
highlight|выделять|🟨
reference|ссылка|🔗
footnote|сноска|⬇️
validity|валидность|✅
reliability|надёжность|🔒
bias|предвзятость|⚖️
assumption|допущение|💭
implication|следствие|➡️
perspective shift|смена точки зрения|🔄
lecture notes|конспект лекции|📝
study strategy|стратегия учёбы|🧭
practice test|пробный тест|🧪
timed practice|практика на время|⏱️
score report|отчёт о баллах|📊
section score|балл за секцию|📈
raw score|сырой балл|🔢
scaled score|шкалированный балл|📏
test center|центр тестирования|🏢
registration|регистрация на тест|📝
identification|удостоверение личности|🪪
`;

function parse() {
  /** @type {Record<string, [string,string,string][]>} */
  const map = Object.fromEntries(cats.map((c) => [c, []]));
  let current = null;
  for (const line of RAW.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (cats.includes(t)) {
      current = t;
      continue;
    }
    if (!current) continue;
    const [word, ru, emoji = "✨"] = t.split("|");
    if (!word || !ru) continue;
    map[current].push([word.trim(), ru.trim(), emoji.trim()]);
  }
  return map;
}

function example(word, cat) {
  const t = {
    Travel: `I learned "${word}" while traveling.`,
    Business: `In meetings people often say "${word}".`,
    Medical: `The doctor explained the word "${word}".`,
    Technology: `"${word}" is common in tech English.`,
    "Daily English": `I use "${word}" in daily conversations.`,
    University: `Students need the word "${word}" on campus.`,
    Grammar: `"${word}" is a useful grammar term.`,
    Verbs: `Practice the verb "${word}" in sentences.`,
    "Phrasal Verbs": `Can you use "${word}" naturally?`,
    Idioms: `Native speakers say "${word}".`,
    IELTS: `"${word}" is useful for IELTS Writing.`,
    TOEFL: `TOEFL passages may include "${word}".`,
  };
  return t[cat];
}

function exampleRu(word, ru) {
  return `Запомни: «${word}» — ${ru}.`;
}

function slug(cat) {
  return cat.toLowerCase().replace(/\s+/g, "-");
}

const map = parse();
const seen = new Set();
const words = [];

for (const cat of cats) {
  let i = 0;
  for (const [word, ru, emoji] of map[cat] || []) {
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    i += 1;
    const diff = word.length > 14 || word.includes(" ") ? 3 : word.length > 8 ? 2 : 1;
    words.push({
      id: `w-${slug(cat)}-${String(i).padStart(3, "0")}`,
      word,
      phonetic: `/${key}/`,
      translation: ru,
      category: cat,
      difficulty: Math.min(5, diff),
      example: example(word, cat),
      exampleTranslation: exampleRu(word, ru),
      synonyms: [],
      antonyms: [],
      imageEmoji: emoji || "✨",
    });
  }
}

// Pad to 1050+ with unique academic/daily fillers if needed
const fillers = [
  ["abundant","обильный","IELTS","🌊"],["accelerate","ускорять","IELTS","⚡"],["accessible","доступный","IELTS","♿"],
  ["accommodate","учитывать","IELTS","🏠"],["accompany","сопровождать","IELTS","👥"],["accomplish","достигать","IELTS","✅"],
  ["accumulate","накапливать","IELTS","📦"],["acknowledge","признавать","IELTS","🤝"],["acquire","приобретать","IELTS","📥"],
  ["adapt","адаптироваться","Verbs","🔄"],["adequate","достаточный","IELTS","👌"],["adjacent","смежный","IELTS","↔️"],
  ["adjust","настраивать","Verbs","⚙️"],["advocate","отстаивать","IELTS","📣"],["aggregate","совокупность","IELTS","📊"],
  ["albeit","хотя","IELTS","↔️"],["allocate","распределять","Business","📦"],["alter","изменять","Verbs","🔧"],
  ["alternative","альтернатива","IELTS","🔀"],["ambiguous","двусмысленный","IELTS","❓"],["amend","править","IELTS","✏️"],
  ["analogy","аналогия","TOEFL","🔗"],["annual","ежегодный","Business","📅"],["anticipate","предвидеть","IELTS","🔮"],
  ["apparent","очевидный","IELTS","👀"],["appreciate","ценить","Verbs","💖"],["arbitrary","произвольный","IELTS","🎲"],
  ["assemble","собирать","Verbs","🧩"],["assert","утверждать","TOEFL","📣"],["assign","назначать","University","📌"],
  ["assist","помогать","Verbs","🤝"],["assume","предполагать","TOEFL","💭"],["assure","уверять","Verbs","✅"],
  ["attach","прикреплять","Verbs","📎"],["attain","достигать","IELTS","🎯"],["attribute","свойство","IELTS","🏷️"],
  ["authority","авторитет","IELTS","⚖️"],["automate","автоматизировать","Technology","🤖"],["available","доступный","Daily English","✅"],
  ["aware","осведомлённый","IELTS","👁️"],["behalf","от имени","Business","🧾"],["bias","предвзятость","TOEFL","⚖️"],
  ["bond","связь","IELTS","🔗"],["brief","краткий","IELTS","⏱️"],["bulk","основная масса","Business","📦"],
  ["capable","способный","IELTS","💪"],["capacity","вместимость","IELTS","📏"],["cease","прекращать","IELTS","🛑"],
  ["channel","канал","Technology","📺"],["chapter","глава","University","📖"],["chemical","химический","Medical","🧪"],
  ["circumstance","обстоятельство","IELTS","🌦️"],["civil","гражданский","IELTS","🏛️"],["clarify","прояснять","Verbs","💡"],
  ["classic","классический","Daily English","🎩"],["coherent","связный","TOEFL","🧠"],["coincide","совпадать","IELTS","🎯"],
  ["collapse","обрушиться","Verbs","💥"],["commence","начинать","IELTS","▶️"],["comment","комментарий","Daily English","💬"],
  ["commodity","товар","Business","📦"],["communicate","общаться","Verbs","🗣️"],["community","сообщество","Daily English","🏘️"],
  ["compatible","совместимый","Technology","🔌"],["compensate","компенсировать","Business","💵"],["compile","составлять","Technology","📚"],
  ["complement","дополнять","Grammar","➕"],["complex","сложный","IELTS","🧩"],["component","компонент","Technology","🧱"],
  ["compose","сочинять","Verbs","🎼"],["compound","сложное слово","Grammar","🧪"],["comprehensive","всесторонний","IELTS","📘"],
  ["comprise","включать","IELTS","📦"],["compute","вычислять","Technology","🧮"],["conceive","задумывать","IELTS","💭"],
  ["concentrate","концентрироваться","Verbs","🎯"],["concept","понятие","University","💡"],["concurrent","одновременный","IELTS","⏱️"],
  ["conduct","проводить","Verbs","🧪"],["confer","присуждать","University","🎓"],["confine","ограничивать","IELTS","🚧"],
  ["confirm","подтверждать","Verbs","✅"],["conflict","конфликт","IELTS","⚔️"],["conform","соответствовать","IELTS","📐"],
  ["consent","согласие","Business","✍️"],["considerable","значительный","IELTS","📦"],["consist","состоять","Verbs","🧱"],
  ["constant","постоянный","IELTS","➖"],["constitute","составлять","IELTS","🧩"],["constrain","ограничивать","IELTS","🔒"],
  ["construct","строить","Verbs","🏗️"],["consult","консультироваться","Business","💬"],["consume","потреблять","Verbs","🛒"],
  ["contact","контакт","Daily English","📞"],["contemporary","современный","IELTS","🕰️"],["context","контекст","Grammar","🧾"],
  ["contradict","противоречить","TOEFL","↔️"],["contrary","противоположный","IELTS","🔄"],["contribute","вносить вклад","Verbs","🎁"],
  ["controversy","полемика","IELTS","🔥"],["convene","созывать","Business","📅"],["converse","беседовать","Verbs","💬"],
  ["convert","преобразовывать","Technology","🔄"],["convince","убеждать","Verbs","🎯"],["cooperate","сотрудничать","Business","🤝"],
  ["coordinate","координировать","Business","🧭"],["core","суть","IELTS","🟢"],["corporate","корпоративный","Business","🏢"],
  ["correspond","соответствовать","IELTS","✉️"],["couple","пара","Daily English","💑"],["credit","кредит","Business","💳"],
  ["criteria","критерии","University","📏"],["cycle","цикл","IELTS","🔁"],["debate","дебаты","University","🗣️"],
  ["decade","десятилетие","IELTS","📅"],["deduce","выводить","TOEFL","🧠"],["define","определять","Grammar","📘"],
  ["definite","определённый","Grammar","🅰️"],["denote","обозначать","Grammar","🏷️"],["deny","отрицать","Verbs","🚫"],
  ["derive","происходить","IELTS","🌱"],["design","дизайн","Technology","🎨"],["despite","несмотря на","Grammar","🧱"],
  ["detect","обнаруживать","Technology","🕵️"],["deviate","отклоняться","IELTS","↪️"],["device","устройство","Technology","📱"],
  ["devote","посвящать","Verbs","❤️"],["differentiate","различать","TOEFL","🔀"],["dimension","измерение","IELTS","📐"],
  ["diminish","уменьшать","IELTS","📉"],["discrete","отдельный","IELTS","🔹"],["displace","вытеснять","IELTS","📦"],
  ["display","отображать","Technology","🖥️"],["dispose","избавляться","Verbs","🗑️"],["distinct","отчётливый","IELTS","✨"],
  ["distort","искажать","IELTS","🪞"],["distribute","распределять","Business","📦"],["diverse","разнообразный","IELTS","🌈"],
  ["document","документ","Business","📄"],["domestic","домашний","IELTS","🏠"],["dominate","доминировать","Verbs","👑"],
  ["drama","драма","Daily English","🎭"],["duration","длительность","IELTS","⏱️"],["dynamic","динамичный","IELTS","⚡"],
  ["economy","экономика","Business","💹"],["element","элемент","IELTS","🧩"],["eliminate","устранять","Verbs","🗑️"],
  ["emerge","появляться","IELTS","🌅"],["emphasis","акцент","Grammar","❗"],["empirical","эмпирический","TOEFL","🔬"],
  ["enable","давать возможность","Technology","✅"],["encounter","столкнуться","Travel","🤝"],["energy","энергия","Daily English","⚡"],
  ["enforce","обеспечивать","Business","⚖️"],["enhance","улучшать","IELTS","✨"],["enormous","огромный","IELTS","🏔️"],
  ["ensure","обеспечивать","Verbs","🔒"],["entity","сущность","IELTS","📦"],["equate","приравнивать","IELTS","="],
  ["equip","оборудовать","Verbs","🛠️"],["equivalent","эквивалент","IELTS","⚖️"],["erode","размывать","IELTS","🌊"],
  ["error","ошибка","Technology","⚠️"],["establish","устанавливать","Verbs","🏗️"],["estate","имущество","Business","🏡"],
  ["estimate","оценивать","Business","📏"],["ethic","этика","University","⚖️"],["ethnic","этнический","IELTS","🌍"],
  ["eventual","конечный","IELTS","🏁"],["excessive","чрезмерный","IELTS","📈"],["exclude","исключать","Verbs","🚫"],
  ["exhibit","экспонат","Travel","🖼️"],["expand","расширять","Verbs","📈"],["expert","эксперт","Business","🧠"],
  ["explicit","явный","IELTS","📌"],["exploit","использовать","IELTS","⚙️"],["export","экспорт","Business","🚢"],
  ["expose","подвергать","IELTS","☀️"],["external","внешний","IELTS","🌐"],["extract","извлекать","Verbs","🧲"],
  ["facilitate","облегчать","IELTS","🛠️"],["factor in","учитывать","IELTS","🧮"],
  ["framework thinking","системное мышление","Business","🧠"],["friendly reminder","дружеское напоминание","Daily English","🔔"],
  ["further reading","дополнительное чтение","University","📚"],["gain insight","получить понимание","IELTS","💡"],
  ["gather data","собирать данные","TOEFL","📊"],["general knowledge","общие знания","Daily English","🧠"],
  ["generate ideas","генерировать идеи","University","💡"],["gentle reminder","мягкое напоминание","Daily English","💌"],
  ["global issue","глобальная проблема","IELTS","🌍"],["good habit","хорошая привычка","Daily English","✅"],
  ["gradual change","постепенное изменение","IELTS","📈"],["great progress","большой прогресс","Daily English","🚀"],
  ["green energy","зелёная энергия","IELTS","🌱"],["group discussion","групповое обсуждение","University","💬"],
  ["growing trend","растущий тренд","IELTS","📈"],["guided practice","управляемая практика","University","🧭"],
  ["handwritten notes","рукописные заметки","University","✍️"],["healthy lifestyle","здоровый образ жизни","Medical","🥗"],
  ["high quality","высокое качество","Business","⭐"],["highly recommended","настоятельно рекомендуется","Daily English","👍"],
  ["historical context","исторический контекст","TOEFL","🏛️"],["human behavior","поведение людей","IELTS","🧍"],
  ["identify problems","выявлять проблемы","Business","🔎"],["immediate action","немедленное действие","Business","⚡"],
  ["important detail","важная деталь","TOEFL","📌"],["improve fluency","улучшать беглость","Daily English","🗣️"],
  ["in detail","подробно","IELTS","🔎"],["in general","в целом","IELTS","🌐"],
  ["in particular","в частности","IELTS","⭐"],["in practice","на практике","University","🛠️"],
  ["in theory","в теории","University","📘"],["increase awareness","повышать осведомлённость","IELTS","👁️"],
  ["independent learning","самостоятельное обучение","University","📚"],["individual difference","индивидуальное различие","TOEFL","🔀"],
  ["industrial growth","промышленный рост","IELTS","🏭"],["informal chat","неформальный разговор","Daily English","😊"],
  ["information overload","информационная перегрузка","Technology","💥"],["initial stage","начальный этап","Business","🌱"],
  ["inner motivation","внутренняя мотивация","Daily English","🔥"],["innovative idea","инновационная идея","Business","💡"],
  ["input data","входные данные","Technology","⌨️"],["insightful comment","глубокий комментарий","University","💬"],
  ["intense practice|интенсивная практика|Daily English|🏋️"],
];

for (const row of fillers) {
  if (!row || !row[0]) continue;
  let [word, ru, cat, emoji] = row;
  if (String(word).includes("|")) {
    const parts = String(word).split("|");
    word = parts[0];
    ru = parts[1];
    cat = parts[2];
    emoji = parts[3] || "✨";
  }
  if (!cats.includes(cat)) continue;
  const key = word.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  const i = words.filter((w) => w.category === cat).length + 1;
  words.push({
    id: `w-${slug(cat)}-${String(i).padStart(3, "0")}`,
    word,
    phonetic: `/${key}/`,
    translation: ru,
    category: cat,
    difficulty: 3,
    example: example(word, cat),
    exampleTranslation: exampleRu(word, ru),
    synonyms: [],
    antonyms: [],
    imageEmoji: emoji || "✨",
  });
}

const header = `export type WordCategory =
  | "Travel"
  | "Business"
  | "Medical"
  | "Technology"
  | "Daily English"
  | "University"
  | "Grammar"
  | "Verbs"
  | "Phrasal Verbs"
  | "Idioms"
  | "IELTS"
  | "TOEFL";

export type Word = {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  category: WordCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  example: string;
  exampleTranslation: string;
  synonyms: string[];
  antonyms: string[];
  imageEmoji: string;
};

export const WORD_CATEGORIES: WordCategory[] = [
  "Travel",
  "Business",
  "Medical",
  "Technology",
  "Daily English",
  "University",
  "Grammar",
  "Verbs",
  "Phrasal Verbs",
  "Idioms",
  "IELTS",
  "TOEFL",
];

export const words: Word[] = `;

const footer = `;

export function getWordById(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function getWordsByCategory(category: WordCategory): Word[] {
  return words.filter((w) => w.category === category);
}
`;

fs.writeFileSync(out, header + JSON.stringify(words, null, 2) + footer, "utf8");

const dist = Object.fromEntries(cats.map((c) => [c, words.filter((w) => w.category === c).length]));
console.log("Total words:", words.length);
console.log(dist);
if (words.length < 1000) {
  console.error("Need at least 1000 words");
  process.exit(1);
}
