const teacherImage = () => "/images/staff-placeholder.svg";

const localize = (az, en) => ({ az, en });

const withTranslation = (value, translations) => (
  translations[value] ? localize(value, translations[value]) : value
);

const roleTranslations = {
  "Baş usta": "Head master",
  "Direktor": "Director",
  "Mühəndis-mexanik": "Mechanical engineer",
  "Müəllim": "Teacher",
  "Psixoloq": "Psychologist",
  "Riyaziyyat müəllimi": "Mathematics teacher",
  "Tərbiyə işləri üzrə direktor müavini": "Deputy director for student affairs",
  "Ümumtəhsil fənn müəllimi": "General education teacher",
  "Ümumtəhsil fənləri üzrə tədris hissə müdiri": "Head of academic affairs for general education subjects",
  "İstehsalat təlimi ustası": "Workplace training master",
  "İxtisas fənn müəllimi": "Specialty subject teacher",
  "İxtisas fənn müəllimi, metodiki komissiya sədri": "Specialty subject teacher, methodology commission chair",
};

const detailLabelTranslations = {
  "Doğum tarixi": "Date of birth",
  "Dərəcə": "Degree",
  "Peşə hazırlığı": "Vocational training",
  "Qiymətləndirmə": "Assessment",
  "Sertifikat": "Certificate",
  "Təcrübə": "Experience",
  "Təhsil": "Education",
};

const specialtyTranslations = {
  "Azərbaycan dili": "Azerbaijani language",
  "Azərbaycan dili və ədəbiyyatı": "Azerbaijani language and literature",
  "Coğrafiya": "Geography",
  "Coğrafiya və biologiya": "Geography and biology",
  "Elektron sənaye və texniki xidmət": "Electronic industry and technical service",
  "Filologiya": "Philology",
  "Fizika": "Physics",
  "Fiziki tərbiyə və idman": "Physical education and sport",
  "Kargüzarlıq": "Office administration",
  "Kimya": "Chemistry",
  "Kompüter şəbəkələri və şəbəkə inzibatçılığı": "Computer networks and network administration",
  "Kompüterlərin təmiri və xidməti üzrə texnik": "Computer repair and service technician",
  "Mühasibat uçotu": "Accounting",
  "Psixoloji dəstək": "Psychological support",
  "Qrafik dizayner": "Graphic designer",
  "Rabitə avadanlıqlarının quraşdırıcısı": "Communications equipment installer",
  "Rabitə və informasiya texnologiyaları": "Communications and information technologies",
  "Radio-televiziya aparatlarının təmiri və xidməti radiomexaniki": "Radio and television equipment repair and service radio mechanic",
  "Riyaziyyat": "Mathematics",
  "Riyaziyyat və informatika": "Mathematics and informatics",
  "Telekommunikasiyada kompüter texnikasının istismarı üzrə operator": "Computer equipment operator in telecommunications",
  "Texniki istehsalat təlimi": "Technical workplace training",
  "Texniki xidmət və mexanika": "Technical service and mechanics",
  "Veb dizayner və proqram təminatçısı": "Web designer and software developer",
  "İKT modulu": "ICT module",
  "İnformasiya texnologiyaları": "Information technologies",
  "İnformatika": "Informatics",
  "İnformatika və riyaziyyat": "Informatics and mathematics",
  "İngilis dili": "English language",
  "İqtisadiyyat və mühasibat modulları": "Economics and accounting modules",
  "Əməliyyatçı-mühasib": "Accounting operator",
};

const staffGroupTitleTranslations = {
  "Rəhbərlər və müavinlər": "Leaders and deputies",
  "Ustalar": "Masters",
  "Müəllimlər": "Teachers",
};

const staffGroupLeadTranslations = {
  "Mərkəzin idarəetmə, metodiki koordinasiya və tədris prosesinə rəhbərlik edən heyəti.": "The team leading center management, methodology coordination and the education process.",
  "İstehsalat təlimi, laboratoriya, emalatxana və praktik məşğələləri aparan heyət.": "The team leading workplace training, laboratory, workshop and practical lessons.",
  "İxtisas, ümumtəhsil, dil, dəstək və rəqəmsal bacarıqlar üzrə dərs aparan müəllimlər.": "Teachers delivering specialty, general education, language, support and digital skills lessons.",
};

