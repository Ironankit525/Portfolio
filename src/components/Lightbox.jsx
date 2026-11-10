import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const SWIPE_DISTANCE = 48;

// Full-screen screenshot viewer. Arrow keys or a swipe move between slides;
// Escape, the close button or a click on the backdrop closes it.
export default function Lightbox({ slides, index, onIndexChange, onClose }) {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const swipeStart = useRef(null);
    const slide = slides[index];
    const many = slides.length > 1;

    // A layout effect, so close() runs before React removes the element and the
    // browser can return focus to the thumbnail that opened the viewer.
    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        closeRef.current.focus();
        return () => dialog.close();
    }, []);

    const move = useCallback((step) => {
        onIndexChange((index + step + slides.length) % slides.length);
    }, [index, slides.length, onIndexChange]);

    useEffect(() => {
        if (!many) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'ArrowRight') move(1);
            if (event.key === 'ArrowLeft') move(-1);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [many, move]);

    function onPointerUp(event) {
        const distance = event.clientX - (swipeStart.current ?? event.clientX);
        swipeStart.current = null;
        if (many && Math.abs(distance) > SWIPE_DISTANCE) move(distance < 0 ? 1 : -1);
    }

    return (
        <dialog
            ref={dialogRef}
            className="lightbox"
            aria-label="Screenshot viewer"
            // Escape fires `cancel`. (Not `close`: that also fires when React's dev-mode
            // effect check closes and reopens the dialog, which would dismiss it at once.)
            onCancel={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <figure
                onPointerDown={(event) => {
                    swipeStart.current = event.clientX;
                }}
                onPointerUp={onPointerUp}
            >
                <img key={slide.src} src={slide.src} alt={slide.alt} draggable="false" />
                <figcaption>
                    {many && <span>{index + 1} / {slides.length}</span>}
                    {slide.caption}
                </figcaption>
            </figure>

            {many && (
                <>
                    <button type="button" className="icon-button lightbox-prev" onClick={() => move(-1)} aria-label="Previous screenshot">
                        <ArrowLeft size={18} aria-hidden="true" />
                    </button>
                    <button type="button" className="icon-button lightbox-next" onClick={() => move(1)} aria-label="Next screenshot">
                        <ArrowRight size={18} aria-hidden="true" />
                    </button>
                </>
            )}
            <button ref={closeRef} type="button" className="icon-button lightbox-close" onClick={onClose} aria-label="Close viewer">
                <X size={18} aria-hidden="true" />
            </button>
        </dialog>
    );
}
