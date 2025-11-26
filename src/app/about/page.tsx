"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useAboutAnimations } from "@/hooks/useAboutAnimations";
import { useLanguage, Locale } from "@/context/LanguageContext";
import styles from "./page.module.css";

const ABOUT_CONTENT: Record<
  Locale,
  {
    hero: {
      badge: string;
      title: string[];
      lead: string;
      stats: Array<{ value: string; label: string }>;
    };
    story: {
      badge: string;
      title: string;
      paragraphs: string[];
      card: { label: string; value: string; helper: string };
    };
    missionVision: Array<{ title: string; copy: string; icon: "mission" | "vision" }>;
    values: {
      badge: string;
      title: string;
      description: string;
      cards: Array<{ title: string; copy: string }>;
    };
    client: {
      badge: string;
      title: string;
      paragraphs: string[];
      quote: string;
      highlightsTitle: string;
      highlights: string[];
    };
    serviceSuite: {
      badge: string;
      title: string;
      description: string;
      cards: Array<{ title: string; body: string; detail: string }>;
    };
    commitments: {
      badge: string;
      title: string;
      description: string;
      cards: Array<{ title: string; body: string }>;
    };
    timeline: {
      badge: string;
      title: string;
      items: Array<{ year: string; title: string; body: string }>;
    };
    partners: {
      badge: string;
      title: string;
      description: string;
      cards: Array<{ name: string; focus: string; url: string; link: string }>;
    };
    careers: {
      badge: string;
      title: string;
      description: string;
      details: string[];
      panelTitle: string;
      panelBody: string;
      panelCta: string;
    };
    cta: {
      badge: string;
      title: string;
      description: string;
      button: string;
    };
  }
