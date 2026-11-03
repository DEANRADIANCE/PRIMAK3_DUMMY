import { useEffect } from "react";

/**
 * Hook untuk mengaktifkan animasi saat elemen di-scroll ke dalam viewport.
 * Menargetkan class: .pub-reveal, .pub-reveal-left, .pub-reveal-right, .pub-reveal-scale
 */
export const useScrollReveal = (dependencies: any[] = []) => {
  useEffect(() => {
    // Pastikan berjalan di browser
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback untuk browser yang tidak mendukung IntersectionObserver
      const elements = document.querySelectorAll(
        ".pub-reveal, .pub-reveal-left, .pub-reveal-right, .pub-reveal-scale"
      );
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Sekali animasi aktif, lepaskan observasi agar performa tetap ringan
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll(
        ".pub-reveal:not(.is-visible), .pub-reveal-left:not(.is-visible), .pub-reveal-right:not(.is-visible), .pub-reveal-scale:not(.is-visible)"
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Jika elemen sudah ada di layar (misal di bagian atas halaman saat awal render), langsung munculkan
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-visible");
        } else {
          observer.observe(el);
        }
      });
    };

    // Jalankan segera
    observeAll();

    // Jalankan ulang setelah jeda singkat untuk mengakomodasi render asinkron (misalnya dari skeleton / data fetch)
    const timeout1 = setTimeout(observeAll, 100);
    const timeout2 = setTimeout(observeAll, 350);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      observer.disconnect();
    };
  }, dependencies);
};
