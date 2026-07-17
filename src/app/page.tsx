"use client";
/* eslint-disable @next/next/no-img-element -- this page uses responsive image cards and decorative PNG assets */

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Database, Droplet, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePersistentState } from "@/app/components/usePersistentState";

type Language = "en" | "ja" | "fr" | "zh";

const heroFeatureLinks = [
  { href: "/main", icon: Droplet },
  { href: "/main/alerts", icon: ShieldAlert },
  { href: "/main/pools", icon: Database },
] as const;

const languageLabels: Record<Language, string> = {
  en: "EN",
  ja: "日",
  fr: "FR",
  zh: "中",
};

const oceanGalleryRows = [
  [
    { src: "/images/home/oyster-open.png", alt: "水下张开的牡蛎" },
    { src: "/images/home/scallop-open.png", alt: "水下张开的扇贝" },
    { src: "/images/home/oyster-closed.png", alt: "水下闭合的牡蛎" },
    { src: "/images/home/clam.png", alt: "水下闭合的蛤蜊" },
  ],
  [
    { src: "/images/home/mussel.png", alt: "水下黑色贻贝" },
    { src: "/images/home/shellfish-larvae.png", alt: "水中的贝类浮游幼体" },
    { src: "/images/home/marine-fish.png", alt: "水下海水鱼" },
    { src: "/images/home/abalone.png", alt: "水下鲍鱼" },
  ],
] as const;

const imageSets = [
  [
    "/images/home/oyster-open.png",
    "/images/home/scallop-open.png",
    "/images/home/marine-fish.png",
  ],
  [
    "/images/home/shellfish-larvae.png",
    "/images/home/clam.png",
    "/images/home/mussel.png",
  ],
  [
    "/images/home/abalone.png",
    "/images/home/oyster-closed.png",
    "/images/home/project-glass-cube.png",
  ],
];

const projectLinks = ["/main", "/main/alerts", "/main/pools"] as const;