> = {
  en: {
    hero: {
      badge: "about lunier marina",
      title: ["Crafting serene,", "seaworthy journeys"],
      lead:
        "We are a boutique management house dedicated to elevating every minute on the water. From technical stewardship to concierge-level hosting, Lunier Marina pairs precision engineering with timeless hospitality.",
      stats: [
        { value: "42", label: "managed vessels • GCC & Mediterranean" },
        { value: "78", label: "specialist partners across yards, crew, and charter" },
        { value: "13", label: "minutes average response from our fleet desk" },
      ],
    },
    story: {
      badge: "who we are",
      title: "Where royal marina heritage meets contemporary craft",
      paragraphs: [
        "Born from the lounges of Dubai Harbour, Lunier Marina adapts the etiquette of private members clubs to the rigors of open water. We interpret family traditions, cultural rituals, and technical requirements to deliver voyages that feel effortless yet thoroughly choreographed.",
        "Our multilingual crew spans naval architects, former captains, guest experience curators, and sustainability analysts. Together we orchestrate provisioning, compliance, charters, and refits with a single point of contact for every owner.",
      ],
      card: {
        label: "Trusted for",
        value: "Global repositioning",
        helper: "Customs, weather routing, and crew swaps handled in-house.",
      },
    },
    missionVision: [
      {
        title: "Mission",
        copy: "Deliver white-glove yacht management that anticipates every need, merging engineering rigor with concierge warmth across every voyage.",
        icon: "mission",
      },
      {
        title: "Vision",
        copy: "Redefine Arabian yachting culture through sustainable innovation, curated partnerships, and a trusted crew of multidisciplinary specialists.",
        icon: "vision",
      },
    ],
    values: {
      badge: "our values",
      title: "Principles that guide every handoff and handshake",
      description:
        "Each value informs our design choices, maintenance roadmaps, and the way we greet guests at the passerelle. Hover to explore our mindset.",
      cards: [
        {
          title: "Precision",
          copy: "Meticulous maintenance schedules and transparent reporting keep every vessel inspection-ready.",
        },
        {
          title: "Discretion",
          copy: "Elevated hospitality rooted in privacy, cultural fluency, and bespoke guest experiences.",
        },
        {
          title: "Innovation",
          copy: "We pair digital diagnostics with artisanal craftsmanship to preserve legacy yachts and new builds alike.",
        },
        {
          title: "Sustainability",
          copy: "Partnerships with green marinas and circular provisioning programs reduce every journey’s footprint.",
        },
        {
          title: "Collaboration",
          copy: "Embedded teams work alongside owners, captains, and shipyards as a single, responsive unit.",
        },
        {
          title: "Stewardship",
          copy: "We safeguard heritage fleets for future generations through continuous education and mentorship.",
        },
      ],
    },
    client: {
      badge: "client service",
      title: "High-touch relationships anchored in privacy",
      paragraphs: [
        "We cultivate long-term partnerships by decoding cultural rituals, anticipating seasonal needs, and making owners feel like the central partner in our journey. Sensitive itineraries, passenger manifests, and ownership insights remain shielded and handled by a dedicated director.",
        "This promise guides every handoff—blending absolute discretion with proactive hospitality so you can surrender the details and stay immersed in the sea.",
      ],
      quote: "“Exceptional maritime luxury.”",
      highlightsTitle: "Concierge highlights",
      highlights: [
        "24/7 duty officer with 13-minute average live response",
        "Secure charter & guest manifest handling across GCC and Med",
        "Personalized provisioning & ritual-aware hosting programs",
        "On-site lounges at Dubai Harbour and partner marinas in KSA",
      ],
    },
    serviceSuite: {
      badge: "service suite",
      title: "Modular or fully managed—choose the course",
      description:
        "Owners can entrust us with the entire 360° program or select specific tracks. Each pathway is delivered by multidisciplinary pods spanning engineering, finance, logistics, and guest experience.",
      cards: [
        {
          title: "360° Yacht & Vessel Management",
          body: "Comprehensive operational, technical, and financial oversight with modular add-ons so owners select exactly what they need.",
          detail: "Crew supervision • compliance • budget governance",
        },
        {
          title: "Visiting Yacht Agency",
          body: "End-to-end clearances for yachts arriving to Saudi shores, covering permits, customs, and guest logistics for Red Sea cruising.",
          detail: "Harbour authorizations • customs • concierge routing",
        },
        {
          title: "Marina & Club Operations",
          body: "Management of marinas and lounges with smart systems, premium amenities, and hospitality programming for members.",
          detail: "Smart berth tech • private lounges • curated events",
        },
        {
          title: "Crew Selection & Development",
          body: "Bespoke recruitment pipelines that vet personality, language, and technical mastery to match each owner’s preferences.",
          detail: "Onboarding • rotations • continuous training",
        },
      ],
    },
    commitments: {
      badge: "our commitment",
      title: "More than management, a covenant of trust",
      description:
        "From bridge to berth we apply the highest standards of quality, safety, sustainability, and confidentiality so every journey feels effortless yet expertly governed.",
      cards: [
        {
          title: "Performance & Accountability",
          body: "Every engagement is governed by measurable KPIs, live dashboards, and rapid escalation paths led by senior yacht directors.",
        },
        {
          title: "Quality & Safety",
          body: "We enforce shipyard-grade checklists, OEM maintenance intervals, and dual-audit inspections to keep each vessel guest ready.",
        },
        {
          title: "Environmental Responsibility",
          body: "Hybrid retrofits, circular provisioning, and eco-certified consumables minimize wake impact across GCC and Mediterranean waters.",
        },
        {
          title: "Absolute Discretion",
          body: "Voyage manifests, ownership structures, and guest rituals are protected through need-to-know protocols and encrypted tooling.",
        },
      ],
    },
    timeline: {
      badge: "timeline",
      title: "Milestones on our voyage",
      items: [
        {
          year: "2012",
          title: "Dubai Harbour Origins",
          body: "Lunier Marina launches as a micro-agency managing two private yachts with a three-person crew.",
        },
        {
          year: "2016",
          title: "Engineering Partnership",
          body: "Signed multi-year agreements with European shipyards, unlocking rapid refit lanes and OEM sourcing.",
        },
        {
          year: "2020",
          title: "Global Fleet Desk",
          body: "Expanded to 24/7 remote monitoring, predictive maintenance, and bespoke charter concierge services.",
        },
        {
          year: "2024",
          title: "Sustainability Charter",
          body: "Introduced hybrid propulsion retrofits and zero-waste provisioning protocols for GCC-based fleets.",
        },
      ],
    },
    partners: {
      badge: "partnerships",
      title: "Together toward excellence",
      description:
        "We collaborate with designers, naval engineers, and global suppliers whose standards mirror our own, ensuring every owner benefits from a resilient ecosystem.",
      cards: [
        {
          name: "Lunier Marina Marine Services",
          focus: "Yacht, marina, and facilities management at Saudi ports",
          url: "https://seaexpertis.com/",
          link: "visit site",
        },
        {
          name: "Boat Pro Marine Services",
          focus: "Digital charter marketplace for boats, yachts, and leisure craft",
          url: "https://boatpro.club/",
          link: "visit site",
        },
        {
          name: "Integrated Marine Services Holding",
          focus: "Holding entity aligning engineering, staffing, and capital support",
          url: "https://seaexpertis.com/",
          link: "visit site",
        },
      ],
    },
    careers: {
      badge: "careers & collaborations",
      title: "Join the crew shaping Gulf yachting",
      description:
        "Passionate about marine hospitality or engineering? We champion talent that thrives on precision, discretion, and bold imagination. Share your credentials or partnership proposal to co-create the next era of luxury on water.",
      details: [
        "Al Murjan Tower, Prince Sultan Road, Al Rawdah District, Jeddah, Saudi Arabia.",
        "Phone: 0534457744",
        "Email: cap.harbi@boatpro.club",
        "https://seaexpertis.com • https://boatpro.club",
      ],
      panelTitle: "Work with us",
      panelBody:
        "Submit portfolios for engineering, guest experience, or sustainability roles. We provide mentorship, on-the-job training, and visibility across Dubai, Jeddah, Monaco, and Bodrum.",
      panelCta: "share your profile",
    },
    cta: {
      badge: "next step",
      title: "Ready to chart your next season?",
      description:
        "Share your fleet ambitions and we will assemble a bespoke program covering technical, hospitality, and sustainability touchpoints.",
      button: "speak with concierge",
    },
  },
  ar: {
    hero: {
      badge: "عن لونيير مارينا",
      title: ["نصنع رحلات هادئة", "وجاهزة للإبحار"],
      lead:
        "نحن بيت إدارة متخصص يرفع مستوى كل لحظة على الماء. من الحوكمة الفنية إلى الضيافة الراقية، تجمع لونيير مارينا بين الدقة الهندسية وحفاوة الاستقبال الأصيلة.",
      stats: [
        { value: "42", label: "يختاً مداراً • الخليج والمتوسط" },
        { value: "78", label: "شريكاً متخصصاً في الأحواض والطاقم والتأجير" },
        { value: "13", label: "دقيقة متوسط استجابة غرفة العمليات" },
      ],
    },
    story: {
      badge: "من نحن",
      title: "إرث المراسي الملكية مع حرفية عصرية",
      paragraphs: [
        "نشأت لونيير مارينا في صالات دبي هاربور، حيث نقلنا بروتوكولات الأندية الخاصة إلى عالم البحار المفتوحة. نقرأ تقاليد العائلات وطقوسهم الثقافية ومتطلباتهم التقنية لنصمم رحلات تبدو سهلة لكنها مُعدة بعناية.",
        "يضم طاقمنا متعدد اللغات مهندسين بحريين وقباطنة سابقين ومنسقي ضيافة ومحللي استدامة. نُدير التموين والامتثال والتأجير وإعادة التجهيز من خلال نقطة اتصال واحدة لكل مالك.",
      ],
      card: {
        label: "موثوقون في",
        value: "نقل الأساطيل عالمياً",
        helper: "الجمارك وتوجيهات الطقس وتبديل الطواقم تتم داخلياً.",
      },
    },
    missionVision: [
      {
        title: "رسالتنا",
        copy: "تقديم إدارة يخوت مترفة تتنبأ بكل احتياج، وتمزج بين صرامة الهندسة ودفء الضيافة في كل رحلة.",
        icon: "mission",
      },
      {
        title: "رؤيتنا",
        copy: "إعادة تعريف ثقافة اليخوت العربية عبر الابتكار المستدام والشراكات المنتقاة وطاقم موثوق من الخبراء متعدد التخصصات.",
        icon: "vision",
      },
    ],
    values: {
      badge: "قيمنا",
      title: "مبادئ تقود كل تسليم وكل مصافحة",
      description:
        "تشكل قيمنا طريقة تصميم برامج الصيانة وآلية استقبال الضيوف على متن اليخت. اكتشف العقلية التي تحرك فريقنا.",
      cards: [
        {
          title: "الدقة",
          copy: "جداول صيانة محكمة وتقارير شفافة تبقي كل يخت جاهزاً للتفتيش.",
        },
        {
          title: "الخصوصية",
          copy: "ضيافة راقية متجذرة في السرية وفهم الثقافات وتجارب الضيوف المصممة.",
        },
        {
          title: "الابتكار",
          copy: "نمزج التشخيص الرقمي مع الحرفية للحفاظ على اليخوت الكلاسيكية والحديثة.",
        },
        {
          title: "الاستدامة",
          copy: "شراكات مع مراسٍ خضراء وبرامج تموين دائرية تقلل أثر كل رحلة.",
        },
        {
          title: "التعاون",
          copy: "فرق مدمجة تعمل بجانب الملاك والقباطنة والأحواض كوحدة واحدة.",
        },
        {
          title: "الرعاية",
          copy: "نحمي الأساطيل العريقة للأجيال القادمة عبر التعليم المستمر والتوجيه.",
        },
      ],
    },
    client: {
      badge: "خدمة العملاء",
      title: "علاقات رفيعة المستوى أساسها الخصوصية",
      paragraphs: [
        "نبني شراكات طويلة الأمد بفهم الطقوس الثقافية وتوقع المواسم وجعل المالك الشريك الأهم في رحلتنا. تبقى الجداول الحساسة وكشوف الركاب وبيانات الملكية سرية بإشراف مدير مخصص.",
        "هذا الوعد يرسم كل تسليم، إذ نمزج السرية المطلقة بضيافة استباقية لتستمتع بالبحر وتترك التفاصيل لنا.",
      ],
      quote: "“رفاهية بحرية استثنائية.”",
      highlightsTitle: "أبرز خدمات الكونسييرج",
      highlights: [
        "ضابط مناوبة 24/7 بمتوسط استجابة 13 دقيقة",
        "إدارة آمنة للتأجير وكشوف الضيوف عبر الخليج والمتوسط",
        "تموين مخصص وبرامج ضيافة تراعي العادات",
        "صالات خاصة في دبي هاربور ومراسي شريكة في السعودية",
      ],
    },
    serviceSuite: {
      badge: "حزمة الخدمات",
      title: "إدارة كاملة أو نمطية—اختر المسار",
      description:
        "يمكن للمالكين تفويضنا بالبرنامج المتكامل 360° أو اختيار مسارات محددة. كل مسار تُديره فرق متعددة التخصصات تشمل الهندسة والمالية واللوجستيات والضيافة.",
      cards: [
        {
          title: "إدارة اليخوت بزاوية 360°",
          body: "رقابة تشغيلية وفنية ومالية شاملة مع إضافات مرنة ليختار المالك ما يناسبه.",
          detail: "إشراف الطاقم • الامتثال • حوكمة الميزانية",
        },
        {
          title: "وكالة اليخوت الزائرة",
          body: "إجراءات دخول كاملة لليخوت القادمة إلى سواحل المملكة تشمل التصاريح والجمارك ولوجستيات الضيوف.",
          detail: "تصاريح الموانئ • الجمارك • تخطيط المسارات",
        },
        {
          title: "تشغيل المراسي والنوادي",
          body: "إدارة المراسي والصالات بتقنيات ذكية ومزايا فاخرة وبرامج ضيافة للأعضاء.",
          detail: "تقنية الأرصفة الذكية • صالات خاصة • فعاليات منسقة",
        },
        {
          title: "اختيار وتطوير الطاقم",
          body: "قنوات توظيف مخصصة تقيّم الشخصية واللغة والإتقان التقني بما يتماشى مع تفضيلات المالك.",
          detail: "تأهيل • جداول تناوب • تدريب مستمر",
        },
      ],
    },
    commitments: {
      badge: "التزامنا",
      title: "أكثر من إدارة، إنه عهد ثقة",
      description:
        "من غرفة القيادة إلى المرسى نطبق أعلى معايير الجودة والسلامة والاستدامة والسرية لتبقى كل رحلة سهلة لكنها محكومة بإتقان.",
      cards: [
        {
          title: "الأداء والمسؤولية",
          body: "كل اتفاقية مرتبطة بمؤشرات قابلة للقياس ولوحات متابعة ومسارات تصعيد واضحة يقودها مديرو يخوت كبار.",
        },
        {
          title: "الجودة والسلامة",
          body: "نطبق قوائم تفتيش بمعايير الأحواض وجداول صيانة أصلية وفحصين مزدوجين لضمان جاهزية الضيوف.",
        },
        {
          title: "المسؤولية البيئية",
          body: "تحديثات هجينة وتموين دائري ومواد معتمدة بيئياً لتقليل الأثر في مياه الخليج والمتوسط.",
        },
        {
          title: "سرية مطلقة",
          body: "تحمى بيانات الرحلات والهياكل الملكية وطقوس الضيوف ببروتوكولات الحاجة للمعرفة وأدوات مشفرة.",
        },
      ],
    },
    timeline: {
      badge: "خط زمني",
      title: "محطات في رحلتنا",
      items: [
        {
          year: "2012",
          title: "البدايات في دبي هاربور",
          body: "انطلقت لونيير مارينا كوكالة صغيرة تدير يختين خاصين بطاقم مكون من ثلاثة أفراد.",
        },
        {
          year: "2016",
          title: "شراكات هندسية",
          body: "اتفاقيات متعددة مع أحواض أوروبية وفرت مسارات صيانة سريعة ومصادر أصلية.",
        },
        {
          year: "2020",
          title: "مركز الأسطول العالمي",
          body: "توسعنا إلى مراقبة عن بُعد على مدار الساعة وصيانة تنبؤية وخدمات كونسييرج للتأجير.",
        },
        {
          year: "2024",
          title: "ميثاق الاستدامة",
          body: "أطلقنا تحديثات دفع هجينة وبروتوكولات تموين صفر نفايات لأساطيل الخليج.",
        },
      ],
    },
    partners: {
      badge: "شراكات",
      title: "معاً نحو التميز",
      description:
        "نتعاون مع المصممين والمهندسين البحريين والموردين العالميين الذين يشاركوننا المعايير ذاتها، لنمنح كل مالك منظومة متينة.",
      cards: [
        {
          name: "شركة لونيير مارينا للخدمات البحرية",
          focus: "إدارة اليخوت والمراسي والمرافق في موانئ المملكة",
          url: "https://seaexpertis.com/",
          link: "زيارة الموقع",
        },
        {
          name: "شركة بوت برو للخدمات البحرية",
          focus: "منصة رقمية لتأجير القوارب واليخوت ووسائط الترفيه",
          url: "https://boatpro.club/",
          link: "زيارة الموقع",
        },
        {
          name: "شركة المتكاملة للخدمات البحرية القابضة",
          focus: "كيان ينسق الهندسة والموارد البشرية والدعم الرأسمالي",
          url: "https://seaexpertis.com/",
          link: "زيارة الموقع",
        },
      ],
    },
    careers: {
      badge: "وظائف وتعاون",
      title: "انضم إلى الطاقم الذي يشكل مستقبل اليخوت في الخليج",
      description:
        "شغوف بالضيافة البحرية أو الهندسة؟ ندعم المواهب الدقيقة والمتكتمة وواسعة الخيال. شاركنا سيرتك أو مقترحك لنبتكر معاً عصر الرفاهية القادم.",
      details: [
        "برج المرجان، طريق الأمير سلطان، حي الروضة، جدة",
        "هاتف: ‎+966 53 445 7744",
        "بريد: cap.harbi@boatpro.club",
        "https://seaexpertis.com • https://boatpro.club",
      ],
      panelTitle: "اعمل معنا",
      panelBody:
        "أرسل ملفاتك لأدوار الهندسة أو تجربة الضيوف أو الاستدامة. نوفر الإرشاد والتدريب وفرصاً في دبي وجدة وموناكو وبودروم.",
      panelCta: "شارك ملفك",
    },
    cta: {
      badge: "الخطوة التالية",
      title: "هل أنت جاهز للموسم المقبل؟",
      description:
        "شاركنا أهداف أسطولك وسنصمم برنامجاً خاصاً يغطي الجوانب الفنية والضيافة والاستدامة.",
      button: "تحدث مع الكونسييرج",
    },
  },
};

