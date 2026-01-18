/**
 * GSAP Animation Presets for Slot Games
 * Enhanced animations for authentic casino slot experience
 */

import { gsap } from 'gsap';

export interface GSAPPresetConfig {
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  y?: string | number;
  x?: number | string;
  rotation?: number;
  clearProps?: string;
  yoyo?: boolean;
  repeat?: number;
  filter?: string;
  boxShadow?: string;
}

export interface GSAPPresetFromTo {
  from: GSAPPresetConfig;
  to: GSAPPresetConfig;
}

export interface GSAPAnimationPresets {
  burst: {
    cell: GSAPPresetConfig;
    image: GSAPPresetConfig;
  };
  gravity: {
    cell: GSAPPresetFromTo;
    image: GSAPPresetFromTo;
  };
  spawn: {
    cell: GSAPPresetFromTo;
    image: GSAPPresetFromTo;
  };
  winningGlow: {
    cell: GSAPPresetConfig;
    image: GSAPPresetConfig;
  };
  anticipation: {
    cell: GSAPPresetConfig;
    release: GSAPPresetConfig;
  };
  reelStop: {
    bounce: GSAPPresetConfig;
    settle: GSAPPresetConfig;
  };
  bigWin: {
    shake: GSAPPresetConfig;
    glow: GSAPPresetConfig;
  };
  reset: {
    all: GSAPPresetConfig;
  };
}

/**
 * Enhanced GSAP Animation Presets
 * Professional casino-quality animations
 */
export const GSAPAnimationPresets: GSAPAnimationPresets = {
  // ============================================
  // BURST ANIMATION (Symbol Removal) - Enhanced with pop effect
  // ============================================
  burst: {
    cell: {
      scale: 1.3,
      opacity: 0,
      duration: 0.25,
      ease: 'back.in(2)'
    },
    image: {
      scale: 1.5,
      opacity: 0,
      rotation: 15,
      duration: 0.25,
      ease: 'back.in(2)'
    }
  },

  // ============================================
  // GRAVITY ANIMATION - Enhanced with realistic physics
  // ============================================
  gravity: {
    cell: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 1
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.35,
        ease: 'bounce.out',
        clearProps: 'transform'
      }
    },
    image: {
      from: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 0.9
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.35,
        ease: 'bounce.out',
        clearProps: 'transform'
      }
    }
  },

  // ============================================
  // SPAWN ANIMATION - Enhanced with dramatic entry
  // ============================================
  spawn: {
    cell: {
      from: {
        y: '-100%',
        x: 0,
        rotation: -5,
        scale: 0.8,
        opacity: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.2)',
        clearProps: 'transform,opacity'
      }
    },
    image: {
      from: {
        y: '-100%',
        x: 0,
        rotation: -10,
        scale: 0.7,
        opacity: 0
      },
      to: {
        y: '0%',
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        clearProps: 'transform,opacity'
      }
    }
  },

  // ============================================
  // WINNING GLOW - Enhanced with pulsing effect
  // ============================================
  winningGlow: {
    cell: {
      scale: 1.08,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    },
    image: {
      scale: 1.15,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    }
  },

  // ============================================
  // ANTICIPATION - Before spin starts
  // ============================================
  anticipation: {
    cell: {
      scale: 0.95,
      y: 5,
      duration: 0.15,
      ease: 'power2.in'
    },
    release: {
      scale: 1,
      y: 0,
      duration: 0.1,
      ease: 'power2.out'
    }
  },

  // ============================================
  // REEL STOP - Satisfying bounce when reels stop
  // ============================================
  reelStop: {
    bounce: {
      y: -8,
      duration: 0.12,
      ease: 'power2.out'
    },
    settle: {
      y: 0,
      duration: 0.2,
      ease: 'bounce.out'
    }
  },

  // ============================================
  // BIG WIN - Screen shake and dramatic effects
  // ============================================
  bigWin: {
    shake: {
      x: 5,
      duration: 0.08,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 5
    },
    glow: {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 3
    }
  },

  // ============================================
  // RESET PRESET
  // ============================================
  reset: {
    all: {
      rotation: 0,
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1
    }
  }
};

/**
 * Enhanced GSAP Animation Helper Functions
 * Professional-quality animation utilities
 */
