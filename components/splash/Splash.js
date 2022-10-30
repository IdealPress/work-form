// Modules
import { useEffect, useState } from "react";

// Local
import { useInterval, useTimeout } from "lib"

// Styles
import styles from "./Splash.module.css"

// Component
export default function Splash({ text = [], hide }) {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useTimeout(() => {
        hide();
      }, 4000);

    useInterval(
        () => {
            setTimeElapsed((timeElapsed) => 
                timeElapsed >= text.length - 1 ? 0 : timeElapsed + 1
            );
        },
        800
    );

    return (
        <div className={styles.base} onClick={hide} >
            <p>{text[timeElapsed]}</p>
        </div>
    )
}