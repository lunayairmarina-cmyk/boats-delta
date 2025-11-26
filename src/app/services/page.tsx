"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useServicesAnimations } from "@/hooks/useServicesAnimations";
import RotatingBorderButton from "@/components/RotatingBorderButton";
import ServicesList from "@/components/ServicesList";
import { useLanguage, Locale } from "@/context/LanguageContext";
import styles from "./page.module.css";

const SERVICES_CONTENT: Record<
  Locale,
  {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    overview: {
      badge: string;
      title: string;
      description: string;
    };
    services: Array<{
      id: number;
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      icon: string;
    }>;
    featured: {
      badge: string;
      title: string;
      description: string;
      stats: Array<{ value: string; label: string }>;
      cta: string;
    };
    process: {
      badge: string;
      title: string;
      description: string;
      steps: Array<{ step: number; title: string; description: string }>;
    };
    cta: {
      title: string[];
      description: string;
      primary: string;
      secondary: string;
    };
  }
> = {
  en: {
    hero: {
      eyebrow: "Exceptional Marine Luxury",
      title: "Lunier Marina Services",
      description:
        "The yachting industry has evolved tremendously. Owning a yacht now demands precise management of a complex asset. We deliver total peace of mind with comprehensive management and operations support so you enjoy the sea while we handle the details.",
      primaryCta: "Book a Consultation",
      secondaryCta: "Learn About Our Vision",
    },
    overview: {
      badge: "Our Services",
      title: "Comprehensive Yacht Management",
      description:
        "Lunier Marina offers an unparalleled range of services to meet every owner's requirements. Whether you need operational support, technical assistance, or financial oversight, choose our integrated approach or request a tailored module.",
    },
    services: [
      {
        id: 1,
        title: "Yacht & Boat Management",
        subtitle: "Comprehensive 360° Management",
        description:
          "We provide a complete solution covering operational, technical, and financial oversight. From crew supervision and periodic maintenance to budget management and maritime compliance, we handle everything.",
        features: [
          "Crew Supervision",
          "Maintenance",
          "Budget Management",
          "Regulatory Compliance",
        ],
        icon: "Anchor",
      },
      {
        id: 2,
        title: "Visiting Yacht Agency",
        subtitle: "Maritime Procedures Facilitation",
        description:
          "We welcome visiting yachts to Saudi shores and manage every procedure for a smooth arrival and departure—entry permits, customs clearance, and required documentation included.",
        features: [
          "Entry Permits",
          "Customs Clearance",
          "Documentation",
          "Logistics",
        ],
        icon: "Waves",
      },
      {
        id: 3,
        title: "Marina & Club Operations",
        subtitle: "Luxury Marina Management",
        description:
          "We operate marinas to the highest international standards, providing a safe and refined environment. We also run yacht clubs with recreational services and exclusive amenities.",
        features: [
          "Marina Management",
          "Club Operations",
          "Smart Technology",
          "Exclusive Amenities",
        ],
        icon: "Umbrella",
      },
      {
        id: 4,
        title: "Crew Recruitment Services",
        subtitle: "Professional & Qualified Crew",
        description:
          "The right crew defines the onboard experience. Our recruitment team carefully vets candidates to match your preferences in skill, personality, and service mindset.",
        features: [
          "Careful Selection",
          "Skills Matching",
          "Personality Fit",
          "Continuous Training",
        ],
        icon: "Users",
      },
    ],
    featured: {
      badge: "Featured Service",
      title: "Comprehensive 360° Management",
      description:
        "A modular management program covering every operational, technical, and financial touchpoint. Opt for full coverage or select only what you need—we keep your vessel guest-ready around the clock.",
      stats: [
        { value: "360°", label: "Comprehensive Approach" },
        { value: "24/7", label: "Dedicated Support" },
        { value: "100%", label: "Operational Oversight" },
      ],
      cta: "Book a Free Consultation",
    },
    process: {
      badge: "How We Work",
      title: "Simple and Transparent Process",
      description: "We follow a structured path to deliver seamless service.",
      steps: [
        {
          step: 1,
          title: "Contact",
          description: "Connect via phone or email to outline your needs.",
        },
        {
          step: 2,
          title: "Consultation",
          description: "We analyze requirements and recommend tailored solutions.",
        },
        {
          step: 3,
          title: "Planning",
          description:
            "A detailed operational and technical plan keeps every detail aligned.",
        },
        {
          step: 4,
          title: "Delivery",
          description:
            "We execute the agreed scope with proactive monitoring and reporting.",
        },
        {
          step: 5,
          title: "Support",
          description: "Continuous 24/7 coverage ensures total peace of mind.",
        },
      ],
    },
    cta: {
      title: [
        "Lunier Marina",
        "More than management—a partnership in luxury and excellence",
      ],
      description:
        "Ready to begin your exceptional marine journey? Contact us for a free consultation and discover the ideal management program for your yacht.",
      primary: "Contact Us",
      secondary: "Learn More",
    },
  },
  ar: {
    hero: {
      eyebrow: "رفاهية بحرية استثنائية",
      title: "خدمات لونيير مارينا",
      description:
        "تطور عالم اليخوت يتطلب إدارة دقيقة لأصل معقد. نوفر لك راحة البال الكاملة عبر خدمات إدارة وتشغيل متكاملة، لتستمتع بالبحر بينما نتولى نحن جميع التفاصيل.",
      primaryCta: "احجز استشارة",
      secondaryCta: "تعرّف على رؤيتنا",
    },
    overview: {
      badge: "خدماتنا",
      title: "إدارة شاملة لليخوت",
      description:
        "تقدم لونيير مارينا مجموعة خدمات لا مثيل لها لتلبية جميع متطلبات الملاك. سواء احتجت إلى دعم تشغيلي أو فني أو مالي، يمكنك اختيار نهج متكامل أو تصميم باقة مخصصة.",
    },
    services: [
      {
        id: 1,
        title: "إدارة اليخوت والقوارب",
        subtitle: "إدارة شاملة بزاوية 360°",
        description:
          "نقدم حلاً متكاملاً يشمل الجوانب التشغيلية والفنية والمالية. من الإشراف على الطاقم والصيانة الدورية إلى إدارة الميزانية والامتثال البحري، نتولى كل التفاصيل.",
        features: [
          "إشراف الطاقم",
          "الصيانة",
          "إدارة الميزانية",
          "الامتثال للأنظمة",
        ],
        icon: "Anchor",
      },
      {
        id: 2,
        title: "وكالة اليخوت الزائرة",
        subtitle: "تسهيل الإجراءات البحرية",
        description:
          "نستقبل اليخوت الزائرة إلى سواحل المملكة وندير جميع الإجراءات لضمان وصول ومغادرة سلسة، بما في ذلك تصاريح الدخول والتخليص الجمركي والمستندات المطلوبة.",
        features: [
          "تصاريح الدخول",
          "التخليص الجمركي",
          "إعداد المستندات",
          "الدعم اللوجستي",
        ],
        icon: "Waves",
      },
      {
        id: 3,
        title: "تشغيل المراسي والنوادي",
        subtitle: "إدارة مراسي فاخرة",
        description:
          "ندير المراسي وفق أعلى المعايير الدولية ونوفر بيئة آمنة وراقية للرسو. كما نشغّل النوادي البحرية بخدمات ترفيهية ومزايا حصرية للأعضاء.",
        features: [
          "إدارة المراسي",
          "تشغيل النوادي",
          "تقنيات ذكية",
          "مزايا حصرية",
        ],
        icon: "Umbrella",
      },
      {
        id: 4,
        title: "توظيف الطاقم",
        subtitle: "طاقم محترف ومؤهل",
        description:
          "اختيار الطاقم المناسب أساس التجربة الفاخرة. يقوم فريق التوظيف بانتقاء المرشحين بعناية ليتوافقوا مع تفضيلاتك من حيث المهارات والشخصية.",
        features: [
          "اختيار دقيق",
          "مواءمة المهارات",
          "انسجام الشخصية",
          "تدريب مستمر",
        ],
        icon: "Users",
      },
    ],
    featured: {
      badge: "خدمة مميزة",
      title: "إدارة شاملة بزاوية 360°",
      description:
        "برنامج إدارة مرن يغطي كل نقطة تشغيلية وفنية ومالية. يمكنك اختيار تغطية كاملة أو خدمات محددة، مع ضمان جاهزية قاربك واستعداد الطاقم على مدار الساعة.",
      stats: [
        { value: "360°", label: "منهج متكامل" },
        { value: "24/7", label: "دعم متواصل" },
        { value: "100%", label: "رقابة تشغيلية" },
      ],
      cta: "احجز استشارة مجانية",
    },
    process: {
      badge: "آلية العمل",
      title: "خطوات واضحة وشفافة",
      description: "نتّبع مسارًا منهجيًا لضمان تجربة سلسة من البداية للنهاية.",
      steps: [
        {
          step: 1,
          title: "التواصل",
          description: "تواصل معنا عبر الهاتف أو البريد لعرض احتياجاتك.",
        },
        {
          step: 2,
          title: "الاستشارة",
          description:
            "نحلل المتطلبات ونقترح حلولًا مخصصة لليخت أو القارب الخاص بك.",
        },
        {
          step: 3,
          title: "التخطيط",
          description:
            "نضع خطة دقيقة تغطي الجوانب التشغيلية والفنية والمالية.",
        },
        {
          step: 4,
          title: "التنفيذ",
          description:
            "نبدأ تنفيذ الخدمات المتفق عليها مع متابعة وتقارير مستمرة.",
        },
        {
          step: 5,
          title: "الدعم",
          description: "نوفر دعمًا متواصلًا على مدار الساعة لراحة بالك.",
        },
      ],
    },
    cta: {
      title: ["لونيير مارينا", "أكثر من إدارة، إنها شراكة نحو الفخامة والتميز"],
      description:
        "هل أنت مستعد لبدء رحلتك البحرية الاستثنائية؟ تواصل معنا للحصول على استشارة مجانية واكتشف البرنامج الأنسب لإدارة يختك.",
      primary: "تواصل معنا",
      secondary: "اعرف المزيد",
    },
  },
};

