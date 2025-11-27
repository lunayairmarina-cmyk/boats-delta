"use client";

import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import { useLanguage, Locale } from "@/context/LanguageContext";
import {
  getMailHref,
  getPhoneHref,
  handlePhoneIntent,
} from "@/lib/contactInfo";
import styles from "./page.module.css";

type HighlightItem = {
  label: string;
  value: string;
  helper: string;
  type?: "phone" | "email";
};

const CONTACT_CONTENT: Record<
  Locale,
  {
    hero: {
      badge: string;
      title: string;
      lead: string;
    };
    highlights: HighlightItem[];
    access: Array<{ title: string; body: string; action: string }>;
    map: {
      badge: string;
      title: string;
      description: string;
      tag: string;
      hours: Array<{ day: string; time: string }>;
    };
  }
> = {
  en: {
    hero: {
      badge: "contact lunier marina",
      title: "Let's plot your next voyage together",
      lead:
        "Our concierge team blends meticulous yacht management with the warmth of a private club. Reach out for bespoke maintenance plans, rapid turnarounds, or a discreet guest experience anywhere on the globe.",
    },
    highlights: [
      {
        label: "Concierge line",
        value: "0534457744",
        helper: "Daily • 7am – 11pm AST",
        type: "phone",
      },
      {
        label: "Email",
        value: "cap.harbi@boatpro.club",
        helper: "Responses within 24h",
        type: "email",
      },
      {
        label: "Head office",
        value: "Al Murjan Tower, Prince Sultan Road, Al Rawdah, Jeddah",
        helper: "Private appointments only",
      },
    ],
    access: [
      {
        title: "Plan a visit",
        body: "Schedule a walkthrough of your vessel or meet our engineering partners in person.",
        action: "Book a lounge pass",
      },
      {
        title: "Emergency desk",
        body: "24/7 monitoring for mechanical alerts, weather routing, and on-call crew swaps.",
        action: "Ping duty officer",
      },
      {
        title: "Charter concierge",
        body: "We coordinate provisioning, customs clearance and guest experiences worldwide.",
        action: "Design an itinerary",
      },
    ],
    map: {
      badge: "visit the lounge",
      title: "Executive lounge at Al Murjan Tower",
      description:
        "Inside Al Murjan Tower on Prince Sultan Road, our private lounge offers chart tables, engineering showcases, and a tasting bar curated for owners. Book ahead so our concierge can prepare your preferred refreshments.",
      tag: "Jeddah • Al Murjan Tower",
      hours: [
        { day: "Monday – Thursday", time: "08:00 – 20:00 AST" },
        { day: "Friday", time: "09:00 – 18:00 AST" },
        { day: "Saturday", time: "10:00 – 16:00 AST" },
        { day: "Sunday", time: "By appointment only" },
      ],
    },
  },
  ar: {
    hero: {
      badge: "تواصل مع لونيير مارينا",
      title: "دعنا نخطط رحلتك البحرية القادمة معًا",
      lead:
        "يجمع فريق الكونسييرج بين إدارة اليخوت الدقيقة ودفء الأندية الخاصة. تواصل معنا لخطط صيانة مخصصة أو استجابات عاجلة أو تجربة ضيوف خاصة في أي وجهة حول العالم.",
    },
    highlights: [
      {
        label: "خط الكونسييرج",
        value: "0534457744",
        helper: "يومياً • 7 صباحاً – 11 مساءً بتوقيت السعودية",
        type: "phone",
      },
      {
        label: "البريد الإلكتروني",
        value: "cap.harbi@boatpro.club",
        helper: "نرد خلال 24 ساعة",
        type: "email",
      },
      {
        label: "المكتب الرئيسي",
        value: "برج المرجان، طريق الأمير سلطان، حي الروضة، جدة",
        helper: "حسب المواعيد المسبقة فقط",
      },
    ],
    access: [
      {
        title: "خطط للزيارة",
        body: "احجز جولة على متن يختك أو لقاءً مع شركائنا الهندسيين حضورياً.",
        action: "احجز تصريح الدخول",
      },
      {
        title: "مكتب الطوارئ",
        body: "مراقبة على مدار الساعة للتنبيهات الميكانيكية ومسارات الطقس وتبديل الطاقم.",
        action: "تواصل مع الضابط المناوب",
      },
      {
        title: "كونسييرج التأجير",
        body: "ننسق التموين والتخليص الجمركي وتجارب الضيوف حول العالم.",
        action: "صمّم خط سير",
      },
    ],
    map: {
      badge: "زر الصالة",
      title: "الصالة التنفيذية في برج المرجان",
      description:
        "داخل برج المرجان على طريق الأمير سلطان، تمنحك صالتنا الخاصة طاولات ملاحة ومعارض هندسية وركن تذوق معداً للمالكين. احجز مسبقاً ليجهز الكونسييرج ضيافتك المفضلة.",
      tag: "جدة • برج المرجان",
      hours: [
        { day: "الإثنين – الخميس", time: "08:00 – 20:00" },
        { day: "الجمعة", time: "09:00 – 18:00" },
        { day: "السبت", time: "10:00 – 16:00" },
        { day: "الأحد", time: "حسب الموعد" },
      ],
    },
  },
};