export default function AboutPage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const missionRef = useRef<HTMLElement | null>(null);
  const valuesRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const { language, dir } = useLanguage();
  const content = ABOUT_CONTENT[language];

  useAboutAnimations({
    rootRef,
    heroRef,
    storyRef,
    missionRef,
    valuesRef,
    timelineRef,
    ctaRef,
  });

  return (
    <main className={styles.page} ref={rootRef} style={{ direction: dir }}>
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroAura} aria-hidden="true" />
        <p className={styles.heroBadge} data-animate="hero">
          {content.hero.badge}
        </p>
        <h1 data-animate="hero">
          {content.hero.title.map((line, index) => (
            <span key={`${line}-${index}`}>
              {line}
              {index !== content.hero.title.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.heroLead} data-animate="hero">
          {content.hero.lead}
        </p>
        <div className={styles.heroStats}>
          {content.hero.stats.map((stat) => (
            <article data-animate="hero" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection} ref={storyRef}>
        <div className={styles.storyText} data-animate="story-text">
          <p className={styles.sectionBadge}>{content.story.badge}</p>
          <h2>{content.story.title}</h2>
          {content.story.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className={styles.storyMedia} data-animate="story-media">
          <div className={styles.mediaGlow} aria-hidden="true" />
          <Image
            src="/api/images/slug/about-story"
            alt="Crew preparing a luxury yacht for departure"
            width={620}
            height={760}
            className={styles.storyImage}
            priority={false}
          />
          <div className={styles.storyCard}>
            <p>{content.story.card.label}</p>
            <strong>{content.story.card.value}</strong>
            <span>{content.story.card.helper}</span>
          </div>
        </div>
      </section>

      <section className={styles.missionSection} ref={missionRef}>
        {content.missionVision.map((item) => (
          <article
            key={item.title}
            className={styles.missionCard}
            data-animate="mission-card"
          >
            <span className={styles.cardIcon} aria-hidden="true">
              {item.icon === "mission" ? "◆" : "◇"}
            </span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>

      <section className={styles.valuesSection} ref={valuesRef}>
        <div className={styles.valuesIntro}>
          <p className={styles.sectionBadge}>{content.values.badge}</p>
          <h2>{content.values.title}</h2>
          <p>{content.values.description}</p>
        </div>
        <div className={styles.valuesGrid}>
          {content.values.cards.map((value) => (
            <article
              key={value.title}
              className={styles.valueCard}
              data-animate="value-card"
            >
              <span aria-hidden="true">✦</span>
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.clientSection}>
        <div className={styles.clientGrid}>
          <article className={styles.clientCard}>
            <p className={styles.sectionBadge}>{content.client.badge}</p>
            <h2>{content.client.title}</h2>
            {content.client.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p>
              <strong>{content.client.quote}</strong>
            </p>
          </article>
          <article className={styles.clientCard}>
            <h3>{content.client.highlightsTitle}</h3>
            <ul>
              {content.client.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.servicesIntro}>
          <p className={styles.sectionBadge}>{content.serviceSuite.badge}</p>
          <h2>{content.serviceSuite.title}</h2>
          <p>{content.serviceSuite.description}</p>
        </div>
        <div className={styles.servicesGrid}>
          {content.serviceSuite.cards.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span>{service.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.commitmentsSection}>
        <div className={styles.commitmentsIntro}>
          <p className={styles.sectionBadge}>{content.commitments.badge}</p>
          <h2>{content.commitments.title}</h2>
          <p>{content.commitments.description}</p>
        </div>
        <div className={styles.commitmentsGrid}>
          {content.commitments.cards.map((item) => (
            <article key={item.title} className={styles.commitmentCard}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.timelineSection} ref={timelineRef}>
        <div className={styles.timelineIntro}>
          <p className={styles.sectionBadge}>{content.timeline.badge}</p>
          <h2>{content.timeline.title}</h2>
        </div>
        <div className={styles.timelineTrack}>
          {content.timeline.items.map((item) => (
            <article
              key={item.year}
              className={styles.timelineItem}
              data-animate="milestone"
            >
              <div className={styles.timelineYear}>{item.year}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.partnersSection}>
        <div className={styles.partnersIntro}>
          <p className={styles.sectionBadge}>{content.partners.badge}</p>
          <h2>{content.partners.title}</h2>
          <p>{content.partners.description}</p>
        </div>
        <div className={styles.partnersGrid}>
          {content.partners.cards.map((partner) => (
            <article key={partner.name} className={styles.partnerCard}>
              <h3>{partner.name}</h3>
              <p>{partner.focus}</p>
              <Link href={partner.url} target="_blank" rel="noopener noreferrer">
                {partner.link} <span aria-hidden="true">➝</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.careersSection}>
        <div className={styles.careersCopy}>
          <p className={styles.sectionBadge}>{content.careers.badge}</p>
          <h2>{content.careers.title}</h2>
          <p>{content.careers.description}</p>
          <ul>
            {content.careers.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className={styles.careersPanel}>
          <h3>{content.careers.panelTitle}</h3>
          <p>{content.careers.panelBody}</p>
          <Link href="/contact" className={styles.careersButton}>
            {content.careers.panelCta} <span aria-hidden="true">➝</span>
          </Link>
        </div>
      </section>

      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaCopy}>
          <p className={styles.sectionBadge}>{content.cta.badge}</p>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.description}</p>
        </div>
        <Link href="/contact" className={styles.ctaButton}>
          {content.cta.button} <span aria-hidden="true">➝</span>
        </Link>
      </section>
    </main>
  );
}