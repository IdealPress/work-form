import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <label htmlFor="theme-toggle" className={styles.base}>
      <input
        type="checkbox"
        value={currentTheme}
        id="theme-toggle"
        className="sr-only peer"
        onChange={toggleTheme}
      />
      <div
        className={`${styles.toggle} peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-black peer-checked:bg-white`}
      />
    </label>
  );
}