const detail = (label, value) => ({ label: withTranslation(label, detailLabelTranslations), value });

const profile = (name, image, role, specialty, details) => ({
  name,
  image: teacherImage(image),
  role: withTranslation(role, roleTranslations),
  specialty: withTranslation(specialty, specialtyTranslations),
  details,
});

const baseStaffGroups = [
  {
    title: "Rəhbərlik və metodiki heyət",
    lead: "Tədris prosesinin təşkili, metodiki dəstək və istehsalat təliminə rəhbərlik edən heyət.",
    members: [
      profile("Bənövşə Seyidova", "banovsha-seyidova", "Ümumtəhsil fənləri üzrə tədris hissə müdiri", "Coğrafiya və biologiya", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji İnstitutu"),
        detail("Təcrübə", "42 il"),
        detail("Qiymətləndirmə", "DQ 38"),
      ]),
      profile("Firuzə Alıyeva", "firuza-aliyeva", "İxtisas fənn müəllimi, metodiki komissiya sədri", "Rabitə və informasiya texnologiyaları", [
        detail("Təhsil", "Azərbaycan Texniki Universiteti"),
        detail("Təcrübə", "10 il"),
        detail("Qiymətləndirmə", "DQ 48, MİQ 46"),
      ]),
      profile("Şamama Süleymanova", "shamama-suleymanova", "Baş usta", "İKT modulu", [
        detail("Təhsil", "Azərbaycan Sənaye Universiteti"),
        detail("Təcrübə", "28 il"),
        detail("Qiymətləndirmə", "DQ 42"),
      ]),
    ],
  },
  {
    title: "İKT, proqramlaşdırma və şəbəkə",
    lead: "İnformatika, kompüter texnikası, telekommunikasiya operatorluğu və şəbəkə istiqamətləri.",
    members: [
      profile("Aygün Cəfərova", "aygun-cafarova", "İstehsalat təlimi ustası", "Kompüterlərin təmiri və xidməti üzrə texnik", [
        detail("Təhsil", "Ukrayna Milli Aerokosmik İnstitutu, proqram təminatı mühəndisliyi"),
        detail("Təcrübə", "15 il"),
        detail("Qiymətləndirmə", "DQ 32"),
      ]),
      profile("Aygün Xəlilova", "aygun-xalilova", "Müəllim", "İnformatika", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji Universiteti, riyaziyyat və informatika"),
        detail("Təcrübə", "30 il"),
        detail("Qiymətləndirmə", "DQ 45, MİQ 31"),
      ]),
      profile("Bəhruzə Mehdiyeva", "bahruza-mehdiyeva", "İstehsalat təlimi ustası", "Telekommunikasiyada kompüter texnikasının istismarı üzrə operator", [
        detail("Təhsil", "Bakı Sənaye Pedaqoji Texnikumu"),
        detail("Təcrübə", "18 il"),
        detail("Qiymətləndirmə", "DQ 34"),
      ]),
      profile("İnarə Rəhimova", "inare-rahimova", "İxtisas fənn müəllimi", "İnformatika və riyaziyyat", [
        detail("Təhsil", "Azərbaycan Mühəndis-İnşaat İnstitutu"),
        detail("Peşə hazırlığı", "İnformatika və riyaziyyat üzrə yenidənhazırlanma kursu"),
      ]),
      profile("Pürüzə Cəfərova", "puruze-cafarova", "İstehsalat təlimi ustası", "Telekommunikasiyada kompüter texnikasının istismarı üzrə operator", [
        detail("Təhsil", "Astara Pedaqoji Kolleci, informatika müəllimliyi"),
        detail("Təcrübə", "8 il"),
      ]),
      profile("Rüşanə İbrahimova-İslamova", "rushane-ibrahimova-islamova", "İstehsalat təlimi ustası", "Kompüterlərin təmiri və xidməti üzrə texnik", [
        detail("Təhsil", "Bakı İdarəetmə və Texnologiya Kolleci; Maliyyə-İqtisad Kolleci"),
        detail("Təcrübə", "16 il"),
        detail("Qiymətləndirmə", "DQ 42"),
      ]),
      profile("Səliməxanım Bağırova", "salimexanim-bagirova", "İxtisas fənn müəllimi", "Riyaziyyat və informatika", [
        detail("Təhsil", "Azərbaycan Dövlət Neft Akademiyası; Azərbaycan Müəllimlər İnstitutu"),
        detail("Təcrübə", "22 il"),
        detail("Qiymətləndirmə", "DQ 51"),
      ]),
      profile("Tünzalə Rüstəmova", "tunzale-rustamova", "İxtisas fənn müəllimi", "Kompüter şəbəkələri və şəbəkə inzibatçılığı", [
        detail("Təhsil", "Gəncə Dövlət Universiteti, riyaziyyat və informatika"),
        detail("Təcrübə", "7 il"),
        detail("Qiymətləndirmə", "DQ 44, MİQ 53.5"),
      ]),
      profile("Türkanə Hüseynova", "turkane-huseynova", "İstehsalat təlimi ustası", "Kompüterlərin təmiri və xidməti üzrə texnik", [
        detail("Təhsil", "Naxçıvan Dövlət Universiteti, informasiya sistemləri"),
        detail("Təcrübə", "17 il"),
        detail("Qiymətləndirmə", "DQ təxminən 32"),
      ]),
    ],
  },
  {
    title: "Qrafik dizayn və veb",
    lead: "Qrafik dizayn, veb dizayn və proqram təminatı istiqamətində dərs və praktiki məşğələlər.",
    members: [
      profile("Rəhilə Rzayeva", "rahile-rzayeva", "İstehsalat təlimi ustası", "Qrafik dizayner", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji Universitetinin nəzdində Azərbaycan Dövlət Pedaqoji Kolleci"),
        detail("Təcrübə", "4 il"),
        detail("Qiymətləndirmə", "DQ 34, MİQ 62"),
        detail("Sertifikat", "İnklüziv pedaqogika"),
      ]),
      profile("Rəvanə Əmirova", "revane-amirova", "İstehsalat təlimi ustası", "Qrafik dizayner", [
        detail("Təhsil", "Bakı Kompüter Kolleci"),
        detail("Təcrübə", "5 il"),
        detail("Qiymətləndirmə", "25 bal"),
      ]),
      profile("Samirə Səfərova", "samire-safarova", "İstehsalat təlimi ustası", "Veb dizayner və proqram təminatçısı", [
        detail("Təhsil", "Azərbaycan Texniki Kolleci"),
        detail("Təcrübə", "22 il"),
        detail("Qiymətləndirmə", "DQ 34"),
      ]),
      profile("Səbinə Məmmədova", "sebine-mammadova", "İstehsalat təlimi ustası", "Qrafik dizayner", [
        detail("Təhsil", "Maliyyə-kredit kolleci"),
        detail("Təcrübə", "18 il"),
        detail("Qiymətləndirmə", "46 bal"),
      ]),
      profile("Sədaqət Zeynalova", "sadaqat-zeynalova", "İstehsalat təlimi ustası", "Qrafik dizayner", [
        detail("Təhsil", "Bakı Sənaye Pedaqoji Texnikumu"),
        detail("Təcrübə", "2003-cü ildən peşə təhsili sahəsində"),
      ]),
      profile("Sevda Xasiyeva", "sevda-xasiyeva", "İstehsalat təlimi ustası", "Veb dizayner və proqram təminatçısı", [
        detail("Təhsil", "Azərbaycan Texniki Universiteti"),
        detail("Təcrübə", "19 il"),
      ]),
      profile("Sevil Əsədova", "sevil-asadova", "İxtisas fənn müəllimi", "Qrafik dizayner", [
        detail("Təhsil", "Azərbaycan Neft və Kimya İnstitutu, informasiya-ölçmə və hesablama texnikası; Azərbaycan Müəllimlər İnstitutu, riyaziyyat-informatika müəllimliyi"),
        detail("Doğum tarixi", "26.04.1966"),
        detail("Təcrübə", "28 il"),
        detail("Qiymətləndirmə", "DQ 49, MİQ 39"),
      ]),
      profile("Şəfiqə Heydərova", "shafiqa-heyderova", "İstehsalat təlimi ustası", "Qrafik dizayner", [
        detail("Təhsil", "Sənaye Texnikomu"),
        detail("Təcrübə", "38 il"),
        detail("Qiymətləndirmə", "DQ 15"),
      ]),
    ],
  },
  {
    title: "Rabitə, elektronika və radio-televiziya",
    lead: "Rabitə avadanlığı, elektronika, radio-televiziya aparatları və texniki xidmət istiqamətləri.",
    members: [
      profile("Əhliman Ağaverdiyev", "ahliman-agaverdiyev", "Mühəndis-mexanik", "Texniki xidmət və mexanika", [
        detail("Təhsil", "Azərbaycan Mühəndis-İnşaat İnstitutu"),
        detail("Təcrübə", "34 il pedaqoji staj"),
      ]),
      profile("Aytən Eyyubova", "aytan-eyyubova", "İstehsalat təlimi ustası", "Rabitə avadanlıqlarının quraşdırıcısı", [
        detail("Təhsil", "Azərbaycan Texniki Universiteti, radiotexnika və rabitə"),
        detail("Təcrübə", "3 il"),
        detail("Qiymətləndirmə", "MİQ 19"),
      ]),
      profile("İlqar Tağıyev", "ilqar-tagiyev", "İstehsalat təlimi ustası", "Radio-televiziya aparatlarının təmiri və xidməti radiomexaniki", [
        detail("Təhsil", "Azərbaycan Politexnik İnstitutu"),
        detail("Təcrübə", "28 il ümumi, 20 il ixtisas stajı"),
        detail("Qiymətləndirmə", "MİQ 27"),
      ]),
      profile("Nuriyyə Fərzəliyeva", "nuriyye-farzaliyeva", "İstehsalat təlimi ustası", "Radio-televiziya aparatlarının təmiri və xidməti radiomexaniki", [
        detail("Təhsil", "Bakı Sənaye Pedaqoji Texnikumu"),
        detail("Təcrübə", "38 il"),
        detail("Qiymətləndirmə", "15 bal"),
      ]),
      profile("Rübabə Sadıqova", "rubabe-sadiqova", "İstehsalat təlimi ustası", "Elektron sənaye və texniki xidmət", [
        detail("Təhsil", "Gəncə Elektron Sənayesi Texnikumu"),
        detail("Təcrübə", "35 il"),
        detail("Qiymətləndirmə", "DQ 32"),
      ]),
      profile("Zərifə Abbasova", "zarifa-abbasova", "İstehsalat təlimi ustası", "Texniki istehsalat təlimi", [
        detail("Təhsil", "Bakı Politexnik Universiteti"),
        detail("Təcrübə", "37 il"),
        detail("Qiymətləndirmə", "DQ 36"),
      ]),
    ],
  },
  {
    title: "Mühasibat, kargüzarlıq və ofis xidmətləri",
    lead: "Kargüzarlıq, arxiv işi, əməliyyatçı-mühasib və ofis xidmətləri üzrə pedaqoji heyət.",
    members: [
      profile("Arzu Nəbiyeva", "arzu-nabiyeva", "İstehsalat təlimi ustası", "Kargüzarlıq", [
        detail("Təhsil", "Bakı Yerli Sənaye Kolleci, kargüzar və arxiv işi"),
        detail("Təcrübə", "29 il"),
      ]),
      profile("Fidan Qarayeva", "fidan-qarayeva", "İstehsalat təlimi ustası", "Mühasibat uçotu", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji Universitetinin nəzdində Azərbaycan Dövlət Pedaqoji Kolleci"),
        detail("Təcrübə", "3 il"),
        detail("Qiymətləndirmə", "MİQ 42"),
      ]),
      profile("Günel Quliyeva", "gunel-quliyeva", "İstehsalat təlimi ustası", "İqtisadiyyat və mühasibat modulları", [
        detail("Təhsil", "Azərbaycan Dövlət İqtisad Universiteti"),
        detail("Təcrübə", "Təqribən 14 il"),
        detail("Qiymətləndirmə", "32 bal"),
      ]),
      profile("Heydər Məmmədov", "heyder-mammadov", "İxtisas fənn müəllimi", "Kargüzarlıq", [
        detail("Təhsil", "Azərbaycan Turizm və Menecment Universiteti"),
        detail("Dərəcə", "Bakalavr və magistr"),
        detail("Təcrübə", "3 il ixtisas stajı"),
      ]),
      profile("Şəhla Məmmədova", "shehla-mammadova", "İstehsalat təlimi ustası", "Əməliyyatçı-mühasib", [
        detail("Təhsil", "Azərbaycan Dövlət İqtisad Universiteti, magistr"),
        detail("Təcrübə", "13 il"),
        detail("Qiymətləndirmə", "DQ 39"),
      ]),
      profile("Zərifə Xurşudova", "zarifa-xurshudova", "İstehsalat təlimi ustası", "Əməliyyatçı-mühasib", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji Universitetinin nəzdində Azərbaycan Pedaqoji Kolleci"),
        detail("Təcrübə", "3 il"),
        detail("Qiymətləndirmə", "DQ 56"),
      ]),
    ],
  },
  {
    title: "Ümumtəhsil fənləri və dəstək",
    lead: "Riyaziyyat, Azərbaycan dili, ədəbiyyat, fizika, coğrafiya, xarici dil, psixoloji dəstək və idman fənləri.",
    members: [
      profile("Çiçək Həsənəliyeva", "cicek-hasanaliyeva", "Müəllim", "Riyaziyyat", [
        detail("Təhsil", "Bakı Dövlət Universiteti"),
        detail("Təcrübə", "32 il"),
        detail("Qiymətləndirmə", "DQ 37, sertifikasiya 45"),
      ]),
      profile("Fuad Məmmədov", "fuad-mammadov", "Müəllim", "Fiziki tərbiyə və idman", [
        detail("Təhsil", "Azərbaycan Dövlət Bədən Tərbiyəsi və İdman Akademiyası"),
        detail("Təcrübə", "2 il"),
        detail("Qiymətləndirmə", "MİQ 79.50"),
      ]),
      profile("Könül Əliyeva", "konul-aliyeva", "Müəllim", "Filologiya", [
        detail("Təhsil", "Bakı Dövlət Universiteti"),
        detail("Təcrübə", "30 il"),
        detail("Qiymətləndirmə", "Sertifikasiya 54"),
      ]),
      profile("Lalə Fərəcova", "lale-faracova", "Müəllim", "Azərbaycan dili", [
        detail("Təhsil", "Azərbaycan Pedaqoji İnstitutu"),
        detail("Təcrübə", "45 il"),
        detail("Qiymətləndirmə", "DQ 31"),
      ]),
      profile("Lalə Vəliyeva", "lale-valiyeva", "Müəllim", "Coğrafiya", [
        detail("Təhsil", "Bakı Dövlət Universiteti"),
        detail("Təcrübə", "2002-ci ildən pedaqoji staj"),
        detail("Qiymətləndirmə", "50 bal"),
      ]),
      profile("Maya Orduyeva", "maya-orduyeva", "Müəllim", "Fizika", [
        detail("Təhsil", "Naxçıvan Dövlət Universiteti"),
        detail("Təcrübə", "15 il"),
        detail("Qiymətləndirmə", "DQ 57, MİQ 47"),
      ]),
      profile("Məlahət Həşimova", "melahet-hashimova", "Müəllim", "Azərbaycan dili və ədəbiyyatı", [
        detail("Təhsil", "Bakı Dövlət Universiteti"),
        detail("Təcrübə", "26 il"),
        detail("Qiymətləndirmə", "DQ 52"),
      ]),
      profile("Şəbnəm Səfərova", "shabnam-safarova", "Psixoloq", "Psixoloji dəstək", [
        detail("Təhsil", "Bakı Avrasiya Universiteti, filologiya"),
        detail("Təcrübə", "11 il"),
        detail("Qiymətləndirmə", "DQ 35"),
      ]),
      profile("Təranə Qocayeva", "terane-qocayeva", "Müəllim", "İngilis dili", [
        detail("Təhsil", "Azərbaycan Dillər Universiteti"),
        detail("Təcrübə", "15 il"),
        detail("Qiymətləndirmə", "DQ 38, MİQ 39"),
      ]),
      profile("Tünzalə Həsənova", "tunzale-hasanova", "Müəllim", "Fizika", [
        detail("Təhsil", "Azərbaycan Dövlət Pedaqoji Universiteti"),
        detail("Təcrübə", "20 il"),
        detail("Qiymətləndirmə", "DQ 49, sertifikasiya 43"),
      ]),
    ],
  },
];

