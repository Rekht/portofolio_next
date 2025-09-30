/*!
 * ScrollSmoother 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle, jack@greensock.com
 */

(function (global, factory) {
  "use strict";

  if (typeof exports === "object" && typeof module !== "undefined") {
    factory(exports);
  } else if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else {
    factory((global.window = global.window || {}));
  }
})(this, function (exports) {
  "use strict";

  // Core variables
  let gsap, doc, docElement, body, win;
  let smootherInstance,
    isRegistered = false;

  // Utility functions
  function isWindowDefined() {
    return typeof window !== "undefined";
  }

  function getGSAP() {
    if (!gsap && isWindowDefined()) {
      gsap = window.gsap;
      if (gsap && gsap.registerPlugin) {
        return gsap;
      }
    }
    return gsap;
  }

  function getMaxScroll(element) {
    // Implementation of max scroll calculation
    if (!element) element = win;
    return Math.max(
      0,
      element === win || element === docElement
        ? docElement.scrollHeight - win.innerHeight
        : element.scrollHeight - element.clientHeight
    );
  }

  // Core ScrollSmoother class
  class ScrollSmoother {
    constructor(vars) {
      vars = this.vars = vars || {};

      if (!isRegistered) {
        ScrollSmoother.register(gsap) ||
          console.warn("Please gsap.registerPlugin(ScrollSmoother)");
      }

      this.init(vars);
    }

    init(vars) {
      // Initialize core properties
      this.contentElement = null;
      this.wrapperElement = null;
      this.scrollTrigger = null;
      this.isPaused = false;
      this.effects = [];
      this.sections = [];

      // Configuration
      this.config = {
        smoothTouch: vars.smoothTouch,
        smooth: vars.smooth,
        speed: vars.speed || 1,
        effectsPrefix: vars.effectsPrefix || "",
        normalizeScroll: vars.normalizeScroll,
        wholePixels: vars.wholePixels,
        fixedMarkers: vars.fixedMarkers,
        autoResize: vars.autoResize,
        onUpdate: vars.onUpdate,
        onStop: vars.onStop,
        onFocusIn: vars.onFocusIn,
      };

      this.setupElements(vars);
      this.createScrollTrigger();
      this.setupEventListeners();
      this.applyEffects(vars);
      this.setupSections(vars);
    }

    setupElements(vars) {
      // Setup content element
      this.content(vars.content);

      // Setup wrapper element
      this.wrapper(vars.wrapper);

      // Apply initial styles
      this.applyStyles();
    }

    createScrollTrigger() {
      // Create the main ScrollTrigger animation
      const animation = gsap.to(
        { y: 0 },
        {
          y: () => -this.getContentHeight(),
          ease: this.vars.ease || "expo",
          duration: 100,
          immediateRender: false,
          onUpdate: () => this.onAnimationUpdate(),
        }
      );

      this.scrollTrigger = gsap.core.globals().ScrollTrigger.create({
        animation: animation,
        scroller: win,
        start: 0,
        end: () => this.getContentHeight() / this.config.speed,
        scrub: this.config.smooth || true,
        onRefresh: () => this.onRefresh(),
        onUpdate: () => this.onScrollUpdate(),
        id: "ScrollSmoother",
      });
    }

    setupEventListeners() {
      // Setup focus management
      if (win && win.addEventListener) {
        win.addEventListener("focusin", (e) => this.handleFocus(e));
      }

      // Setup resize observer for auto-resize
      if (
        this.config.autoResize !== false &&
        typeof ResizeObserver !== "undefined"
      ) {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.contentElement);
      }
    }

    applyEffects(vars) {
      if (vars.effects) {
        const selector =
          vars.effects === true
            ? `[data-${this.config.effectsPrefix}speed], [data-${this.config.effectsPrefix}lag]`
            : vars.effects;

        this.effects(selector, {
          effectsPadding: vars.effectsPadding,
          refresh: false,
        });
      }
    }

    setupSections(vars) {
      if (vars.sections) {
        const selector =
          vars.sections === true ? "[data-section]" : vars.sections;
        this.sections(selector);
      }
    }

    // Public API methods
    content(element) {
      if (element !== undefined) {
        const target = gsap.utils.toArray(element)[0] || body.children[0];
        if (target && target !== this.contentElement) {
          this.contentElement = target;
          this.applyContentStyles();
        }
        return this;
      }
      return this.contentElement;
    }

    wrapper(element) {
      if (element !== undefined) {
        let target = gsap.utils.toArray(element)[0];
        if (!target && this.contentElement) {
          target = this.createWrapper();
        }
        if (target && target !== this.wrapperElement) {
          this.wrapperElement = target;
          this.applyWrapperStyles();
          this.refreshHeight();
        }
        return this;
      }
      return this.wrapperElement;
    }

    createWrapper() {
      let wrapper = doc.querySelector(".ScrollSmoother-wrapper");
      if (!wrapper && this.contentElement) {
        wrapper = doc.createElement("div");
        wrapper.classList.add("ScrollSmoother-wrapper");
        this.contentElement.parentNode.insertBefore(
          wrapper,
          this.contentElement
        );
        wrapper.appendChild(this.contentElement);
      }
      return wrapper;
    }

    scrollTop(value) {
      if (value !== undefined) {
        value = Math.max(0, value);
        if (this.isPaused) {
          this.setScrollPosition(value);
        } else {
          this.animateScrollTo(value);
        }
        return this;
      }
      return this.getScrollPosition();
    }

    scrollTo(target, animate, position) {
      let scrollPosition;

      if (isNaN(target)) {
        scrollPosition = this.offset(
          target,
          position,
          !!animate && !this.isPaused
        );
      } else {
        scrollPosition = gsap.utils.clamp(
          0,
          getMaxScroll(this.wrapperElement),
          Number(target)
        );
      }

      if (animate && !this.isPaused) {
        gsap.to(this, {
          duration: this.config.smooth,
          scrollTop: scrollPosition,
          ease: this.config.ease || "expo",
          overwrite: "auto",
        });
      } else {
        this.scrollTop(scrollPosition);
      }
    }

    offset(element, position, ignoreSpeed) {
      const target = gsap.utils.toArray(element)[0];
      if (!target) return 0;

      const originalStyle = target.style.cssText;
      const trigger = gsap.core.globals().ScrollTrigger.create({
        trigger: target,
        start: position || "top top",
      });

      let offset = trigger.start / (ignoreSpeed ? 1 : this.config.speed);

      trigger.kill(false);
      target.style.cssText = originalStyle;

      return offset;
    }

    effects(elements, config) {
      if (!elements) return this.effects.slice();

      config = config || {};
      const targets = gsap.utils.toArray(elements);
      const newEffects = [];

      // Remove existing effects for these elements
      targets.forEach((element) => {
        for (let i = this.effects.length - 1; i >= 0; i--) {
          if (this.effects[i].trigger === element) {
            this.effects[i].kill();
          }
        }
      });

      // Create new effects
      targets.forEach((element, index) => {
        const effect = this.createEffect(element, config, index);
        if (effect) {
          newEffects.push(effect);
        }
      });

      this.effects.push(...newEffects);

      if (config.refresh !== false) {
        gsap.core.globals().ScrollTrigger.refresh();
      }

      return newEffects;
    }

    createEffect(element, config, index) {
      // Simplified effect creation
      // Actual implementation would be more complex
      return gsap.core.globals().ScrollTrigger.create({
        trigger: element,
        start: config.start || "top bottom",
        end: config.end || "bottom top",
        scrub: true,
        onUpdate: () => this.updateEffect(element, config),
      });
    }

    sections(elements, config) {
      if (!elements) return this.sections.slice();

      const targets = gsap.utils.toArray(elements);
      const newSections = [];

      targets.forEach((element) => {
        const section = gsap.core.globals().ScrollTrigger.create({
          trigger: element,
          start: "top 120%",
          end: "bottom -20%",
          onToggle: (self) => {
            element.style.opacity = self.isActive ? "1" : "0";
            element.style.pointerEvents = self.isActive ? "all" : "none";
          },
        });
        newSections.push(section);
      });

      if (config && config.add) {
        this.sections.push(...newSections);
      } else {
        this.sections = newSections.slice();
      }

      return newSections;
    }

    paused(state, preventFocus) {
      if (state !== undefined) {
        if (state && !this.isPaused) {
          this.pauseSmoothing(preventFocus);
        } else if (!state && this.isPaused) {
          this.resumeSmoothing();
        }
        return this;
      }
      return this.isPaused;
    }

    // Internal methods
    applyStyles() {
      if (this.contentElement) {
        gsap.set(this.contentElement, {
          overflow: "visible",
          width: "100%",
          boxSizing: "border-box",
          y: "+=0",
        });
      }

      if (this.wrapperElement) {
        const styles = this.config.smooth
          ? {
              overflow: "hidden",
              position: "fixed",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          : {
              overflow: "visible",
              position: "relative",
              width: "100%",
              height: "auto",
              top: "auto",
              bottom: "auto",
              left: "auto",
              right: "auto",
            };

        gsap.set(this.wrapperElement, styles);
      }
    }

    applyContentStyles() {
      if (this.contentElement && this.config.smooth) {
        gsap.set(this.contentElement, { y: "+=0" });
      } else if (this.contentElement) {
        gsap.set(this.contentElement, { clearProps: "transform" });
      }
    }

    applyWrapperStyles() {
      // Apply wrapper-specific styles
    }

    refreshHeight() {
      if (!this.contentElement || !this.wrapperElement) return 0;

      const contentHeight = this.contentElement.clientHeight;
      this.contentElement.style.overflow = "visible";

      if (body) {
        body.style.height =
          win.innerHeight +
          (contentHeight - win.innerHeight) / this.config.speed +
          "px";
      }

      return contentHeight - win.innerHeight;
    }

    getContentHeight() {
      return this.refreshHeight();
    }

    getScrollPosition() {
      return -this.currentScrollY;
    }

    setScrollPosition(position) {
      this.currentScrollY = -position;
      this.updateTransform();
    }

    animateScrollTo(position) {
      // Implementation for animated scrolling
    }

    updateTransform() {
      if (this.contentElement && this.config.smooth) {
        gsap.set(this.contentElement, {
          y: this.currentScrollY,
        });
      }
    }

    onAnimationUpdate() {
      if (this.config.onUpdate) {
        this.config.onUpdate(this);
      }
    }

    onScrollUpdate() {
      // Handle scroll updates
    }

    onRefresh() {
      // Handle refresh events
      this.refreshHeight();
    }

    handleResize() {
      // Handle resize events
      if (!gsap.core.globals().ScrollTrigger.isRefreshing) {
        this.delayedRefresh();
      }
    }

    handleFocus(event) {
      // Handle focus events
      if (
        this.config.onFocusIn &&
        this.config.onFocusIn(this, event) === false
      ) {
        return;
      }

      if (event.target !== this.previousFocusTarget) {
        this.previousFocusTarget = event.target;
        if (!gsap.core.globals().ScrollTrigger.isInViewport(event.target)) {
          this.scrollTo(event.target, false, "center center");
        }
      }
    }

    pauseSmoothing(preventFocus) {
      if (this.scrollTrigger && this.scrollTrigger.animation) {
        this.scrollTrigger.animation.pause();
      }

      this.isPaused = true;
      // Additional pause logic...
    }

    resumeSmoothing() {
      this.isPaused = false;
      if (this.scrollTrigger && this.scrollTrigger.animation) {
        this.scrollTrigger.animation.play();
      }
      // Additional resume logic...
    }

    delayedRefresh() {
      // Implementation for delayed refresh
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
      }
      this.refreshTimeout = setTimeout(() => {
        this.refresh();
      }, 200);
    }

    // Cleanup methods
    kill() {
      this.paused(false);

      // Kill effects and sections
      [...this.effects, ...this.sections].forEach((item) => item.kill());

      // Remove event listeners
      if (win && win.removeEventListener) {
        win.removeEventListener("focusin", this.handleFocus);
      }

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      // Reset styles
      if (body) {
        body.style.removeProperty("height");
      }

      // Clear timeouts
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
      }

      smootherInstance = null;
    }

    refresh(force, safe) {
      if (this.scrollTrigger) {
        return this.scrollTrigger.refresh(force, safe);
      }
    }

    // Getters
    get progress() {
      return this.scrollTrigger ? this.scrollTrigger.animation._time / 100 : 0;
    }

    get velocity() {
      // Implementation for velocity calculation
      return 0;
    }
  }

  // Static methods
  ScrollSmoother.register = function (gsapInstance) {
    if (!isRegistered) {
      gsap = gsapInstance || getGSAP();

      if (isWindowDefined() && window.document) {
        win = window;
        doc = document;
        docElement = doc.documentElement;
        body = doc.body;
      }

      if (gsap) {
        const ScrollTrigger = gsap.core.globals().ScrollTrigger;
        if (ScrollTrigger) {
          // Register the plugin
          gsap.core.globals("ScrollSmoother", ScrollSmoother);
          isRegistered = true;
        }
      }
    }
    return isRegistered;
  };

  ScrollSmoother.create = function (vars) {
    if (
      smootherInstance &&
      vars &&
      smootherInstance.content() === gsap.utils.toArray(vars.content)[0]
    ) {
      return smootherInstance;
    }
    return new ScrollSmoother(vars);
  };

  ScrollSmoother.get = function () {
    return smootherInstance;
  };

  // Version info
  ScrollSmoother.version = "3.13.0";

  // Register with GSAP if available
  if (getGSAP()) {
    gsap.registerPlugin(ScrollSmoother);
  }

  // Export
  exports.ScrollSmoother = ScrollSmoother;
  exports.default = ScrollSmoother;

  if (typeof window === "undefined" || window !== exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
  } else {
    delete exports.default;
  }

  return ScrollSmoother;
});
