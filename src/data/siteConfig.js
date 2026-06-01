import staffGroups from "./staffProfiles.js";

const siteConfig = (() => {
    const facebookUrl = "https://www.facebook.com/share/17V9cqf76H/";
    const instagramUrl = "https://www.instagram.com/rabitegovaz/";
    const portalUrl = "https://portal.edu.az/";

    const storage = {
        images: "ritbdplManagedImages",
        content: "ritbdplManagedContent",
        data: "ritbdplManagedData",
        cachedImages: "ritbdplCachedImages",
        cachedContent: "ritbdplCachedContent",
        cachedData: "ritbdplCachedData",
        language: "ritbdplLanguage",
        adminSession: "ritbdplAdminSession"
    };

    const defaultImages = {
        hero: "/images/hero.jpeg",
        lab: "/images/lab.JPG",
        meeting: "/images/meeting.jpeg",
        training: "/images/lab.JPG",
        automation: "/images/meeting.jpeg",
        electronics: "/images/lab.JPG",
        design: "/images/hero.jpeg",
        aboutHero: "/images/heroes/about-hero.jpg",
        leadershipHero: "/images/heroes/leadership-hero.jpg",
        educationHero: "/images/heroes/education-programs-hero.jpg",
        partnersHero: "/images/heroes/partners-hero.jpg",
        successHero: "/images/heroes/blank-hero.svg",
        newsHero: "/images/heroes/news-hero.jpg",
        contactHero: "/images/heroes/contact-hero.jpg"
    };

    const dictionary = {
        az: {
            siteName: "RİT Bakı Dövlət Peşə Təhsili Mərkəzi",
            logoAlt: "Rabitə və İnformasiya Texnologiyaları üzrə Bakı Dövlət Peşə Təhsili Mərkəzi",
            skip: "Əsas məzmuna keç",
            address: "Mərkəz: Ələsgər Qayıbov küçəsi 13 / I korpus: Ələsgər Qayıbov küçəsi 1",
            facebookPage: "Facebook səhifəsi",
            instagramPage: "Instagram səhifəsi",
            home: "Əsas səhifə",
            about: "Haqqımızda",
            centerAbout: "Mərkəz haqqında",
            team: "Rəhbərlik və heyət",
            leadership: "Rəhbərlik",
            teachers: "Müəllimlər",
            masters: "Ustalar",
            partners: "Tərəfdaşlar",
            education: "Tədris",
            specialties: "İxtisaslar",
            studyPlans: "Tədris planları",
            programs: "Təhsil proqramları",
            news: "Xəbərlər",
            successfulStudents: "Uğurlu Tələbələrimiz",
            contact: "Əlaqə",
            admission: "Qəbul",
            admissionPortal: "Qəbul portalı",
            viewSpecialties: "İxtisaslara bax",
            sections: "Bölmələr",
            footerAbout: "Rabitə, informasiya texnologiyaları və texniki peşələr üzrə praktik yönümlü təhsil mühiti.",
            footerEducation: "Tədris",
            campusMaps: "Korpus xəritələri",
            allRights: "Bütün hüquqlar qorunur.",
            homeAboutEyebrow: "Mərkəz haqqında",
            homeAboutTitle: "Praktik tədris, laboratoriya mühiti və əmək bazarına yaxın proqramlar",
            homeBadges: ["İKT yönümlü ixtisaslar", "Dual təhsil", "Təcrübə proqramları"],
            modelEyebrow: "Əsas istiqamətlər",
            modelTitle: "Tədris modeli",
            modelLead: "İxtisas seçimi, praktik məşğələ və işə hazırlıq bir-birini tamamlayan tədris mərhələləri kimi qurulur.",
            educationSection: "Tədris bölməsi",
            socialMedia: "Sosial media",
            latestNews: "Son xəbərlər",
            latestNewsLead: "Facebook səhifəsinə yönləndirilmiş xəbərlər və tədbir kartları.",
            loadingSite: "Sayt məlumatları yüklənir...",
            more: "Daha çox",
            close: "Bağla",
            details: "Ətraflı məlumat",
            viewOnFacebook: "Facebookda bax",
            staffTitle: "Rəhbərlik və pedaqoji heyət",
            staffGroupedLead: "Rəhbərlər və müavinlər, ustalar və müəllimlər ayrı bölmələrdə təqdim olunur.",
            successfulStudentsTitle: "Tələbə uğurları",
            successfulStudentsLead: "Tələbə və məzunların layihə, təcrübə və iş həyatında qazandığı nəticələr.",
            partnerTitle: "Təcrübə və əməkdaşlıq tərəfdaşları",
            specialtyTitle: "İxtisaslar",
            programStructure: "Təhsil proqramlarının quruluşu",
            contactInfo: "Əlaqə məlumatları",
            phone: "Telefon",
            mobile: "Mobil",
            email: "Email",
            social: "Sosial media",
            campusOne: "I korpus",
            campusTwo: "Mərkəz",
            campusTwoAddress: "",
            notFoundTitle: "Səhifə tapılmadı",
            notFoundText: "Seçilən səhifə mövcud deyil.",
            backHome: "Əsas səhifəyə qayıt",
            menuOpen: "Menyunu aç",
            menuClose: "Menyunu bağla",
            languageAz: "Azərbaycan dili",
            languageEn: "English",
            adminOpenSite: "Public sayta bax",
            adminLogout: "Çıxış",
            adminResetAll: "Hamısını sıfırla"
        },
        en: {
            siteName: "RIT Baku State Vocational Education Center",
            logoAlt: "Baku State Vocational Education Center for Communications and Information Technologies",
            skip: "Skip to main content",
            address: "Center: Alasgar Gayibov Street 13 / Campus I: Alasgar Gayibov Street 1",
            facebookPage: "Facebook page",
            instagramPage: "Instagram page",
            home: "Home",
            about: "About",
            centerAbout: "About the center",
            team: "Leadership and staff",
            leadership: "Leadership",
            teachers: "Teachers",
            masters: "Masters",
            partners: "Partners",
            education: "Education",
            specialties: "Specialties",
            studyPlans: "Study plans",
            programs: "Education programs",
            news: "News",
            successfulStudents: "Successful students",
            contact: "Contact",
            admission: "Admission",
            admissionPortal: "Admission portal",
            viewSpecialties: "View specialties",
            sections: "Sections",
            footerAbout: "A practical learning environment for communications, information technologies and technical vocations.",
            footerEducation: "Education",
            campusMaps: "Campus maps",
            allRights: "All rights reserved.",
            homeAboutEyebrow: "About the center",
            homeAboutTitle: "Practical training, labs and programs aligned with the labor market",
            homeBadges: ["ICT-focused specialties", "Dual education", "Internship programs"],
            modelEyebrow: "Core directions",
            modelTitle: "Education model",
            modelLead: "Specialty choice, hands-on lessons and career readiness are built as connected stages of learning.",
            educationSection: "Education section",
            socialMedia: "Social media",
            latestNews: "Latest news",
            latestNewsLead: "News and event cards linked to the official Facebook page.",
            loadingSite: "Loading site content...",
            more: "Read more",
            close: "Close",
            details: "Details",
            viewOnFacebook: "View on Facebook",
            staffTitle: "Leadership and teaching staff",
            staffGroupedLead: "Leaders and deputies, masters and teachers are presented in separate groups.",
            successfulStudentsTitle: "Student achievements",
            successfulStudentsLead: "Results achieved by students and graduates in projects, practice and work life.",
            partnerTitle: "Practice and cooperation partners",
            specialtyTitle: "Specialties",
            programStructure: "Structure of education programs",
            contactInfo: "Contact information",
            phone: "Phone",
            mobile: "Mobile",
            email: "Email",
            social: "Social media",
            campusOne: "Campus I",
            campusTwo: "Center",
            campusTwoAddress: "",
            notFoundTitle: "Page not found",
            notFoundText: "The selected page does not exist.",
            backHome: "Back to home",
            menuOpen: "Open menu",
            menuClose: "Close menu",
            languageAz: "Azerbaijani",
            languageEn: "English",
            adminOpenSite: "View public site",
            adminLogout: "Log out",
            adminResetAll: "Reset all"
        }
    };

    const sectionOrder = [
        { key: "/", labelKey: "home" },
        { key: "/haqqimizda", labelKey: "centerAbout" },
        { key: "/rehberlik", labelKey: "leadership" },
        { key: "/muellimler", labelKey: "teachers" },
        { key: "/ustalar", labelKey: "masters" },
        { key: "/terefdaslar", labelKey: "partners" },
        { key: "/tedris/ixtisaslar", labelKey: "specialties" },
        { key: "/tedris/planlar", labelKey: "studyPlans" },
        { key: "/tedris/proqramlar", labelKey: "programs" },
        { key: "/ugurlu-telebeler", labelKey: "successfulStudents" },
        { key: "/xeberler", labelKey: "news" },
        { key: "/elaqe", labelKey: "contact" }
    ];

    const adminSections = sectionOrder;

    const defaultContent = {
        "/": {
            imageKey: "hero",
            title: {
                az: "Rabitə və İnformasiya Texnologiyaları üzrə peşəkar gələcək",
                en: "A professional future in communications and IT"
            },
            lead: {
                az: "İKT, rabitə, elektronika, dizayn və texniki xidmət sahələrində real avadanlıq, laboratoriya və işəgötürən tərəfdaşlığı ilə praktik təhsil.",
                en: "Practical education in ICT, communications, electronics, design and technical service with real equipment, labs and employer partnerships."
            },
            body: {
                az: "Mərkəz rabitə və informasiya texnologiyaları sahəsində tələbələrin biliklərini real iş mühitinə bağlayan tədris yanaşması ilə fəaliyyət göstərir.",
                en: "The center connects technical knowledge with real work environments through practice-led teaching in communications and information technologies."
            }
        },
        "/haqqimizda": {
            imageKey: "aboutHero",
            title: {
                az: "Mərkəz haqqında",
                en: "About the center"
            },
            lead: {
                az: "Azərbaycan Respublikasında müasir əmək bazarının tələblərinə cavab verən, rabitə və informasiya texnologiyaları sahəsində ixtisaslaşmış aparıcı peşə təhsili müəssisələrindən biri.",
                en: "A leading vocational education institution in Azerbaijan specialized in communications and information technologies."
            },
            body: {
                az: "Rabitə və İnformasiya Texnologiyaları üzrə Bakı Dövlət Peşə Təhsili Mərkəzi publik hüquqi şəxs Azərbaycan Respublikasında müasir əmək bazarının tələblərinə cavab verən, rabitə və informasiya texnologiyaları sahəsində ixtisaslaşmış aparıcı peşə təhsili müəssisələrindən biridir. Müəssisənin əsası 1979 və 1974-cü illərdə fəaliyyət göstərmiş 13 saylı Bakı Kompüter Liseyi və 7 saylı Bakı Peşə Liseyinə dayanır. Müasir çağırışlara və standartlara uyğunlaşdırılması məqsədilə Mərkəz 2016-cı ildə hazırkı publik hüquqi şəxs statusunda yenidən təsis edilmiş və 2023-cü ildən etibarən mərkəz kimi fəaliyyət göstərir.\n2025-2026-cı təhsil ili üzrə müəssisədə 21 ixtisas üzrə formalaşdırılmış 68 qrupda (14 qrup yüksək texniki peşə, 50 qrup texniki peşə təhsili, 4 qrup ilk peşə təhsil səviyyəsi üzrə) tədris aparılır.\nTədris və inzibati korpuslar: Mərkəz korpusunda 21 sinif otağı, 25 nəfərlik iclas otağı, tələbə bufeti və inzibati otaqlar mövcuddur. 6 sinif otağı kompüterlə təchiz olunmuşdur. 2 sinif otağı “Kompüterlərin təmiri və xidməti üzrə texnik” ixtisası üzrə laboratoriya otağıdır. I korpusda isə 19 sinif otağı, kütləvi tədbirlər üçün 200 nəfərlik akt zalı, 25 nəfərlik iclas otağı, tələbə bufeti və inzibati otaqlar yerləşir. 8 sinif otağı kompüterlə təmin olunmuşdur.\nEmalatxana: Əsas korpusda 3 otaqdan ibarət olan “Elektronika və kommunikasiya sistemlərinin istismarı” və “Mobil telefonların təmir ustası” üzrə emalatxana fəaliyyət göstərir.\nMissiyamız: Müasir texnologiyalar və peşəkar pedaqoji işçilərlə təmin edilmiş təhsil mühiti yaradaraq əmək bazarının tələblərinə uyğun peşəkar bilik və bacarıqlara malik ixtisaslı kadrları hazırlamaq.",
                en: "The Baku State Vocational Education Center for Communications and Information Technologies is a public legal entity and one of Azerbaijan's leading vocational education institutions specialized in communications and information technologies. Its roots go back to Baku Computer Lyceum No. 13 and Baku Vocational Lyceum No. 7, which operated from 1979 and 1974. To meet modern requirements and standards, the Center was re-established in 2016 as a public legal entity and has operated as a center since 2023.\nIn the 2025-2026 academic year, teaching is carried out across 68 groups formed for 21 specialties, including 14 higher technical vocational groups, 50 technical vocational groups and 4 initial vocational groups.\nThe Center campus has 21 classrooms, a 25-seat meeting room, a student buffet and administrative rooms. Six classrooms are equipped with computers. Two classrooms serve as laboratories for the Computer Repair and Service Technician specialty. Campus I has 19 classrooms, a 200-seat assembly hall for public events, a 25-seat meeting room, a student buffet and administrative rooms. Eight classrooms are equipped with computers.\nThe main campus also has a three-room workshop for Operation of Electronics and Communication Systems and Mobile Phone Repair.\nMission: to create a learning environment supported by modern technologies and professional teaching staff, and to prepare qualified personnel with professional knowledge and skills that meet labor market needs."
            }
        },
        "/rehberlik-heyet": {
            imageKey: "leadershipHero",
            title: {
                az: "Rəhbərlik və heyət",
                en: "Leadership and staff"
            },
            lead: {
                az: "İdarəetmə, tədris və istehsalat təlimi komandası bir strukturda təqdim olunur.",
                en: "The management, teaching and workplace training team is presented in one clear structure."
            },
            body: {
                az: "Heyət strukturu direktor, direktor müavinləri, istehsalat təlimi ustaları, ixtisas və ümumtəhsil fənn müəllimləri üzrə bölünür.",
                en: "The staff structure includes the director, deputy directors, workplace training masters, specialty teachers and general education teachers."
            }
        },
        "/rehberlik": {
            imageKey: "leadershipHero",
            title: {
                az: "Rəhbərlik",
                en: "Leadership"
            },
            lead: {
                az: "Direktor və direktor müavinləri ayrı səhifədə təqdim olunur.",
                en: "The director and deputy directors are presented on a dedicated page."
            },
            body: {
                az: "",
                en: ""
            }
        },
        "/muellimler": {
            imageKey: "leadershipHero",
            title: {
                az: "Müəllimlər",
                en: "Teachers"
            },
            lead: {
                az: "İxtisas və ümumtəhsil fənn müəllimləri ayrıca səhifədə toplanıb.",
                en: "Specialty and general education teachers are grouped on a dedicated page."
            },
            body: {
                az: "Müəllimlər bölməsi tədris prosesini aparan pedaqoji heyəti və onların əsas istiqamətlərini göstərir.",
                en: "The teachers page shows the teaching staff who lead the learning process and their main directions."
            }
        },
        "/ustalar": {
            imageKey: "educationHero",
            title: {
                az: "Ustalar",
                en: "Masters"
            },
            lead: {
                az: "İstehsalat təlimi ustaları ayrıca səhifədə göstərilir.",
                en: "Workplace training masters are shown on a dedicated page."
            },
            body: {
                az: "Ustalar bölməsində praktik məşğələlərə, emalatxana işlərinə və istehsalat təcrübəsinə rəhbərlik edən heyət təqdim olunur.",
                en: "The masters page presents the staff leading practical lessons, workshop tasks and workplace practice."
            }
        },
        "/terefdaslar": {
            imageKey: "partnersHero",
            title: {
                az: "Tərəfdaşlar",
                en: "Partners"
            },
            lead: {
                az: "Müqavilə və memorandumlarla təcrübə proqramları, dual təhsil və işə hazırlıq imkanları genişləndirilir.",
                en: "Agreements and memorandums expand internships, dual education and career readiness opportunities."
            },
            body: {
                az: "Müqavilə və memorandum bağlanan şirkətlər tələbələr üçün təcrübə, mentorluq və real iş mühiti imkanları yaradır.",
                en: "Partner companies create internship, mentoring and real workplace opportunities for students."
            }
        },
        "/tedris/ixtisaslar": {
            imageKey: "educationHero",
            title: {
                az: "İxtisaslar",
                en: "Specialties"
            },
            lead: {
                az: "İT, rabitə və telekommunikasiya, dizayn, mühasibatlıq və ofis idarəçiliyi üzrə ixtisaslar.",
                en: "Specialties in IT, communications and telecommunications, design, accounting and office administration."
            },
            body: {
                az: "2025-2026-cı təhsil ili üçün ixtisaslar təhsil səviyyəsinə görə qruplaşdırılıb. Hər istiqamət üzrə tədris nəzəri hazırlıq, laboratoriya işi və praktik bacarıqlar üzərində qurulur.",
                en: "For the 2025-2026 academic year, specialties are grouped by education level. Each direction combines theory, lab work and practical skills."
            }
        },
        "/tedris/planlar": {
            imageKey: "educationHero",
            title: {
                az: "Tədris planları",
                en: "Study plans"
            },
            lead: {
                az: "Tədris planları ixtisas səviyyəsinə, qəbul formasına və praktik məşğələ yükünə görə strukturlaşdırılır.",
                en: "Study plans are structured by specialty level, admission format and practical training load."
            },
            body: {
                az: "Baza biliklər, ixtisas fənləri, praktiki məşğələ və istehsalat təcrübəsi ardıcıllıqla planlaşdırılır.",
                en: "Core knowledge, specialty subjects, hands-on practice and workplace training are planned in sequence."
            }
        },
        "/tedris/proqramlar": {
            imageKey: "educationHero",
            title: {
                az: "Təhsil proqramları",
                en: "Education programs"
            },
            lead: {
                az: "Proqramlarda nəzəri bilik, laboratoriya işi və istehsalat təcrübəsi birlikdə verilir.",
                en: "Programs combine theory, laboratory work and workplace practice."
            },
            body: {
                az: "Proqramlar tələbəni mərhələli şəkildə sahə biliklərinə, laboratoriya bacarıqlarına və real tapşırıqlara hazırlayır.",
                en: "Programs prepare students step by step for field knowledge, lab skills and real assignments."
            }
        },
        "/ugurlu-telebeler": {
            imageKey: "successHero",
            title: {
                az: "Uğurlu Tələbələrimiz",
                en: "Successful students"
            },
            lead: {
                az: "Tələbə və məzunların layihə, təcrübə və iş həyatında qazandığı nəticələr.",
                en: "Results achieved by students and graduates in projects, practice and work life."
            },
            body: {
                az: "",
                en: ""
            }
        },
        "/xeberler": {
            imageKey: "newsHero",
            title: {
                az: "Xəbərlər",
                en: "News"
            },
            lead: {
                az: "",
                en: ""
            },
            body: {
                az: "",
                en: ""
            }
        },
        "/elaqe": {
            imageKey: "contactHero",
            title: {
                az: "Əlaqə",
                en: "Contact"
            },
            lead: {
                az: "Mərkəz və korpus xəritələri, telefon nömrələri və email ünvanı.",
                en: "Maps for the center and campus, phone numbers and email address."
            },
            body: {
                az: "Müraciətlər üçün telefon, email və sosial media kanalları aktivdir. Xəritələr aşağıda göstərilir.",
                en: "Phone, email and social media channels are available for inquiries. Maps are shown below."
            }
        }
    };

    const siteData = {
        heroVideo: "/images/whatsapp/hero-video.mp4",
        stats: [
            { number: "21", label: { az: "Tədris olunan ixtisas", en: "Specialties taught" } },
            { number: "68", label: { az: "Formalaşdırılmış tədris qrupu", en: "Study groups formed" } },
            { number: "2", label: { az: "Tədris və inzibati korpus", en: "Teaching and administrative campuses" } },
            { number: "2023", label: { az: "Mərkəz kimi fəaliyyət ili", en: "Year of operation as a center" } }
        ],
        homeCards: [
            {
                icon: "school",
                title: { az: "İxtisas seçimi", en: "Specialty choice" },
                body: {
                    az: "Veb, şəbəkə, elektronika, texniki dəstək, dizayn və ofis xidmətləri üzrə proqramlar.",
                    en: "Programs in web, networks, electronics, technical support, design and office services."
                }
            },
            {
                icon: "book",
                tagClass: "gold",
                title: { az: "Praktik məşğələ", en: "Hands-on practice" },
                body: {
                    az: "Laboratoriya, emalatxana və istehsalat təcrübəsi tədrisin əsas hissəsi kimi qurulur.",
                    en: "Laboratories, workshops and workplace practice are a core part of learning."
                }
            },
            {
                icon: "briefcase",
                tagClass: "coral",
                title: { az: "İşə hazırlıq", en: "Career readiness" },
                body: {
                    az: "Tərəfdaşlarla memorandumlar və real iş mühitinə keçid imkanları tələbələri gücləndirir.",
                    en: "Partnership memorandums and access to real workplaces strengthen students readiness."
                }
            }
        ],
        aboutCards: [
            {
                icon: "certificate",
                title: { az: "Tarixçə", en: "History" },
                body: {
                    az: "Mərkəzin əsası 1979 və 1974-cü illərdə fəaliyyət göstərmiş 13 saylı Bakı Kompüter Liseyi və 7 saylı Bakı Peşə Liseyinə dayanır.",
                    en: "The Center's roots go back to Baku Computer Lyceum No. 13 and Baku Vocational Lyceum No. 7."
                }
            },
            {
                icon: "portal",
                tagClass: "gold",
                title: { az: "Tədris bazası", en: "Education facilities" },
                body: {
                    az: "Mərkəz və I korpusda sinif otaqları, kompüterlə təchiz olunmuş kabinetlər, iclas otaqları, akt zalı və emalatxana mövcuddur.",
                    en: "The Center and Campus I include classrooms, computer-equipped rooms, meeting rooms, an assembly hall and a workshop."
                }
            },
            {
                icon: "briefcase",
                tagClass: "coral",
                title: { az: "Missiya", en: "Mission" },
                body: {
                    az: "Əmək bazarının tələblərinə uyğun peşəkar bilik və bacarıqlara malik ixtisaslı kadrlar hazırlamaq əsas məqsəddir.",
                    en: "The main goal is to prepare qualified personnel with professional knowledge and skills that meet labor market needs."
                }
            }
        ],
        specialties: [
            { az: "Veb dizayn və proqram təminatı", en: "Web design and software" },
            { az: "Kompüter şəbəkələri və şəbəkə inzibatçısı", en: "Computer networks and network administrator" },
            { az: "Kompüter sistemlərində proqramlaşdırma", en: "Programming in computer systems" },
            { az: "Kompüterlərin təmiri və xidməti üzrə texnik", en: "Computer repair and service technician" },
            { az: "Sistem şəbəkə xidməti üzrə texnik", en: "System network service technician" },
            { az: "Veb dizayner və proqram təminatçısı", en: "Web designer and software developer" },
            { az: "İnformasiya texnologiyaları üzrə texniki dəstək mütəxəssisi", en: "Information technologies technical support specialist" },
            { az: "Elektronika və kommunikasiya sistemlərinin istismarı", en: "Operation of electronics and communication systems" },
            { az: "Telekommunikasiyada kompüter texnikasının istismarı üzrə operator", en: "Computer equipment operator in telecommunications" },
            { az: "Rabitə quraşdırıcısı-kabelçi", en: "Communications installer and cabling specialist" },
            { az: "Radio-televiziya aparatlarının təmir və xidməti radiomexaniki", en: "Radio and television equipment repair and service radio mechanic" },
            { az: "Rabitə avadanlıqlarının quraşdırıcısı", en: "Communications equipment installer" },
            { az: "Mobil telefonların təmir ustası", en: "Mobile phone repair specialist" },
            { az: "İnteryer dizayn", en: "Interior design" },
            { az: "Qrafik dizayner", en: "Graphic designer" },
            { az: "Poliqrafiya üzrə dizayner", en: "Printing designer" },
            { az: "Kargüzarlıq", en: "Office administration" },
            { az: "Qida və qeyri-qida məhsulları satıcısı, nəzarətçi-xəzinədar", en: "Food and non-food products seller, cashier-controller" },
            { az: "Kargüzarlıq və ofis xidmətləri üzrə mütəxəssis", en: "Office administration and office services specialist" },
            { az: "Mühasibat uçotu", en: "Accounting" },
            { az: "Əməliyyatçı-mühasib", en: "Accounting operator" }
        ],
        specialtyGroups: [
            {
                icon: "certificate",
                title: { az: "Yüksək texniki peşə", en: "Higher technical vocation" },
                body: {
                    az: "İT, rabitə, dizayn və mühasibatlıq istiqamətlərində daha dərin texniki hazırlıq.",
                    en: "Advanced technical preparation in IT, communications, design and accounting."
                },
                details: {
                    az: [
                        "Veb dizayn və proqram təminatı",
                        "Kompüter şəbəkələri və şəbəkə inzibatçısı",
                        "Kompüter sistemlərində proqramlaşdırma",
                        "Elektronika və kommunikasiya sistemlərinin istismarı",
                        "İnteryer dizayn",
                        "Mühasibat uçotu"
                    ],
                    en: [
                        "Web design and software",
                        "Computer networks and network administrator",
                        "Programming in computer systems",
                        "Operation of electronics and communication systems",
                        "Interior design",
                        "Accounting"
                    ]
                }
            },
            {
                icon: "portal",
                title: { az: "Texniki peşə", en: "Technical vocation" },
                body: {
                    az: "Texniki xidmət, rabitə, İT, dizayn və ofis xidmətləri üzrə peşə hazırlığı.",
                    en: "Vocational training in technical service, communications, IT, design and office services."
                },
                details: {
                    az: [
                        "Kompüterlərin təmiri və xidməti üzrə texnik",
                        "Sistem şəbəkə xidməti üzrə texnik",
                        "Veb dizayner və proqram təminatçısı",
                        "İnformasiya texnologiyaları üzrə texniki dəstək mütəxəssisi",
                        "Telekommunikasiyada kompüter texnikasının istismarı üzrə operator",
                        "Rabitə quraşdırıcısı-kabelçi",
                        "Radio-televiziya aparatlarının təmir və xidməti radiomexaniki",
                        "Rabitə avadanlıqlarının quraşdırıcısı",
                        "Mobil telefonların təmir ustası",
                        "Qrafik dizayner",
                        "Kargüzarlıq və ofis xidmətləri üzrə mütəxəssis",
                        "Əməliyyatçı-mühasib"
                    ],
                    en: [
                        "Computer repair and service technician",
                        "System network service technician",
                        "Web designer and software developer",
                        "IT technical support specialist",
                        "Computer equipment operator in telecommunications",
                        "Communications installer and cabling specialist",
                        "Radio and television equipment repair and service radio mechanic",
                        "Communications equipment installer",
                        "Mobile phone repair specialist",
                        "Graphic designer",
                        "Office administration and office services specialist",
                        "Accounting operator"
                    ]
                }
            },
            {
                icon: "school",
                title: { az: "İlk peşə təhsili", en: "Initial vocational education" },
                body: {
                    az: "Ofis işi, satış və poliqrafiya istiqamətlərində ilkin peşə hazırlığı.",
                    en: "Initial vocational training in office work, sales and printing."
                },
                details: {
                    az: [
                        "Poliqrafiya üzrə dizayner",
                        "Kargüzarlıq",
                        "Qida və qeyri-qida məhsulları satıcısı, nəzarətçi-xəzinədar"
                    ],
                    en: [
                        "Printing designer",
                        "Office administration",
                        "Food and non-food goods seller, cashier-controller"
                    ]
                }
            },
            {
                icon: "briefcase",
                tagClass: "gold",
                title: { az: "Dual təhsil", en: "Dual education" },
                body: {
                    az: "Tərəfdaş müəssisələrlə real iş mühitində təcrübə, mentor dəstəyi və praktiki peşə hazırlığı.",
                    en: "Workplace practice, mentor support and practical vocational training with partner organizations."
                },
                details: {
                    az: [
                        "İş yerində öyrənmə",
                        "Tərəfdaş müəssisə mentorluğu",
                        "İstehsalat təcrübəsi",
                        "Peşə davranışları və karyera hazırlığı"
                    ],
                    en: [
                        "Workplace learning",
                        "Partner organization mentoring",
                        "Workplace practice",
                        "Professional behavior and career readiness"
                    ]
                }
            }
        ],
        team: [
            {
                initials: "D",
                title: { az: "Direktor", en: "Director" },
                body: {
                    az: "Mərkəzin idarəetməsi, strateji inkişafı və tədris keyfiyyətinə rəhbərlik edir.",
                    en: "Leads center management, strategic development and education quality."
                },
                points: [
                    { az: "İnkişaf strategiyası", en: "Development strategy" },
                    { az: "Tərəfdaşlıq siyasəti", en: "Partnership policy" },
                    { az: "Keyfiyyət nəzarəti", en: "Quality control" }
                ]
            },
            {
                initials: "DM",
                title: { az: "Direktor müavinləri", en: "Deputy directors" },
                body: {
                    az: "Tədris prosesi, tələbə həyatı və gündəlik akademik idarəetməni koordinasiya edir.",
                    en: "Coordinate the learning process, student life and daily academic management."
                },
                points: [
                    { az: "Dərs cədvəlləri", en: "Lesson schedules" },
                    { az: "Tədris planları", en: "Study plans" },
                    { az: "Tərbiyə işləri", en: "Student development" }
                ]
            },
            {
                initials: "U",
                title: { az: "İstehsalat təlimi ustaları", en: "Workplace training masters" },
                body: {
                    az: "Emalatxana və laboratoriya məşğələlərində tələbələrin praktik bacarıqlarını formalaşdırır.",
                    en: "Build students practical skills in workshops and laboratories."
                },
                points: [
                    { az: "Laboratoriya işi", en: "Lab work" },
                    { az: "İstehsalat təcrübəsi", en: "Workplace practice" },
                    { az: "Dual təhsil", en: "Dual education" }
                ]
            },
            {
                initials: "İF",
                title: { az: "İxtisas fənn müəllimləri", en: "Specialty teachers" },
                body: {
                    az: "İKT, rabitə, dizayn və texniki xidmət istiqamətlərində peşə yönümlü dərslər aparır.",
                    en: "Teach vocational lessons in ICT, communications, design and technical service."
                },
                points: [
                    { az: "Proqramlaşdırma", en: "Programming" },
                    { az: "Şəbəkə", en: "Networking" },
                    { az: "Dizayn", en: "Design" }
                ]
            },
            {
                initials: "ÜF",
                title: { az: "Ümumtəhsil fənn müəllimləri", en: "General education teachers" },
                body: {
                    az: "Tələbələrin baza biliklərini, ünsiyyət və analitik düşünmə bacarıqlarını gücləndirir.",
                    en: "Strengthen core knowledge, communication and analytical thinking skills."
                },
                points: [
                    { az: "Baza fənlər", en: "Core subjects" },
                    { az: "Kommunikasiya", en: "Communication" },
                    { az: "Analitik bacarıqlar", en: "Analytical skills" }
                ]
            },
            {
                initials: "M",
                title: { az: "Metodik heyət", en: "Methodology staff" },
                body: {
                    az: "Qiymətləndirmə, metodiki dəstək və təlim nəticələrinin izlənməsini təmin edir.",
                    en: "Supports assessment, methodology and tracking of learning outcomes."
                },
                points: [
                    { az: "Metodiki dəstək", en: "Methodology support" },
                    { az: "Monitorinq", en: "Monitoring" },
                    { az: "Nəticə analizi", en: "Outcome analysis" }
                ]
            }
        ],
        staffGroups,
        partners: [
            {
                tag: { az: "Memorandum", en: "Memorandum" },
                tagClass: "",
                title: "Founder Club",
                body: {
                    az: "Peşə təhsilində təcrübə proqramlarının genişləndirilməsi və tələbələrin real layihələrə çıxışı.",
                    en: "Expanding internship programs and connecting students with real projects."
                },
                image: "meeting"
            },
            {
                tag: { az: "Dual təhsil", en: "Dual education" },
                tagClass: "gold",
                title: "İ Service MMC",
                body: {
                    az: "Mobil telefonların təmiri istiqamətində praktik təcrübə və işəgötürən dəstəyi.",
                    en: "Practical experience and employer support in mobile phone repair."
                },
                image: "electronics"
            },
            {
                tag: { az: "Təcrübə", en: "Practice" },
                tagClass: "coral",
                title: "Qanun Nəşriyyatı və Tuna QSC",
                body: {
                    az: "Poliqrafiya və qrafik dizayn ixtisasları üzrə iş yerində təcrübə imkanları.",
                    en: "Workplace practice opportunities in printing and graphic design."
                },
                image: "design"
            }
        ],
        news: [
            {
                tag: { az: "Facebook", en: "Facebook" },
                tagClass: "",
                title: {
                    az: "2025-2026-cı tədris ili üzrə tələbə qəbuluna start verilir",
                    en: "Student admission for the 2025-2026 academic year is starting"
                },
                body: {
                    az: "Qəbul ilk və texniki peşə təhsili səviyyələri üzrə portal.edu.az vasitəsilə aparılır.",
                    en: "Admission for initial and technical vocational levels is managed through portal.edu.az."
                },
                image: "meeting",
                url: facebookUrl
            },
            {
                tag: { az: "Tədris", en: "Education" },
                tagClass: "gold",
                title: { az: "Laboratoriya məşğələləri", en: "Laboratory practice" },
                body: {
                    az: "Tələbələr texniki avadanlıqlarla praktik bacarıqlarını inkişaf etdirirlər.",
                    en: "Students develop practical skills using technical equipment."
                },
                image: "lab",
                url: facebookUrl
            },
            {
                tag: { az: "Tədbir", en: "Event" },
                tagClass: "coral",
                title: { az: "Peşə təhsili üzrə görüş", en: "Vocational education meeting" },
                body: {
                    az: "Mərkəzin fəaliyyəti və inkişaf istiqamətləri üzrə görüş təşkil olunub.",
                    en: "A meeting was held on the center activities and development directions."
                },
                image: "hero",
                url: facebookUrl
            }
        ],
        planCards: [
            {
                icon: "school",
                title: { az: "İlk peşə və texniki peşə təhsili", en: "Initial and technical vocational education" },
                body: {
                    az: "Baza biliklər, ixtisas fənləri, praktiki məşğələ və istehsalat təcrübəsi ardıcıllıqla planlaşdırılır.",
                    en: "Core knowledge, specialty subjects, practical lessons and workplace training are planned in sequence."
                },
                points: {
                    az: ["Nəzəri modullar", "Laboratoriya məşğələləri", "İstehsalat təcrübəsi"],
                    en: ["Theory modules", "Laboratory practice", "Workplace training"]
                }
            },
            {
                icon: "certificate",
                tagClass: "gold",
                title: { az: "Yüksək texniki peşə təhsili", en: "Higher technical vocational education" },
                body: {
                    az: "Şəbəkə inzibatçılığı, proqram təminatı və kommunikasiya sistemləri üzrə daha dərin texniki hazırlıq.",
                    en: "Deeper technical preparation in network administration, software and communication systems."
                },
                points: {
                    az: ["İxtisaslaşmış modullar", "Layihə əsaslı tədris", "Qiymətləndirmə mərhələləri"],
                    en: ["Specialized modules", "Project-based learning", "Assessment stages"]
                }
            },
            {
                icon: "briefcase",
                tagClass: "coral",
                title: { az: "Dual təhsil", en: "Dual education" },
                body: {
                    az: "Tədrisin bir hissəsi tərəfdaş müəssisələrlə real iş mühitində aparılır.",
                    en: "Part of the program is delivered in real workplaces together with partner organizations."
                },
                points: {
                    az: ["İş yerində öyrənmə", "Mentor dəstəyi", "Peşə davranışları"],
                    en: ["Learning at work", "Mentor support", "Professional behavior"]
                }
            }
        ],
        programCards: [
            {
                icon: "portal",
                title: { az: "Rəqəmsal bacarıqlar", en: "Digital skills" },
                body: {
                    az: "Proqramlaşdırma, texniki dəstək, şəbəkə və sistem idarəetməsi.",
                    en: "Programming, technical support, networking and system administration."
                }
            },
            {
                icon: "shield",
                tagClass: "gold",
                title: { az: "Texniki xidmət", en: "Technical service" },
                body: {
                    az: "Elektronika, rabitə avadanlığı, mobil cihaz və kompüter texniki xidməti.",
                    en: "Electronics, communications equipment, mobile device and computer service."
                }
            },
            {
                icon: "book",
                tagClass: "coral",
                title: { az: "Dizayn və poliqrafiya", en: "Design and printing" },
                body: {
                    az: "Qrafik dizayn, veb dizayn və poliqrafiya üzrə praktik hazırlıq.",
                    en: "Practical preparation in graphic design, web design and printing."
                }
            }
        ],
        successfulStudents: [
            {
                tag: { az: "Uğurlu məzun", en: "Successful graduate" },
                title: { az: "Nizami Əliyev", en: "Nizami Aliyev" },
                body: { az: "İnformasiya texnologiyaları üzrə texniki dəstək mütəxəssisi kimi media sahəsində fəaliyyət göstərir.", en: "Works in media as an information technologies technical support specialist." },
                image: "/images/whatsapp/campus-01.jpeg",
                url: ""
            },
            {
                tag: { az: "Operator", en: "Operator" },
                tagClass: "gold",
                title: { az: "Mirzədə Abdullayeva", en: "Mirzada Abdullayeva" },
                body: { az: "Telekommunikasiya kompüter texnikasının istismarı üzrə operator kimi Azərpoçt MMC-də çalışır.", en: "Works at Azerpost as an operator in telecommunications computer equipment operation." },
                image: "/images/whatsapp/campus-02.jpeg",
                url: ""
            },
            {
                tag: { az: "Qeydiyyatçı", en: "Registrar" },
                tagClass: "coral",
                title: { az: "Fidan Aslanova", en: "Fidan Aslanova" },
                body: { az: "Kompüter operatoru və dizayner hazırlığından sonra Referans Hayat Hospitalda işləyir.", en: "After computer operator and designer training, works at Referans Hayat Hospital." },
                image: "/images/whatsapp/campus-03.jpeg",
                url: ""
            },
            {
                tag: { az: "Texniki dəstək", en: "Technical support" },
                title: { az: "Vahid Ağazadə", en: "Vahid Aghazade" },
                body: { az: "İT dəstək istiqamətində peşə bacarıqlarını real iş mühitində tətbiq edir.", en: "Applies IT support skills in a real workplace." },
                image: "/images/whatsapp/campus-04.jpeg",
                url: ""
            },
            {
                tag: { az: "Məzun", en: "Graduate" },
                tagClass: "gold",
                title: { az: "Səbinə Muzaffərova", en: "Sabina Muzaffarova" },
                body: { az: "Rəqəmsal bacarıqları və peşə hazırlığı ilə uğurlu nəticə göstərən məzunlarımızdandır.", en: "One of our graduates who achieved strong results with digital skills and vocational training." },
                image: "/images/whatsapp/campus-05.jpeg",
                url: ""
            },
            {
                tag: { az: "Veb dizayn", en: "Web design" },
                tagClass: "coral",
                title: { az: "Musa Əzizov", en: "Musa Azizov" },
                body: { az: "Veb dizayner kimi şirkətdə dizayn və rəqəmsal layihələr üzərində işləyir.", en: "Works as a web designer on design and digital projects." },
                image: "/images/whatsapp/campus-06.jpeg",
                url: ""
            },
            {
                tag: { az: "Rabitə", en: "Communications" },
                title: { az: "Cümşüd Mikayılov", en: "Cumshud Mikayilov" },
                body: { az: "Rabitə quraşdırıcısı-kabelçi ixtisası üzrə texnik kimi fəaliyyət göstərir.", en: "Works as a technician in communications installation and cabling." },
                image: "/images/whatsapp/campus-07.jpeg",
                url: ""
            },
            {
                tag: { az: "Qrafik dizayn", en: "Graphic design" },
                tagClass: "gold",
                title: { az: "Aysun Mansurlu", en: "Aysun Mansurlu" },
                body: { az: "Qrafik dizayner kimi Unitech Development şirkətində çalışır.", en: "Works as a graphic designer at Unitech Development." },
                image: "/images/whatsapp/campus-08.jpeg",
                url: ""
            },
            {
                tag: { az: "Dizayner", en: "Designer" },
                tagClass: "coral",
                title: { az: "Anastasiya Rudina Andreyevna", en: "Anastasia Rudina Andreyevna" },
                body: { az: "Qrafik dizayn hazırlığından sonra tekstil şirkətində dizayner kimi fəaliyyətə başlayıb.", en: "After graphic design training, started working as a designer in a textile company." },
                image: "/images/whatsapp/campus-09.jpeg",
                url: ""
            },
            {
                tag: { az: "Kabelçi", en: "Cabling" },
                title: { az: "Tofiq Əliyev", en: "Tofiq Aliyev" },
                body: { az: "Rabitə quraşdırıcısı-kabelçi kimi Selnet MMC-də texnik vəzifəsində işləyir.", en: "Works as a technician at Selnet in communications installation and cabling." },
                image: "/images/whatsapp/campus-10.jpeg",
                url: ""
            },
            {
                tag: { az: "Aztelekom", en: "Aztelekom" },
                tagClass: "gold",
                title: { az: "Hümbət Aslanlı", en: "Humbat Aslanli" },
                body: { az: "Rabitə quraşdırıcısı-kabelçi ixtisası üzrə Aztelekom MMC-nin Beyləqan filialında çalışır.", en: "Works at Aztelekom's Beylagan branch in communications installation and cabling." },
                image: "/images/whatsapp/campus-11.jpeg",
                url: ""
            },
            {
                tag: { az: "Audiovizual", en: "Audiovisual" },
                tagClass: "coral",
                title: { az: "Elşad Cəlalov", en: "Elshad Jalalov" },
                body: { az: "Telekommunikasiya və audiovizual yönümlü işlərdə peşə bacarıqlarını nümayiş etdirir.", en: "Demonstrates vocational skills in telecommunications and audiovisual work." },
                image: "/images/whatsapp/campus-12.jpeg",
                url: ""
            }
        ],
        contactItems: [
            { label: { az: "Ünvan", en: "Address" }, value: { az: "Mərkəz: Ələsgər Qayıbov küçəsi 13\nI korpus: Ələsgər Qayıbov küçəsi 1", en: "Center: Alasgar Gayibov Street 13\nCampus I: Alasgar Gayibov Street 1" }, url: "" },
            { label: { az: "Telefon", en: "Phone" }, value: { az: "(012) 56 749 02, (012) 567 18 66", en: "(012) 56 749 02, (012) 567 18 66" }, url: "tel:+994125674902" },
            { label: { az: "Mobil", en: "Mobile" }, value: { az: "+994 99 739 95 65", en: "+994 99 739 95 65" }, url: "tel:+994997399565" },
            { label: { az: "Email", en: "Email" }, value: { az: "rabite@vet.edu.az", en: "rabite@vet.edu.az" }, url: "mailto:rabite@vet.edu.az" }
        ],
        socialLinks: [
            { key: "facebook", label: "Facebook", url: facebookUrl },
            { key: "instagram", label: "Instagram", url: instagramUrl }
        ],
        contactMaps: [
            {
                title: { az: "Mərkəz", en: "Center" },
                body: { az: "", en: "" },
                url: "https://maps.google.com/maps?ll=40.4152731,49.8799621&z=17&t=m&output=embed"
            },
            {
                title: { az: "I korpus", en: "Campus I" },
                body: { az: "", en: "" },
                url: "https://maps.google.com/maps?ll=40.4066738,49.8830882&z=17&t=m&output=embed"
            }
        ]
    };

    return {
        facebookUrl,
        instagramUrl,
        portalUrl,
        storage,
        defaultImages,
        dictionary,
        defaultContent,
        sectionOrder,
        adminSections,
        siteData
    };
})();

export default siteConfig;


