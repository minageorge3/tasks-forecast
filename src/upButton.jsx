import { useEffect, useRef } from "react";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function UpButton() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll");
    const button = buttonRef.current;

    if (!scrollContainer || !button) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 200) {
        button.style.display = "flex";
      } else {
        button.style.display = "none";
      }
    };

    const scrollToTop = () => {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    button.addEventListener("click", scrollToTop);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      button.removeEventListener("click", scrollToTop);
    };
  }, []);

  return (
    <Fab
      ref={buttonRef}
      color="primary"
      aria-label="scroll back to top"
      style={{
        display: "none",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        width: "3rem",
        height: "3rem",
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
}