export const GSAPAnimationHelpers = {
  /**
   * Apply enhanced burst animation with particle effect
   */
  applyBurst(
    cellTargets: HTMLElement[],
    imageTargets: HTMLElement[],
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ onComplete });
    
    // Quick flash before burst
    timeline.to(imageTargets, {
      scale: 1.2,
      duration: 0.08,
      ease: 'power2.out'
    }, 0);
    
    // Main burst animation
    timeline.to(cellTargets, GSAPAnimationPresets.burst.cell, 0.08);
    timeline.to(imageTargets, GSAPAnimationPresets.burst.image, 0.08);
    
    return timeline;
  },

  /**
   * Apply enhanced gravity animation with wobble
   */
  applyGravity(
    imageElement: HTMLElement,
    fallDistance: number,
    cellElement?: HTMLElement | null,
    durationMultiplier: number = 1
  ): gsap.core.Tween[] {
    const anims: gsap.core.Tween[] = [];
    const duration = (GSAPAnimationPresets.gravity.image.to.duration || 0.35) * durationMultiplier;
    const wobble = (Math.random() - 0.5) * 3; // Slight random rotation during fall
    
    if (cellElement) {
      anims.push(gsap.fromTo(cellElement, 
        { 
          y: `${fallDistance}%`, 
          x: 0, 
          rotation: wobble,
          scale: 0.95
        },
        { 
          ...GSAPAnimationPresets.gravity.cell.to,
          duration
        }
      ));
    }
    
    anims.push(gsap.fromTo(imageElement,
      { 
        y: `${fallDistance}%`, 
        x: 0, 
        rotation: wobble * 1.5,
        scale: 0.9
      },
      { 
        ...GSAPAnimationPresets.gravity.image.to,
        duration
      }
    ));
    
    return anims;
  },

  /**
   * Apply enhanced spawn animation with dramatic entry
   */
  applySpawn(
    imageElement: HTMLElement,
    fallDistance: number,
    cellElement?: HTMLElement | null,
    durationMultiplier: number = 1
  ): gsap.core.Tween[] {
    const anims: gsap.core.Tween[] = [];
    const duration = (GSAPAnimationPresets.spawn.image.to.duration || 0.4) * durationMultiplier;
    const rotationStart = (Math.random() - 0.5) * 20;
    
    if (cellElement) {
      anims.push(gsap.fromTo(cellElement,
        { 
          y: `${fallDistance}%`, 
          x: 0, 
          rotation: rotationStart * 0.5,
          scale: 0.8,
          opacity: 0
        },
        { 
          ...GSAPAnimationPresets.spawn.cell.to,
          duration
        }
      ));
    }
    
    anims.push(gsap.fromTo(imageElement,
      { 
        y: `${fallDistance}%`, 
        x: 0, 
        rotation: rotationStart,
        scale: 0.7,
        opacity: 0
      },
      { 
        ...GSAPAnimationPresets.spawn.image.to,
        duration
      }
    ));
    
    return anims;
  },

  /**
   * Apply winning glow with enhanced pulsing
   */
  applyWinningGlow(
    cellElement: HTMLElement,
    imageElement: HTMLElement
  ): { cell: gsap.core.Tween; image: gsap.core.Tween } {
    // Add glow class for CSS effects
    cellElement.classList.add('winning-cell-glow');
    
    return {
      cell: gsap.to(cellElement, GSAPAnimationPresets.winningGlow.cell),
      image: gsap.to(imageElement, {
        ...GSAPAnimationPresets.winningGlow.image,
        filter: 'brightness(1.3) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
      })
    };
  },

  /**
   * Apply spin anticipation - compresses before spinning
   */
  applyAnticipation(
    gridElement: HTMLElement,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ onComplete });
    
    timeline.to(gridElement, GSAPAnimationPresets.anticipation.cell);
    timeline.to(gridElement, GSAPAnimationPresets.anticipation.release);
    
    return timeline;
  },

  /**
   * Apply reel stop bounce effect
   */
  applyReelStop(
    reelElements: HTMLElement[],
    staggerDelay: number = 0.1
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();
    
    reelElements.forEach((el, index) => {
      timeline.to(el, GSAPAnimationPresets.reelStop.bounce, index * staggerDelay);
      timeline.to(el, GSAPAnimationPresets.reelStop.settle, (index * staggerDelay) + 0.12);
    });
    
    return timeline;
  },

  /**
   * Apply big win celebration effect
   */
  applyBigWinCelebration(
    containerElement: HTMLElement,
    winningCells: HTMLElement[]
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();
    
    // Screen shake
    timeline.to(containerElement, GSAPAnimationPresets.bigWin.shake, 0);
    
    // Winning cells glow pulse
    winningCells.forEach((cell, index) => {
      timeline.to(cell, {
        ...GSAPAnimationPresets.bigWin.glow,
        delay: index * 0.05
      }, 0);
    });
    
    return timeline;
  },

  /**
   * Apply spin blur effect to symbols
   */
  applySpinBlur(
    imageElements: HTMLElement[],
    intensity: number = 1
  ): void {
    imageElements.forEach(el => {
      gsap.to(el, {
        filter: `blur(${2 * intensity}px)`,
        duration: 0.1,
        ease: 'power1.in'
      });
    });
  },

  /**
   * Remove spin blur effect
   */
  removeSpinBlur(
    imageElements: HTMLElement[]
  ): void {
    imageElements.forEach(el => {
      gsap.to(el, {
        filter: 'blur(0px)',
        duration: 0.15,
        ease: 'power2.out'
      });
    });
  },

  /**
   * Reset transforms on elements
   */
  reset(elements: HTMLElement | HTMLElement[]): void {
    const elemArray = Array.isArray(elements) ? elements : [elements];
    elemArray.forEach(el => {
      el.classList.remove('winning-cell-glow');
    });
    gsap.set(elements, GSAPAnimationPresets.reset.all);
  },

  /**
   * Kill all animations on elements
   */
  killAll(elements: HTMLElement | HTMLElement[]): void {
    gsap.killTweensOf(elements);
    this.reset(elements);
  }
};

export default GSAPAnimationPresets;
