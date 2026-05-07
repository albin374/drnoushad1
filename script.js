/* global gsap, ScrollTrigger */
(() => {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduced) return;

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

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

  const chapter2 = section.querySelector(".hero__chapter--two");
  const chapter2Lines = chapter2 ? Array.from(chapter2.querySelectorAll(".chapter__line")) : [];

  // Initial state
  gsap.set(allLines, { autoAlpha: 0, y: 26 });
  gsap.set([kicker, subtitle], { autoAlpha: 0, y: 26 });
  gsap.set(section.querySelector(".hero__title"), { autoAlpha: 0, y: 26 });
  if (heroShade) gsap.set(heroShade, { autoAlpha: 0 });
  if (bgImgBlur) gsap.set(bgImgBlur, { autoAlpha: 0, scale: 1.08 });
  if (atmTop) gsap.set(atmTop, { autoAlpha: 0, scale: 1.02 });
  if (atmSide) gsap.set(atmSide, { autoAlpha: 0, scale: 1.03 });
  if (heroContent) gsap.set(heroContent, { autoAlpha: 1, y: 0 });
  if (chapter2) gsap.set(chapter2, { autoAlpha: 1, y: 22 });
  if (chapter2Lines.length)
    gsap.set(chapter2Lines, { autoAlpha: 0, y: 40, filter: "blur(12px)" });

  // One pinned, scroll-linked cinematic timeline.
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=300%",
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    },
  });

  // Background slow zoom (premium, subtle).
  if (bgImg) {
    tl.to(bgImg, { scale: 1.1, ease: "power2.out" }, 0);
  }

  const reveal = (targets, at, opts = {}) => {
    tl.to(
      targets,
      {
        autoAlpha: 1,
        y: 0,
        stagger: opts.stagger ?? 0.12,
        ease: opts.ease ?? "power3.out",
        duration: opts.duration ?? 0.32,
      },
      at
    );
  };

  const fadeUp = (targets, at, opts = {}) => {
    tl.to(
      targets,
      {
        autoAlpha: opts.autoAlpha ?? 0,
        y: opts.y ?? -18,
        stagger: opts.stagger ?? 0.08,
        ease: opts.ease ?? "power2.in",
        duration: opts.duration ?? 0.25,
      },
      at
    );
  };

  // Storytelling flow in one continuous fullscreen scene.
  if (kicker) {
    reveal(kicker, 0.1, { stagger: 0, ease: "expo.out", duration: 0.38 });
    tl.to(kicker, { y: -10, ease: "sine.inOut" }, 0.42); // parallax drift
  }

  const title = section.querySelector(".hero__title");
  if (title) {
    tl.to(title, { autoAlpha: 1, y: 0, ease: "expo.out", duration: 0.28 }, 0.50);
    if (titleLines.length) {
      reveal(titleLines, 0.56, { stagger: 0.14, ease: "power3.out", duration: 0.36 });
    }
    tl.to(title, { y: -12, ease: "sine.inOut" }, 1.08); // gentle parallax
  }

  if (kicker) {
    fadeUp(kicker, 0.92, { autoAlpha: 0.25, y: -22, stagger: 0, duration: 0.26 });
  }

  if (subtitle) {
    reveal(subtitle, 1.02, { stagger: 0, ease: "power3.out", duration: 0.34 });
    tl.to(subtitle, { y: -10, ease: "sine.inOut" }, 1.22);
  }

  // Chapter morph: new content starts while hero content is still visible.
  if (heroShade) {
    tl.to(heroShade, { autoAlpha: 1, ease: "sine.inOut", duration: 1.25 }, 0.85);
  }
  if (bgImg) {
    tl.to(bgImg, { scale: 1.18, yPercent: -1.4, ease: "sine.inOut", duration: 1.85 }, 0.94);
  }
  if (bgImgBlur) {
    tl.to(bgImgBlur, { autoAlpha: 0.82, scale: 1.13, yPercent: -1.2, ease: "sine.inOut", duration: 1.5 }, 0.95);
  }
  if (atmTop) {
    tl.to(atmTop, { autoAlpha: 0.75, scale: 1.06, ease: "sine.inOut", duration: 1.5 }, 0.95);
  }
  if (atmSide) {
    tl.to(atmSide, { autoAlpha: 0.85, scale: 1.06, ease: "sine.inOut", duration: 1.8 }, 1.03);
  }
  if (heroContent) {
    tl.to(heroContent, { y: -34, ease: "sine.inOut", duration: 1.25 }, 0.93);
    tl.to(heroContent, { autoAlpha: 0, ease: "sine.inOut", duration: 1.2 }, 1.02);
  }

  if (chapter2) {
    tl.to(chapter2, { y: 0, ease: "sine.inOut", duration: 1.05 }, 0.94);
  }
  if (chapter2Lines.length) {
    tl.to(
      chapter2Lines,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: { each: 0.075, from: "start" },
        ease: "power3.out",
        duration: 1.05,
      },
      0.98
    );

    // Subtle continued parallax for a living scene.
    tl.to(
      chapter2Lines,
      { y: -14, ease: "sine.inOut", stagger: 0.012, duration: 1.35 },
      1.72
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
    filter: "blur(12px)",
  });
  gsap.set(cards, { autoAlpha: 0, y: 34, filter: "blur(12px)" });
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
        filter: "blur(0px)",
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
    filter: "blur(0px)",
    stagger: 0.1,
    ease: "power3.out",
    duration: 1.1,
  });

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

  const quoteScene = document.querySelector(".quote-scene");
  if (!quoteScene) return;

  const quoteLines = Array.from(quoteScene.querySelectorAll(".quote-scene__line"));
  const quoteLabel = quoteScene.querySelector(".quote-scene__label");
  const quoteAuthor = quoteScene.querySelector(".quote-scene__author");
  const quoteGlows = Array.from(quoteScene.querySelectorAll(".quote-scene__glow"));
  const quoteMarks = Array.from(quoteScene.querySelectorAll(".quote-scene__mark"));
  const audioButton = quoteScene.querySelector(".quote-scene__audio");
  const audioLabel = quoteScene.querySelector(".quote-scene__audio-label");

  gsap.set([quoteLabel, ...quoteLines, quoteAuthor], {
    autoAlpha: 0,
    y: 32,
    filter: "blur(14px)",
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
        filter: "blur(18px)",
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
        filter: "blur(0px)",
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

  if (audioButton && audioLabel) {
    audioButton.addEventListener("click", () => {
      const isActive = audioButton.getAttribute("aria-pressed") === "true";
      audioButton.setAttribute("aria-pressed", isActive ? "false" : "true");
      audioLabel.textContent = isActive ? "Unmute music" : "Mute music";
    });
  }

  // Impact + Legacy + Footer cinematic reveals
  const impact = document.querySelector(".impact-scene");
  if (impact) {
    const impactGlow = Array.from(impact.querySelectorAll(".impact-scene__glow"));
    const impactReveal = Array.from(impact.querySelectorAll(".impact__reveal"));
    gsap.set(impactReveal, { autoAlpha: 0, y: 26, filter: "blur(12px)" });

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
      filter: "blur(0px)",
      stagger: 0.08,
      ease: "power3.out",
      duration: 1.05,
    });

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

  const legacy = document.querySelector(".legacy-scene");
  if (legacy) {
    const legacyGlow = Array.from(legacy.querySelectorAll(".legacy-scene__glow"));
    const legacyReveal = Array.from(legacy.querySelectorAll(".legacy__reveal"));
    const statCards = Array.from(legacy.querySelectorAll(".stat-card"));
    const statNums = Array.from(legacy.querySelectorAll(".stat-card__num"));

    gsap.set(legacyReveal, { autoAlpha: 0, y: 28, filter: "blur(12px)" });
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
      filter: "blur(0px)",
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

  const footer = document.querySelector(".footer-scene");
  if (footer) {
    const footerReveal = Array.from(footer.querySelectorAll(".footer__reveal"));
    gsap.set(footerReveal, { autoAlpha: 0, y: 18, filter: "blur(10px)" });
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
      filter: "blur(0px)",
      stagger: 0.1,
      ease: "power3.out",
      duration: 1.0,
    });
  }
})();

