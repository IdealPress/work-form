import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.base}>
      <p>work-form</p>
      <ul>
        <li>about</li>
        <li>archive</li>
        <li>
          <label
            for="default-toggle"
            class="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              id="default-toggle"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
          </label>
        </li>
      </ul>
    </nav>
  );
}
