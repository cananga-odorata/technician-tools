import { createSignal, createEffect, Show, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface TourStep {
    target?: string; // CSS selector for the target element. If undefined, shows in center.
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
    steps: TourStep[];
    onComplete?: () => void;
    tourKey: string; // Unique key for localStorage
}

const OnboardingTour: Component<OnboardingTourProps> = (props) => {
    const [currentStep, setCurrentStep] = createSignal(0);
    const [isVisible, setIsVisible] = createSignal(false);
    const [targetRect, setTargetRect] = createSignal<DOMRect | null>(null);

    // Check if tour has been seen
    createEffect(() => {
        const hasSeen = localStorage.getItem(`tour_${props.tourKey}`);
        if (!hasSeen) {
            // Small delay to ensure DOM is ready
            setTimeout(() => setIsVisible(true), 1000);
        }
    });

    const updateTargetRect = () => {
        const step = props.steps[currentStep()];
        if (step.target) {
            const el = document.querySelector(step.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                // Check if element is visible (has dimensions)
                if (rect.width > 0 && rect.height > 0) {
                    setTargetRect(rect);
                    return;
                }
            }
        }
        // Fallback to center if target not found or hidden
        setTargetRect(null);
    };

    // Handle scrolling when step changes
    createEffect(() => {
        if (isVisible()) {
            const step = props.steps[currentStep()];
            if (step.target) {
                const el = document.querySelector(step.target);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            // Update rect after scroll (give it a moment or rely on scroll listener)
            setTimeout(updateTargetRect, 100);
            setTimeout(updateTargetRect, 500); // Double check after animation
        }
    });

    createEffect(() => {
        if (isVisible()) {
            updateTargetRect();
            window.addEventListener('resize', updateTargetRect);
            window.addEventListener('scroll', updateTargetRect, true);
        }
        onCleanup(() => {
            window.removeEventListener('resize', updateTargetRect);
            window.removeEventListener('scroll', updateTargetRect, true);
        });
    });

    const handleNext = () => {
        if (currentStep() < props.steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep() > 0) {
            setCurrentStep(c => c - 1);
        }
    };

    const handleFinish = () => {
        setIsVisible(false);
        localStorage.setItem(`tour_${props.tourKey}`, 'true');
        props.onComplete?.();
    };

    const getPopoverStyle = () => {
        const rect = targetRect();
        const step = props.steps[currentStep()];

        if (!rect) {
            // Center position
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            };
        }

        const gap = 12;
        const popoverWidth = 320; // Approximate width
        const viewportWidth = window.innerWidth;

        let top = 0;
        let left = 0;
        let transform = '';

        // Calculate preferred position
        switch (step.position || 'bottom') {
            case 'top':
                top = rect.top - gap;
                left = rect.left + rect.width / 2;
                transform = 'translate(-50%, -100%)';
                break;
            case 'bottom':
                top = rect.bottom + gap;
                left = rect.left + rect.width / 2;
                transform = 'translate(-50%, 0)';
                break;
            case 'left':
                top = rect.top + rect.height / 2;
                left = rect.left - gap;
                transform = 'translate(-100%, -50%)';
                break;
            case 'right':
                top = rect.top + rect.height / 2;
                left = rect.right + gap;
                transform = 'translate(0, -50%)';
                break;
        }

        // Boundary checks

        // Check horizontal overflow for left/right positions
        if (step.position === 'right' && (rect.right + gap + popoverWidth) > viewportWidth) {
            // Not enough space on right, try bottom
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2;
            transform = 'translate(-50%, 0)';
        } else if (step.position === 'left' && (rect.left - gap - popoverWidth) < 0) {
            // Not enough space on left, try bottom
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2;
            transform = 'translate(-50%, 0)';
        }

        // Check vertical overflow
        const popoverHeight = 200; // Approximate height
        const viewportHeight = window.innerHeight;

        // If top position goes off screen (visual top < 0), flip to bottom
        const isTop = transform.includes('-100%') && !transform.includes('translate(-100%');

        if ((step.position === 'top' || isTop) && (rect.top - gap - popoverHeight) < 0) {
            top = rect.bottom + gap;
            transform = 'translate(-50%, 0)';
        }

        // If bottom position goes off screen, flip to top
        const isBottom = transform.includes('translate(-50%, 0)');

        if ((step.position === 'bottom' || isBottom) && (rect.bottom + gap + popoverHeight) > viewportHeight) {
            top = rect.top - gap;
            transform = 'translate(-50%, -100%)';
        }

        // Horizontal clamping
        if (transform.includes('translate(-50%')) {
            const halfWidth = popoverWidth / 2;
            if (left - halfWidth < 10) {
                left = halfWidth + 10;
            }
            if (left + halfWidth > viewportWidth - 10) {
                left = viewportWidth - 10 - halfWidth;
            }
        }

        return {
            top: `${top}px`,
            left: `${left}px`,
            transform,
            position: 'fixed',
            'max-width': '90vw',
            width: '320px'
        };
    };

    return (
        <Show when={isVisible()}>
            <Portal>
                <div class="fixed inset-0 z-[100] pointer-events-none">
                    {/* Backdrop with cutout using clip-path or just simple overlay for now */}

                    <Show when={targetRect()} fallback={
                        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500"></div>
                    }>
                        {/* Overlay constructed from 4 parts */}
                        {(() => {
                            const r = targetRect()!;
                            return (
                                <>
                                    <div class="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-sm transition-all duration-300" style={{ height: `${r.top}px` }}></div>
                                    <div class="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm transition-all duration-300" style={{ top: `${r.bottom}px` }}></div>
                                    <div class="absolute left-0 bg-black/60 backdrop-blur-sm transition-all duration-300" style={{ top: `${r.top}px`, height: `${r.height}px`, width: `${r.left}px` }}></div>
                                    <div class="absolute right-0 bg-black/60 backdrop-blur-sm transition-all duration-300" style={{ top: `${r.top}px`, height: `${r.height}px`, left: `${r.right}px` }}></div>
                                    {/* Highlight border */}
                                    <div
                                        class="absolute border-2 border-accent rounded-lg shadow-[0_0_0_4px_rgba(0,0,0,0.3)] transition-all duration-300 pointer-events-none"
                                        style={{
                                            top: `${r.top - 4}px`,
                                            left: `${r.left - 4}px`,
                                            width: `${r.width + 8}px`,
                                            height: `${r.height + 8}px`
                                        }}
                                    ></div>
                                </>
                            );
                        })()}
                    </Show>

                    {/* Popover Card */}
                    <div
                        class="bg-secondary border border-border-primary rounded-xl shadow-2xl p-6 w-[320px] max-w-[90vw] transition-all duration-300 z-[101] pointer-events-auto"
                        style={getPopoverStyle() as any}
                    >
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-bold text-accent uppercase tracking-wider">
                                Step {currentStep() + 1} of {props.steps.length}
                            </span>
                            <button
                                onClick={handleFinish}
                                class="text-text-tertiary hover:text-text-primary transition-colors"
                                title="Close Tour"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <h3 class="text-lg font-bold text-text-primary mb-2">
                            {props.steps[currentStep()].title}
                        </h3>
                        <p class="text-sm text-text-secondary mb-6 leading-relaxed">
                            {props.steps[currentStep()].content}
                        </p>

                        <div class="flex items-center justify-between">
                            <button
                                onClick={handleFinish}
                                class="text-sm font-medium text-text-tertiary hover:text-text-primary transition-colors"
                            >
                                Skip Tour
                            </button>

                            <div class="flex gap-2">
                                <button
                                    onClick={handlePrev}
                                    class={`px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors ${currentStep() === 0 ? 'invisible' : ''}`}
                                >
                                    Back
                                </button>
                                {currentStep() < props.steps.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        class="px-4 py-2 bg-accent text-accent-text rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFinish}
                                        class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                    >
                                        Finish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>
    );
};

export default OnboardingTour;