const additionalStaff = [
  profile("Arzu Bağırova", "arzu-bagirova", "Riyaziyyat müəllimi", "Riyaziyyat", [
    detail("Təhsil", "Bakı Dövlət Universiteti, Mexanika-Riyaziyyat fakültəsi; Azərbaycan Dövlət Pedaqoji Universiteti, bakalavr; Azərbaycan Dövlət İqtisad Universiteti, magistr"),
    detail("Təcrübə", "2011-ci ildən mərkəzdə"),
    detail("Qiymətləndirmə", "DQ 37"),
  ]),
  profile("Elmira Əliyeva", "elmira-aliyeva", "İxtisas fənn müəllimi", "Elektron sənaye və texniki xidmət", [
    detail("Təhsil", "Ç. İldırım adına Azərbaycan Politexnik İnstitutu, sənaye elektronikası"),
    detail("Doğum tarixi", "08.07.1965"),
    detail("Təcrübə", "41 il ümumi, 36 il pedaqoji; 2007-ci ildən peşə liseyində"),
  ]),
  profile("Xalidə Hümbətova", "xalide-humbatova", "Direktor", "Fizika", [
    detail("Təhsil", "Bakı Dövlət Universiteti, fizika"),
    detail("Təcrübə", "20 il"),
  ]),
  profile("Məlahət Ələkbərova", "melahet-alakbarova", "Riyaziyyat müəllimi", "Riyaziyyat", [
    detail("Təhsil", "Bakı Dövlət Universiteti, Mexanika-Riyaziyyat fakültəsi, riyaziyyat müəllimliyi"),
    detail("Doğum tarixi", "22.09.1997"),
    detail("Təcrübə", "6 il"),
    detail("Qiymətləndirmə", "MİQ 71, sertifikasiya 95"),
  ]),
  profile("Nurlana Rəhimova", "nurlana-rahimova", "Müəllim", "İngilis dili", [
    detail("Təhsil", "Azərbaycan Dillər Universiteti, filologiya və ingilis dili"),
    detail("Doğum tarixi", "01.01.1981"),
    detail("Təcrübə", "23 il"),
    detail("Qiymətləndirmə", "DQ 39, sertifikasiya 45"),
  ]),
  profile("Səadət Hümbətova", "seadet-humbatova", "Ümumtəhsil fənn müəllimi", "İngilis dili", [
    detail("Təhsil", "Azərbaycan Dillər Universiteti, ingilis dili müəllimliyi"),
    detail("Doğum tarixi", "25.06.1982"),
    detail("Təcrübə", "23 il"),
    detail("Qiymətləndirmə", "Diaqnostik imtahan 54, sertifikasiya 57"),
  ]),
  profile("Səlbi Babayeva", "selbi-babayeva", "Ümumtəhsil fənn müəllimi", "Riyaziyyat", [
    detail("Təhsil", "Bakı Dövlət Universiteti, Mexanika-Riyaziyyat fakültəsi, bakalavr və magistr"),
    detail("Doğum tarixi", "15.10.1989"),
    detail("Təcrübə", "8 il"),
    detail("Qiymətləndirmə", "MİQ 70"),
  ]),
  profile("Türkan Səfərova", "turkan-safarova", "Riyaziyyat müəllimi", "Riyaziyyat", [
    detail("Təhsil", "Bakı Dövlət Universiteti, riyaziyyat müəllimliyi; Azərbaycan Dövlət İqtisad Universiteti, qiymətli kağızlar"),
    detail("Doğum tarixi", "16.08.1993"),
    detail("Təcrübə", "1 il"),
  ]),
  profile("Ülviyyə Hacıyeva", "ulviyye-haciyeva", "Tərbiyə işləri üzrə direktor müavini", "Rabitə və informasiya texnologiyaları", [
    detail("Təhsil", "Azərbaycan Texniki Universiteti, avtomatika və hesablama texnikası"),
    detail("Təcrübə", "2007-ci ildən işləyir; 2012-ci ildən tərbiyə işləri üzrə direktor müavini"),
  ]),
  profile("Xanəli Məmmədov", "xaneli-mammadov", "Müəllim", "Riyaziyyat", [
    detail("Doğum tarixi", "20.06.1968"),
    detail("Təhsil", "Xocamsaxlı kənd natamam orta məktəbi; Dondarlı kənd orta məktəbi"),
    detail("Qiymətləndirmə", "Diaqnostika 47"),
  ]),
  profile("Günel Nəsirova", "gunel-nasirova", "Müəllim", "Kimya", [
    detail("Təhsil", "Bakı Dövlət Universiteti, kimya"),
    detail("Təcrübə", "18 il"),
    detail("Qiymətləndirmə", "Sertifikasiya 65"),
  ]),
  profile("Könül Abdullayeva", "konul-abdullayeva", "İstehsalat təlimi ustası", "İnformasiya texnologiyaları", [
    detail("Təhsil", "Bakı Sənaye Pedaqoji Kolleci"),
    detail("Təcrübə", "18 il"),
    detail("Qiymətləndirmə", "DQ 32"),
  ]),
  profile("Şövqiyyə Əliyeva", "sovqiyye-aliyeva", "Müəllim", "İnformatika", [
    detail("Təhsil", "Lənkəran Dövlət Universiteti, tətbiqi riyaziyyat"),
    detail("Təcrübə", "3 il"),
    detail("Qiymətləndirmə", "MİQ 74.25"),
  ]),
];

