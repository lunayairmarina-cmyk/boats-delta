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

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M6.5 3.5A2.1 2.1 0 0 1 8.6 2h2.1c.9 0 1.7.6 1.9 1.4l.6 2.4c.2.8-.1 1.7-.8 2.2l-1.1.8c.7 1.5 1.8 2.7 3.3 3.3l.8-1.1c.5-.7 1.4-1 2.2-.8l2.4.6c.8.2 1.4 1 1.4 1.9v2.1a2.1 2.1 0 0 1-1.5 2.1c-1.6.4-5 .8-8.7-2.9C5.7 11 6.1 7.6 6.5 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

  const scrollToContactForm = () => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("contact-form");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <PhoneIcon className={styles.phoneIcon} />
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

  const renderHighlightHelper = (item: HighlightItem) => {
    // For the Arabic concierge line, replace the middle dot with a styled icon
    if (language === "ar" && item.type === "phone") {
      const parts = item.helper.split("•");
      const before = parts[0] ?? "";
      const after = parts[1] ?? "";

      return (
        <p className={styles.highlightHelper}>
          {before.trim()}{" "}
          <span className={styles.helperIcon} aria-hidden="true" />
          {" "}{after.trim()}
        </p>
      );
    }

    return <p className={styles.highlightHelper}>{item.helper}</p>;
  };

  return (
    <main className={styles.page} style={{ direction: dir }}>
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} aria-hidden="true" />
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroBeams} aria-hidden="true" />
        <div className={styles.heroOrbs} aria-hidden="true" />
        <div className={styles.heroNoise} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.heroBadge}>{content.hero.badge}</p>
          <h1>{content.hero.title}</h1>
          <p className={styles.heroLead}>{content.hero.lead}</p>

          <div className={styles.highlightGrid}>
            {content.highlights.map((item) => (
              <article key={item.label} className={styles.highlightCard}>
                <p className={styles.highlightLabel}>{item.label}</p>
                {renderHighlightValue(item)}
                {renderHighlightHelper(item)}
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





