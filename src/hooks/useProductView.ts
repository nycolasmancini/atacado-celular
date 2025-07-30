"use client";

import { useEffect, useRef } from "react";
import { useTracking } from "@/contexts/TrackingContext";

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
}

// Set to track already viewed products to avoid duplicates
const viewedProducts = new Set<number>();

export function useProductView(
  elementRef: React.RefObject<HTMLElement>,
  product: Product
) {
  const { trackEvent } = useTracking();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewedProducts.has(product.id)) {
            // Mark as viewed to prevent duplicate events
            viewedProducts.add(product.id);

            // Track ViewContent event
            trackEvent('ViewContent', {
              content_ids: [product.id.toString()],
              content_name: product.name,
              content_category: product.category.name,
              content_type: 'product',
              value: product.price,
              currency: 'BRL'
            });
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger a bit before the element comes into view
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [elementRef, product.id, product.name, product.category.name, product.price, trackEvent]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
}

// Function to clear viewed products (useful for testing or navigation)
export function clearViewedProducts() {
  viewedProducts.clear();
}