const translations = {
  en: {
    nav: ["About", "Services", "Projects", "Contact"],
    hero: "Hello, Jack",
    contact: "Contact Me",
    aboutTitle: "About the Project",
    aboutLines: ["This website supports shellfish hatchery operations with live monitoring, alerts, pool management, dosing evaluation and follow-up tracking.", "It brings key data and operating conditions together so staff can identify issues, respond to exceptions and understand the overall situation efficiently."],
    heroFeatures: ["Live Monitoring", "Exception Alerts", "Data Management"],
    services: "Services",
    project: "Project",
    live: "Live Project",
    back: "Back to top ↑",
    marqueeAlt: "3D motion project preview",
    serviceItems: [
      ["Live Water Quality Monitoring", "Continuously displays temperature, pH, dissolved oxygen, salinity, turbidity and ammonia nitrogen so staff can quickly understand each hatchery pool's current environment."],
      ["Exception Alert Management", "Shows alert level, affected metric and hatchery pool whenever data leaves its normal range, while recording handling status and the response process."],
      ["Post-dosing Effect Monitoring", "Compares water quality before and after dosing and tracks indicator trends to assess whether conditions have stabilized and the intervention achieved its goal."],
      ["Hatchery Pool Data Management", "Centralizes pool, species and batch information with access to historical monitoring, water-quality trends, exception records and related reports."],
      ["Monitoring Report Generation", "Summarizes water-quality data, exception records and stage-by-stage changes into clear reports for archiving, review and follow-up management."],
    ],
    projects: [
      ["Live Water Quality Console", "System Function"],
      ["Alert and Response Center", "Monitoring Case"],
      ["Hatchery Pool Data Center", "Data Management"],
    ],
  },
  ja: {
    nav: ["私について", "サービス", "作品", "連絡先"],
    hero: "ハロー、Jack",
    contact: "お問い合わせ",
    aboutTitle: "プロジェクトについて",
    aboutLines: ["本サイトは貝類の種苗生産工程を中心に、リアルタイム監視、異常警報、育苗池管理、投入評価、投入後追跡を提供します。", "重要データと稼働状況を一元表示し、問題の発見、異常対応、全体状況の把握を効率化します。"],
    heroFeatures: ["リアルタイム監視", "異常警報", "データ管理"],
    services: "サービス",
    project: "プロジェクト",
    live: "プロジェクトを見る",
    back: "トップへ ↑",
    marqueeAlt: "3Dモーション作品プレビュー",
    serviceItems: [
      ["リアルタイム水質監視", "水温、pH、溶存酸素、塩分、濁度、アンモニア性窒素を継続表示し、各育苗池の環境を迅速に把握できます。"],
      ["異常警報管理", "監視値が正常範囲を外れた際に警報レベル、異常項目、対象育苗池を表示し、対応状況と処理経過を記録します。"],
      ["投入後効果監視", "投入前後の水質を比較し、指標の推移から環境の安定回復と投入効果を確認します。"],
      ["育苗池データ管理", "育苗池、養殖品種、ロット情報を一元管理し、履歴、傾向、異常記録、関連レポートを確認できます。"],
      ["監視レポート作成", "水質データ、異常記録、段階的変化をまとめ、保存・確認・継続管理に使える明確なレポートを作成します。"],
    ],
    projects: [
      ["リアルタイム水質コンソール", "システム機能"],
      ["警報・対応センター", "監視事例"],
      ["育苗池データセンター", "データ管理"],
    ],
  },
  fr: {
    nav: ["À propos", "Services", "Projets", "Contact"],
    hero: "Salut, Jack",
    contact: "Me contacter",
    aboutTitle: "À propos du projet",
    aboutLines: ["Ce site accompagne l'élevage larvaire des coquillages avec le suivi en temps réel, les alertes, la gestion des bassins, l'évaluation des traitements et leur suivi.", "Il centralise les données clés et l'état des opérations afin d'identifier les problèmes, traiter les anomalies et comprendre rapidement la situation globale."],
    heroFeatures: ["Suivi en temps réel", "Alertes d'anomalie", "Gestion des données"],
    services: "Services",
    project: "Projet",
    live: "Voir le projet",
    back: "Retour en haut ↑",
    marqueeAlt: "Aperçu de projet 3D animé",
    serviceItems: [
      ["Suivi de la qualité de l'eau", "Affiche en continu la température, le pH, l'oxygène dissous, la salinité, la turbidité et l'azote ammoniacal pour connaître rapidement l'état de chaque bassin."],
      ["Gestion des alertes", "Indique le niveau d'alerte, le paramètre concerné et le bassin lorsque les données sortent de la plage normale, tout en enregistrant le traitement."],
      ["Suivi après traitement", "Compare la qualité de l'eau avant et après traitement et suit les tendances pour vérifier le retour à la stabilité et l'efficacité obtenue."],
      ["Gestion des données des bassins", "Centralise les bassins, espèces et lots, avec accès aux historiques, tendances, anomalies et rapports associés."],
      ["Génération de rapports", "Synthétise les données de qualité de l'eau, les anomalies et les évolutions par étape pour l'archivage, la consultation et le suivi."],
    ],
    projects: [
      ["Console de qualité de l'eau", "Fonction système"],
      ["Centre d'alerte et d'intervention", "Cas de suivi"],
      ["Centre de données des bassins", "Gestion des données"],
    ],
  },
  zh: {
    nav: ["关于项目", "服务", "项目", "联系"],
    hero: "哈喽，Jack",
    contact: "联系我",
    aboutTitle: "关于项目",
    aboutLines: ["本网站围绕贝类育苗流程，提供实时监测、异常预警、育苗池管理、投放评估与投放后跟踪等功能。", "帮助用户集中查看关键数据与运行状态，更高效地发现问题、处理异常并掌握整体情况。"],
    heroFeatures: ["实时监测", "异常预警", "数据管理"],
    services: "服务",
    project: "项目",
    live: "查看项目",
    back: "返回顶部 ↑",
    marqueeAlt: "3D 动态项目预览",
    serviceItems: [
      ["实时水质监测", "持续展示水温、pH、溶解氧、盐度、浊度和氨氮等关键指标，帮助工作人员快速掌握各育苗池的当前环境状态。"],
      ["异常预警管理", "当监测数据超出正常范围时，及时显示预警等级、异常指标和对应育苗池，并记录异常处理状态与处理过程。"],
      ["投放后效果监测", "对投放前后的水质变化进行对比，持续跟踪各项指标趋势，辅助判断环境是否恢复稳定以及投放效果是否达到预期。"],
      ["育苗池数据管理", "集中管理不同育苗池、养殖品种和批次信息，支持查看历史监测记录、水质变化趋势、异常记录和相关数据报告。"],
      ["监测报告生成", "汇总育苗池水质数据、异常记录和阶段性变化情况，形成清晰的监测报告，便于工作人员进行数据留档、结果查看和后续管理。"],
    ],
    projects: [
      ["实时水质监测平台", "系统功能"],
      ["异常预警与处置中心", "监测案例"],
      ["育苗池数据中心", "数据管理"],
    ],
  },
} satisfies Record<Language, Record<string, unknown>>;

