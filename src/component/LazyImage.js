import React, { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div style={{ width: "200px", height: "200px", background: "#eee", borderRadius: "5px" }} />
      )}
    </div>
  );
};

export default LazyImage;