const allStaffMembers = [...baseStaffGroups.flatMap((group) => group.members), ...additionalStaff];
const leadershipNames = new Set(["Bənövşə Seyidova", "Firuzə Alıyeva", "Şamama Süleymanova", "Ülviyyə Hacıyeva", "Xalidə Hümbətova"]);
const technicalStaffNames = new Set(["Əhliman Ağaverdiyev"]);
const isLeadership = (member) => leadershipNames.has(member.name);
const azText = (value) => value?.az || value || "";
const isMaster = (member) => (
  azText(member.role).includes("İstehsalat təlimi ustası")
  || azText(member.role).includes("Baş usta")
  || technicalStaffNames.has(member.name)
);

const staffGroups = [
  {
    id: "rehberlik",
    title: "Rəhbərlər və müavinlər",
    lead: "Mərkəzin idarəetmə, metodiki koordinasiya və tədris prosesinə rəhbərlik edən heyəti.",
    members: allStaffMembers.filter(isLeadership),
  },
  {
    id: "ustalar",
    title: "Ustalar",
    lead: "İstehsalat təlimi, laboratoriya, emalatxana və praktik məşğələləri aparan heyət.",
    members: allStaffMembers.filter((member) => !isLeadership(member) && isMaster(member)),
  },
  {
    id: "muellimler",
    title: "Müəllimlər",
    lead: "İxtisas, ümumtəhsil, dil, dəstək və rəqəmsal bacarıqlar üzrə dərs aparan müəllimlər.",
    members: allStaffMembers.filter((member) => !isLeadership(member) && !isMaster(member)),
  },
].map((group) => ({
  ...group,
  title: withTranslation(group.title, staffGroupTitleTranslations),
  lead: withTranslation(group.lead, staffGroupLeadTranslations),
}));

export default staffGroups;