type Copy = (typeof translations)[Language];

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const mainPageLabels: Record<string, string> = {
  "Contact Me": "Enter Main Page",
  お問い合わせ: "メインページへ",
  "Me contacter": "Entrer dans la page principale",
  联系我: "进入主页面",
};

function ContactButton({ label }: { label: string }) {
  return (
    <Link href="/main" className="contact-button">
      {mainPageLabels[label] ?? label}
      <ArrowUpRight size={18} strokeWidth={2} />
    </Link>
  );
}

function LanguageSwitcher({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="language-switcher" aria-label="Language selector">
      {(Object.keys(languageLabels) as Language[]).map((key) => (
        <button
          key={key}
          type="button"
          className={language === key ? "active" : ""}
          onClick={() => onChange(key)}
          aria-pressed={language === key}
        >
          {languageLabels[key]}
        </button>
      ))}
    </div>
  );
}

function HeroSection({
  copy,
  language,
  setLanguage,
}: {
  copy: Copy;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-3.5%", "3.5%"],
  );

  return (
    <section ref={ref} className="hero" id="home">
      <motion.div
        className="section-scroll-background hero-scroll-background"
        style={{ y: backgroundY }}
        aria-hidden="true"
      />
      <FadeIn y={-20} className="hero-nav-wrap">
        <nav className="hero-nav" aria-label="Primary navigation">
          <div className="nav-links">
            <a href="#about">{copy.nav[0]}</a>
            <a href="#services">{copy.nav[1]}</a>
            <a href="#projects">{copy.nav[2]}</a>
            <a href="mailto:hello@jack3d.studio">{copy.nav[3]}</a>
          </div>
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </nav>
      </FadeIn>
      <FadeIn delay={0.15} y={40} className="hero-heading-wrap">
        <h1 className="hero-heading hero-title">{copy.hero}</h1>
      </FadeIn>
      <div className="hero-bottom">
        <FadeIn delay={0.35} y={20} className="hero-feature-wrap">
          <nav className="hero-feature-nav" aria-label="首页功能入口">
            <ul className="hero-feature-list">
              {heroFeatureLinks.map(({ href, icon: Icon }, index) => (
                <li className="hero-feature-item" key={href}>
                  <Link className="hero-feature-link" href={href} aria-label={copy.heroFeatures[index]}>
                    <Icon aria-hidden="true" strokeWidth={1.6} />
                    <span>{copy.heroFeatures[index]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton label={copy.contact} />
        </FadeIn>
      </div>
    </section>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const firstRowX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0vw", "0vw"] : ["4vw", "-8vw"],
  );
  const secondRowX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0vw", "0vw"] : ["-2vw", "5vw"],
  );
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-3.5%", "3.5%"],
  );

  return (
    <section ref={ref} className="ocean-gallery" aria-label="网站核心功能图片画廊">
      <motion.div
        className="section-scroll-background ocean-gallery-scroll-background"
        style={{ y: backgroundY }}
        aria-hidden="true"
      />
      <div className="ocean-gallery-glow" aria-hidden="true" />
      <div className="ocean-gallery-viewport">
        {oceanGalleryRows.map((images, rowIndex) => (
          <motion.div
            className="ocean-gallery-row"
            key={rowIndex}
            style={{ x: rowIndex === 0 ? firstRowX : secondRowX }}
          >
            {images.map(({ src, alt }) => (
              <figure className="ocean-gallery-card" key={src}>
                <img src={src} alt={alt} loading="lazy" />
              </figure>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ copy }: { copy: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-3.5%", "3.5%"],
  );
  const ornaments = [
    ["shell", "/images/home/project-shell.png", -70, 0.1],
    ["water-drop", "/images/home/project-water-drop.png", 70, 0.18],
    ["glass-cube", "/images/home/project-glass-cube.png", -70, 0.24],
    ["arrow", "/images/home/project-arrow.png", 70, 0.3],
  ] as const;

  return (
    <section ref={ref} className="about project-about" id="about" aria-labelledby="project-about-title">
      <motion.div
        className="section-scroll-background project-about-scroll-background"
        style={{ y: backgroundY }}
        aria-hidden="true"
      />
      <div className="project-about-rays" aria-hidden="true" />
      {ornaments.map(([name, src, x, delay]) => (
        <FadeIn
          key={name}
          x={x}
          y={0}
          delay={delay}
          duration={0.9}
          className={`project-ornament project-ornament-${name}`}
        >
          <img src={src} alt="" aria-hidden="true" loading="lazy" />
        </FadeIn>
      ))}
      <div className="project-about-content">
        <FadeIn y={40}>
          <h2 id="project-about-title">{copy.aboutTitle}</h2>
        </FadeIn>
        <div className="project-about-copy">
          <p>{copy.aboutLines.map((line) => <span key={line}>{line}</span>)}</p>
          <FadeIn y={20}>
            <ContactButton label={copy.contact} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ copy }: { copy: Copy }) {
  return (
    <section className="services" id="services">
      <FadeIn y={40}>
        <h2 className="section-title dark-title">{copy.services}</h2>
      </FadeIn>
      <div className="services-list">
        {copy.serviceItems.map(([name, description], index) => (
          <FadeIn key={`${name}-${index}`} delay={index * 0.1}>
            <article className="service-item">
              <span className="big-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ copy, index }: { copy: Copy; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0.25, 1],
    [1, 1 - (imageSets.length - 1 - index) * 0.03],
  );
  const [name, category] = copy.projects[index];
  const images = imageSets[index];

  return (
    <div ref={ref} className="project-stage">
      <motion.article
        className="project-card"
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
      >
        <div className="project-top">
          <span className="big-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="project-category">{category}</span>
          <h3>{name}</h3>
          <Link
            className="live-button"
            href={projectLinks[index]}
          >
            {copy.live}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="project-grid">
          <div className="project-left">
            <img src={images[0]} alt={`${name} detail`} loading="lazy" />
            <img src={images[1]} alt={`${name} detail`} loading="lazy" />
          </div>
          <img
            className="project-main"
            src={images[2]}
            alt={name}
            loading="lazy"
          />
        </div>
      </motion.article>
    </div>
  );
}

function ProjectsSection({ copy }: { copy: Copy }) {
  return (
    <section className="projects" id="projects">
      <FadeIn y={40}>
        <h2 className="section-title hero-heading">{copy.project}</h2>
      </FadeIn>
      <div className="project-list">
        {imageSets.map((_, index) => (
          <ProjectCard key={index} copy={copy} index={index} />
        ))}
      </div>
      <footer>
        <span>Jack® 2026</span>
        <a href="#home">{copy.back}</a>
      </footer>
    </section>
  );
}

export default function Home() {
  const [language, setLanguage] = usePersistentState<Language>("jack-language", "zh");

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);

  const copy = translations[language];

  return (
    <main className="jack-home">
      <HeroSection
        copy={copy}
        language={language}
        setLanguage={setLanguage}
      />
      <MarqueeSection />
      <AboutSection copy={copy} />
      <ServicesSection copy={copy} />
      <ProjectsSection copy={copy} />
    </main>
  );
}