export default function ServicesPage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const featuredRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const { language, dir } = useLanguage();
  const content = SERVICES_CONTENT[language];
  const [heroBgImage, setHeroBgImage] = useState("/api/images/slug/ocean-sunrise");
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);

  // Fetch the latest image URLs
  useEffect(() => {
    const updateImages = async () => {
      try {
        const response = await fetch("/api/admin/images?slug=ocean-sunrise", {
          cache: 'no-store',
        });
        if (response.ok) {
          const images = await response.json();
          const image = Array.isArray(images) && images.length > 0 ? images[0] : null;
          if (image?._id) {
            // Use image ID for better cache control (cache headers handle freshness)
            setHeroBgImage(`/api/images/${image._id}`);
            setFeaturedImageId(image._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };
    updateImages();
    
    // Re-fetch every 30 seconds to check for updates
    const interval = setInterval(updateImages, 30000);
    return () => clearInterval(interval);
  }, []);

  useServicesAnimations({
    rootRef,
    heroRef,
    servicesRef,
    featuredRef,
    processRef,
    ctaRef,
  });

  return (
    <main className={styles.page} ref={rootRef} style={{ direction: dir }}>
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        ref={heroRef}
        style={{
          backgroundImage: `linear-gradient(145deg, rgba(1, 6, 18, 0.85), rgba(9, 30, 58, 0.55)), url(${heroBgImage})`,
        }}
      >
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow} data-animate="hero">
            {content.hero.eyebrow}
          </p>
          <h1 className={styles.heroTitle} data-animate="hero">
            {content.hero.title}
          </h1>
          <p className={styles.heroSubtitle} data-animate="hero">
            {content.hero.description}
          </p>
          <div className={styles.heroActions} data-animate="hero">
            <Link href="/contact" className={styles.primaryBtn}>
              {content.hero.primaryCta} <span aria-hidden="true">➝</span>
            </Link>
            <Link href="/about" className={styles.secondaryBtn}>
              {content.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview Cards */}
      <section className={styles.servicesSection} ref={servicesRef}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionBadge} data-animate="services">
            {content.overview.badge}
          </p>
          <h2 className={styles.sectionTitle} data-animate="services">
            {content.overview.title}
          </h2>
          <p className={styles.sectionDescription} data-animate="services">
            {content.overview.description}
          </p>
        </div>
        <ServicesList
          compact
          showHeader={false}
        />
      </section>

      {/* Featured Service Highlight */}
      <section className={styles.featuredSection} ref={featuredRef}>
        <div className={styles.featuredContent}>
          <div className={styles.featuredText} data-animate="featured">
            <p className={styles.sectionBadge}>{content.featured.badge}</p>
            <h2>{content.featured.title}</h2>
            <p className={styles.featuredDescription}>
              {content.featured.description}
            </p>
            <div className={styles.featuredStats}>
              {content.featured.stats.map((stat) => (
                <div className={styles.statItem} key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className={styles.featuredBtn}>
              <RotatingBorderButton text={content.featured.cta} />
            </Link>
          </div>
          <div className={styles.featuredMedia} data-animate="featured">
            <div className={styles.featuredImageWrapper}>
              <Image
                src={featuredImageId ? `/api/images/${featuredImageId}` : "/api/images/slug/ocean-sunrise"}
                alt="Luxury yacht management services"
                width={600}
                height={700}
                className={styles.featuredImage}
                unoptimized={true}
                priority={false}
              />
              <div className={styles.featuredGlow} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection} ref={processRef}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionBadge} data-animate="process">
            {content.process.badge}
          </p>
          <h2 className={styles.sectionTitle} data-animate="process">
            {content.process.title}
          </h2>
          <p className={styles.sectionDescription} data-animate="process">
            {content.process.description}
          </p>
        </div>
        <div className={styles.processSteps}>
          {content.process.steps.map((step, index) => (
            <article
              key={step.step}
              className={styles.processStep}
              data-animate="process-step"
              data-index={index}
            >
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaContent} data-animate="cta">
          <div className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>
            {content.cta.title.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index !== content.cta.title.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className={styles.ctaDescription}>{content.cta.description}</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimaryBtn}>
              {content.cta.primary} <span aria-hidden="true">➝</span>
            </Link>
            <Link href="/about" className={styles.ctaSecondaryBtn}>
              {content.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


