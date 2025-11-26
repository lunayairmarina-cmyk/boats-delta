 "use client";

import Image from "next/image";
import styles from "./TestimonialsSection.module.css";
import { useLanguage } from "@/context/LanguageContext";

const testimonials = [
  {
    name: "Hannah Ward",
    role: "Freelance Product Marketer",
    avatar: "/api/images/slug/portrait-vip-1",
  },
  {
    name: "Elena Petrova",
    role: "COO at BioScale",
    avatar: "/api/images/slug/portrait-vip-2",
  },
  {
    name: "Samir Khan",
    role: "Head of Marketing at PayNow",
    avatar: "/api/images/slug/portrait-vip-3",
  },
  {
    name: "Daniel Cho",
    role: "CEO at LeadBridge",
    avatar: "/api/images/slug/portrait-vip-4",
  },
  {
    name: "Chris Donovan",
    role: "Co-founder at SparkPoint",
    avatar: "/api/images/slug/portrait-vip-5",
  },
  {
    name: "Julia Harris",
    role: "Founder at Taskly",
    avatar: "/api/images/slug/portrait-vip-6",
  },
  {
    name: "Rachel Meyer",
    role: "SaaS Growth Consultant",
    avatar: "/api/images/slug/portrait-vip-7",
  },
  {
    name: "Martin Ross",
    role: "Co-founder at BuildOps",
    avatar: "/api/images/slug/portrait-vip-8",
  },
  {
    name: "Arjun Patel",
    role: "Product Marketing Manager at DataFuse",
    avatar: "/api/images/slug/portrait-vip-9",
  },
  {
    name: "Kevin O'Neill",
    role: "Creative Director at LaunchLab",
    avatar: "/api/images/slug/portrait-vip-10",
  },
  {
    name: "Laura Kim",
    role: "Product Designer at Connectly",
    avatar: "/api/images/slug/portrait-vip-11",
  },
  {
    name: "Kelly Morgan",
    role: "Head of Growth at CloudSync",
    avatar: "/api/images/slug/portrait-vip-12",
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="reviews"
      className={styles.testimonialsSection}
      aria-labelledby="testimonials-heading"
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.testimonialsInner}>
        <h2 id="testimonials-heading">{t("testimonials.title")}</h2>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((person) => (
            <article key={person.name} className={styles.testimonialCard}>
              <Image
                src={person.avatar}
                alt={person.name}
                width={56}
                height={56}
                className={styles.avatar}
              />
              <div className={styles.testimonialCopy}>
                <p className={styles.personName}>{person.name}</p>
                <p className={styles.personRole}>{person.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