export default function ContactPage() {
  const { language, dir } = useLanguage();
  const content = CONTACT_CONTENT[language];
  const phoneHref = getPhoneHref();
  const mailHref = getMailHref();
  const CONTACT_FORM_ID = "contact-form";

  const scrollToContactForm = () => {
    const section = document.getElementById(CONTACT_FORM_ID);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderHighlightValue = (item: HighlightItem) => {
    if (item.type === "phone") {
      return (
        <a
          href={phoneHref}
          onClick={(event) => handlePhoneIntent(event)}
          className={`${styles.highlightValue} ${styles.highlightLink}`}
          data-variant="phone"
          dir="ltr"
          aria-label={`${item.label} ${item.value}`}
        >
          {item.value}
        </a>
      );
    }

    if (item.type === "email") {
      return (
        <a
          href={mailHref}
          className={`${styles.highlightValue} ${styles.highlightLink}`}
          data-variant="email"
          aria-label={`${item.label} ${item.value}`}
        >
          {item.value}
        </a>
      );
    }

    return <span className={styles.highlightValue}>{item.value}</span>;
  };

  return (
    <main className={styles.page} style={{ direction: dir }}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroBadge}>{content.hero.badge}</p>
          <h1>{content.hero.title}</h1>
          <p className={styles.heroLead}>{content.hero.lead}</p>

          <div className={styles.highlightGrid}>
            {content.highlights.map((item) => (
              <article key={item.label} className={styles.highlightCard}>
                <p className={styles.highlightLabel}>{item.label}</p>
                {renderHighlightValue(item)}
                <p className={styles.highlightHelper}>{item.helper}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.heroMedia}>
          <div className={styles.mediaGlow} aria-hidden="true" />
          <Image
            src="/api/images/slug/contact-hero"
            alt="Concierge preparing a luxury yacht itinerary"
            width={720}
            height={960}
            className={styles.heroImage}
            priority
            unoptimized={true}
          />
          <div className={styles.mediaCard}>
            <p>Average response</p>
            <strong>13 minutes</strong>
            <span>Global fleet clients • 2025</span>
          </div>
        </div>
      </section>

      <section className={styles.accessSection}>
        {content.access.map((detail) => (
          <article key={detail.title} className={styles.accessCard}>
            <p className={styles.accessLabel}>●</p>
            <div>
              <h2>{detail.title}</h2>
              <p>{detail.body}</p>
            </div>
            <button
              type="button"
              className={styles.accessAction}
              onClick={scrollToContactForm}
              aria-controls={CONTACT_FORM_ID}
            >
              {detail.action}
              <span aria-hidden="true">➝</span>
            </button>
          </article>
        ))}
      </section>

      <ContactSection />

      <section className={styles.mapSection}>
        <div className={styles.mapContent}>
          <div className={styles.mapCopy}>
            <p className={styles.mapBadge}>{content.map.badge}</p>
            <h2>{content.map.title}</h2>
            <p>{content.map.description}</p>

            <ul className={styles.hoursList}>
              {content.map.hours.map((slot) => (
                <li key={slot.day}>
                  <span>{slot.day}</span>
                  <span>{slot.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.mapFrame}>
            <Image
              src="/api/images/slug/contact-map"
              alt="Aerial view of the Red Sea coastline"
              width={720}
              height={520}
              className={styles.mapImage}
              priority={false}
              unoptimized={true}
            />
            <div className={styles.mapTag}>
              {content.map.tag}
              <span aria-hidden="true">⛵</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}





