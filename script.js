/* global gsap, ScrollTrigger */
(() => {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduced) return;

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const isMobile =
    window.matchMedia?.("(max-width: 700px), (pointer: coarse)")?.matches ?? false;
  const saveData = navigator.connection?.saveData === true;
  const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (navigator.deviceMemory ?? 8) <= 4;
  const isLowPerf = isMobile || saveData || lowCpu || lowMemory;
  const useBlurFilters = !isLowPerf;

  document.body.classList.toggle("performance-mode", isLowPerf);
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
  if (isLowPerf) {
    gsap.ticker.fps(45);
  }

  const section = document.querySelector(".hero");
  if (!section) return;

  const bgImg = section.querySelector(".hero__img");
  const bgImgBlur = section.querySelector(".hero__img--blur");
  const atmTop = section.querySelector(".hero__atmosphere--top");
  const atmSide = section.querySelector(".hero__atmosphere--side");
  const kicker = section.querySelector(".hero__kicker");
  const titleLines = Array.from(section.querySelectorAll(".hero__title .hero__line"));
  const subtitle = section.querySelector(".hero__subtitle");
  const allLines = Array.from(section.querySelectorAll(".hero__line"));
  const heroShade = section.querySelector(".hero__transition");
  const heroContent = section.querySelector(".hero__content");
  const heroNav = section.querySelector(".hero-nav");

  const chapter2 = section.querySelector(".hero__chapter--two");
  const chapter2Lines = chapter2 ? Array.from(chapter2.querySelectorAll(".chapter__line")) : [];

  // Use alternate hero banner on mobile only.
  const desktopHeroSrc = "./media/dr.jpeg";
  const mobileHeroSrc = "./media/dr3.jpeg";
  const heroSrc = isMobile ? mobileHeroSrc : desktopHeroSrc;
  if (bgImg) bgImg.src = heroSrc;
  if (bgImgBlur) bgImgBlur.src = heroSrc;

  // Initial state
  gsap.set(allLines, { autoAlpha: 0, y: 26 });
  gsap.set([kicker, subtitle], { autoAlpha: 0, y: 26 });
  gsap.set(section.querySelector(".hero__title"), { autoAlpha: 0, y: 26 });
  if (heroShade) gsap.set(heroShade, { autoAlpha: 0 });
  if (bgImgBlur) gsap.set(bgImgBlur, { autoAlpha: 0, scale: 1.08 });
  if (atmTop) gsap.set(atmTop, { autoAlpha: 0, scale: 1.02 });
  if (atmSide) gsap.set(atmSide, { autoAlpha: 0, scale: 1.03 });
  if (heroContent) gsap.set(heroContent, { autoAlpha: 1, y: 0 });
  if (heroNav) gsap.set(heroNav, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
  if (chapter2) gsap.set(chapter2, { autoAlpha: 0, y: 22 });
  if (chapter2Lines.length) {
    gsap.set(
      chapter2Lines,
      useBlurFilters ? { autoAlpha: 0, y: 40, filter: "blur(12px)" } : { autoAlpha: 0, y: 40 }
    );
  }

  // Auto intro on first load (background first, then kicker -> name -> subtitle).
  const title = section.querySelector(".hero__title");
  const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.55 });
  if (kicker) {
    intro.to(
      kicker,
      {
        autoAlpha: 1,
        y: 0,
        ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
        duration: 0.75,
      },
      0
    );
  }
  if (title) {
    intro.to(
      title,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
      },
      0.2
    );
    if (titleLines.length) {
      intro.to(
        titleLines,
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.75,
        },
        0.28
      );
    }
  }
  if (subtitle) {
    intro.to(
      subtitle,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
      },
      0.62
    );
  }

  // Scroll-driven cinematic morph (pinned) starts from the fully revealed intro state.
  const scrollTl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: isLowPerf ? "+=190%" : "+=240%",
      scrub: isLowPerf ? 0.6 : 1.15,
      pin: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    },
  });

  if (bgImg) scrollTl.to(bgImg, { scale: 1.12, ease: "sine.inOut", duration: 1.4 }, 0);

  // Start bringing in the next chapter early (no empty gap).
  if (heroNav) {
    scrollTl.to(
      heroNav,
      { autoAlpha: 0, y: -10, ease: "sine.inOut", duration: 0.6, pointerEvents: "none" },
      0.12
    );
  }
  if (heroShade) scrollTl.to(heroShade, { autoAlpha: 1, ease: "sine.inOut", duration: 1.1 }, 0.15);
  if (bgImgBlur)
    scrollTl.to(bgImgBlur, { autoAlpha: 0.78, scale: 1.12, ease: "sine.inOut", duration: 1.25 }, 0.18);
  if (atmTop) scrollTl.to(atmTop, { autoAlpha: 0.65, scale: 1.06, ease: "sine.inOut", duration: 1.2 }, 0.2);
  if (atmSide) scrollTl.to(atmSide, { autoAlpha: 0.75, scale: 1.06, ease: "sine.inOut", duration: 1.3 }, 0.24);

  // Hero content dissolves while chapter 2 emerges (overlapping).
  if (heroContent) {
    scrollTl.to(heroContent, { y: -26, ease: "sine.inOut", duration: 1.0 }, 0.22);
    scrollTl.to(heroContent, { autoAlpha: 0, ease: "sine.inOut", duration: 1.0 }, 0.28);
  }

  if (chapter2) {
    scrollTl.to(chapter2, { autoAlpha: 1, y: 0, ease: "sine.inOut", duration: 1.0 }, 0.24);
  }
  if (chapter2Lines.length) {
    scrollTl.to(
      chapter2Lines,
      {
        autoAlpha: 1,
        y: 0,
        ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
        stagger: { each: 0.06, from: "start" },
        ease: "power3.out",
        duration: 0.95,
      },
      0.28
    );
    scrollTl.to(
      chapter2Lines,
      { y: -12, ease: "sine.inOut", stagger: 0.01, duration: 1.1 },
      1.25
    );
  }

  const portfolio = document.querySelector(".portfolio");
  if (!portfolio) return;

  const portfolioVideo = portfolio.querySelector(".portfolio__video");
  const portfolioOverlay = portfolio.querySelector(".portfolio__overlay");
  const portfolioGlow = portfolio.querySelector(".portfolio__glow");
  const portfolioKicker = portfolio.querySelector(".portfolio__kicker");
  const portfolioLines = Array.from(portfolio.querySelectorAll(".portfolio__line"));
  const portfolioDescs = Array.from(portfolio.querySelectorAll(".portfolio__desc"));
  const cards = Array.from(portfolio.querySelectorAll(".venture-card"));

  if (portfolioVideo) {
    portfolioVideo.play().catch(() => {
      // Autoplay may be blocked by browser policy; scene still works with poster frame.
    });
  }

  gsap.set([portfolioKicker, ...portfolioLines, ...portfolioDescs], {
    autoAlpha: 0,
    y: 28,
    ...(useBlurFilters ? { filter: "blur(12px)" } : {}),
  });
  // Keep cards readable: softer blur on reveal (desktop only)
  gsap.set(
    cards,
    useBlurFilters ? { autoAlpha: 0, y: 34, filter: "blur(6px)" } : { autoAlpha: 0, y: 34 }
  );
  if (portfolioOverlay) gsap.set(portfolioOverlay, { autoAlpha: 0.92 });
  if (portfolioGlow) gsap.set(portfolioGlow, { autoAlpha: 0.38 });

  ScrollTrigger.create({
    trigger: portfolio,
    start: "top 88%",
    end: "top 18%",
    scrub: 1.1,
    onUpdate: (self) => {
      const p = self.progress;
      if (portfolioVideo) {
        gsap.set(portfolioVideo, {
          autoAlpha: 0.06 + p * 0.94,
          scale: 1.08 - p * 0.03,
        });
      }
      if (portfolioOverlay) gsap.set(portfolioOverlay, { autoAlpha: 0.92 - p * 0.22 });
      if (portfolioGlow) gsap.set(portfolioGlow, { autoAlpha: 0.38 + p * 0.24 });
    },
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: portfolio,
      start: "top 76%",
      end: "top 25%",
      scrub: 1.05,
    },
  })
    .to(
      [portfolioKicker, ...portfolioLines, ...portfolioDescs],
      {
        autoAlpha: 1,
        y: 0,
        ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
        stagger: 0.08,
        ease: "power3.out",
        duration: 0.95,
      },
      0
    )
    .to(
      [portfolioKicker, ...portfolioLines, ...portfolioDescs],
      {
        y: -8,
        ease: "sine.inOut",
        stagger: 0.02,
        duration: 0.8,
      },
      0.55
    );

  gsap.timeline({
    scrollTrigger: {
      trigger: portfolio.querySelector(".portfolio__grid"),
      start: "top 78%",
      end: "top 28%",
      scrub: 1.1,
    },
  }).to(cards, {
    autoAlpha: 1,
    y: 0,
    ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
    stagger: 0.1,
    ease: "power3.out",
    duration: 1.1,
  });

  // Active card focus system: keep the current card sharp/readable.
  const setActiveCard = (activeCard) => {
    cards.forEach((c) => {
      const isActive = c === activeCard;
      c.classList.toggle("is-active", isActive);
      c.classList.toggle("is-inactive", !isActive);
      gsap.to(c, {
        overwrite: true,
        duration: 0.4,
        ease: "power3.out",
        autoAlpha: isActive ? 1 : 0.68,
        scale: isActive ? 1.02 : 1,
        y: isActive ? -2 : 0,
        ...(useBlurFilters ? { filter: isActive ? "blur(0px)" : "blur(1.4px)" } : {}),
      });
      gsap.set(c, { zIndex: isActive ? 4 : 1 });
    });
  };

  if (cards.length) {
    // Default to first card when entering the grid.
    ScrollTrigger.create({
      trigger: portfolio.querySelector(".portfolio__grid"),
      start: "top 75%",
      onEnter: () => setActiveCard(cards[0]),
      onEnterBack: () => setActiveCard(cards[Math.min(2, cards.length - 1)]),
    });

    cards.forEach((card, idx) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 62%",
        end: "bottom 48%",
        onEnter: () => setActiveCard(card),
        onEnterBack: () => setActiveCard(card),
        onLeave: () => {
          // Keep a card active until the next becomes dominant.
          const next = cards[idx + 1];
          if (next) setActiveCard(next);
        },
        onLeaveBack: () => {
          const prev = cards[idx - 1];
          if (prev) setActiveCard(prev);
        },
      });
    });
  }

  if (!isLowPerf) {
    gsap.to(portfolioVideo, {
      yPercent: -3.5,
      ease: "none",
      scrollTrigger: {
        trigger: portfolio,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  const quoteScene = document.querySelector(".quote-scene");
  if (!quoteScene) return;

  const quoteLines = Array.from(quoteScene.querySelectorAll(".quote-scene__line"));
  const quoteLabel = quoteScene.querySelector(".quote-scene__label");
  const quoteAuthor = quoteScene.querySelector(".quote-scene__author");
  const quoteGlows = Array.from(quoteScene.querySelectorAll(".quote-scene__glow"));
  const quoteMarks = Array.from(quoteScene.querySelectorAll(".quote-scene__mark"));

  gsap.set([quoteLabel, ...quoteLines, quoteAuthor], {
    autoAlpha: 0,
    y: 32,
    ...(useBlurFilters ? { filter: "blur(14px)" } : {}),
  });
  gsap.set(quoteMarks, { autoAlpha: 0.02, yPercent: 4 });

  gsap.timeline({
    scrollTrigger: {
      trigger: quoteScene,
      start: "top bottom",
      end: "top 35%",
      scrub: 1.15,
    },
  })
    .to(
      [cards, portfolioKicker, ...portfolioLines, ...portfolioDescs],
      {
        autoAlpha: 0,
        y: 22,
        // softer blur so text stays readable during handoff
        ...(useBlurFilters ? { filter: "blur(8px)" } : {}),
        ease: "power2.out",
        duration: 0.9,
      },
      0
    )
    .to(
      portfolioVideo,
      {
        autoAlpha: 0.28,
        scale: 1.055,
        ease: "sine.inOut",
        duration: 1.1,
      },
      0
    )
    .to(
      [portfolioOverlay, portfolioGlow],
      {
        autoAlpha: 0,
        ease: "sine.inOut",
        duration: 1.15,
      },
      0.02
    )
    .to(
      [quoteLabel, ...quoteLines, quoteAuthor],
      {
        autoAlpha: 1,
        y: 0,
        ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
        stagger: 0.12,
        ease: "power3.out",
        duration: 1.2,
      },
      0.1
    )
    .to(
      [quoteLabel, ...quoteLines, quoteAuthor],
      {
        y: -10,
        ease: "sine.inOut",
        stagger: 0.02,
        duration: 1.0,
      },
      0.7
    )
    .to(
      quoteGlows,
      {
        autoAlpha: 0.42,
        ease: "sine.inOut",
        duration: 1.4,
      },
      0.2
    )
    .to(
      quoteMarks,
      {
        autoAlpha: 0.07,
        yPercent: 0,
        ease: "sine.inOut",
        duration: 1.5,
      },
      0.3
    );

  if (!isLowPerf) {
    gsap.to(quoteGlows, {
      xPercent: (i) => (i === 0 ? 2.5 : -2.5),
      yPercent: (i) => (i === 0 ? -3 : 3),
      ease: "none",
      scrollTrigger: {
        trigger: quoteScene,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(quoteMarks, {
      yPercent: -4,
      ease: "none",
      scrollTrigger: {
        trigger: quoteScene,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Impact + Legacy + Footer cinematic reveals
  const impact = document.querySelector(".impact-scene");
  if (impact) {
    const impactGlow = Array.from(impact.querySelectorAll(".impact-scene__glow"));
    const impactReveal = Array.from(impact.querySelectorAll(".impact__reveal"));
    // Keep active content readable: very subtle blur only.
    gsap.set(
      impactReveal,
      useBlurFilters ? { autoAlpha: 0, y: 26, filter: "blur(5px)" } : { autoAlpha: 0, y: 26 }
    );

    gsap.timeline({
      scrollTrigger: {
        trigger: impact,
        start: "top 78%",
        end: "top 30%",
        scrub: 1.05,
      },
    }).to(impactReveal, {
      autoAlpha: 1,
      y: 0,
      ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
      stagger: 0.08,
      ease: "power3.out",
      duration: 1.05,
    });

    if (!isLowPerf) {
      gsap.to(impactGlow, {
        xPercent: (i) => (i === 0 ? 3 : -3),
        yPercent: (i) => (i === 0 ? -2 : 2),
        ease: "none",
        scrollTrigger: {
          trigger: impact,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  const legacy = document.querySelector(".legacy-scene");
  if (legacy) {
    const legacyGlow = Array.from(legacy.querySelectorAll(".legacy-scene__glow"));
    const legacyReveal = Array.from(legacy.querySelectorAll(".legacy__reveal"));
    const statCards = Array.from(legacy.querySelectorAll(".stat-card"));
    const statNums = Array.from(legacy.querySelectorAll(".stat-card__num"));

    gsap.set(
      legacyReveal,
      useBlurFilters ? { autoAlpha: 0, y: 28, filter: "blur(5px)" } : { autoAlpha: 0, y: 28 }
    );
    gsap.timeline({
      scrollTrigger: {
        trigger: legacy,
        start: "top 80%",
        end: "top 30%",
        scrub: 1.05,
      },
    }).to(legacyReveal, {
      autoAlpha: 1,
      y: 0,
      ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
      stagger: 0.08,
      ease: "power3.out",
      duration: 1.05,
    });

    // Count-up stats (runs once when stats enter)
    ScrollTrigger.create({
      trigger: legacy.querySelector(".stats"),
      start: "top 72%",
      once: true,
      onEnter: () => {
        statNums.forEach((el) => {
          const target = Number(el.getAttribute("data-target") || "0");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.35,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });
      },
    });

    // Gentle parallax float
    if (!isLowPerf) {
      gsap.to(statCards, {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: legacy,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        stagger: 0.02,
      });

      gsap.to(legacyGlow, {
        xPercent: (i) => (i === 0 ? 3 : -3),
        yPercent: (i) => (i === 0 ? -2 : 2),
        ease: "none",
        scrollTrigger: {
          trigger: legacy,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  const footer = document.querySelector(".footer-scene");
  if (footer) {
    const footerReveal = Array.from(footer.querySelectorAll(".footer__reveal"));
    gsap.set(
      footerReveal,
      useBlurFilters ? { autoAlpha: 0, y: 18, filter: "blur(4px)" } : { autoAlpha: 0, y: 18 }
    );
    gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 85%",
        end: "top 35%",
        scrub: 1.05,
      },
    }).to(footerReveal, {
      autoAlpha: 1,
      y: 0,
      ...(useBlurFilters ? { filter: "blur(0px)" } : {}),
      stagger: 0.1,
      ease: "power3.out",
      duration: 1.0,
    });
  }
})();

// Mobile hero nav: hamburger dropdown (non-sticky, hero-only)
(() => {
  const nav = document.querySelector(".hero-nav");
  if (!nav) return;
  const toggle = nav.querySelector(".hero-nav__toggle");
  const list = nav.querySelector(".hero-nav__list");
  if (!toggle || !list) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    setOpen(open);
  });

  list.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });
})();

