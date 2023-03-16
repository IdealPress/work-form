// Modules
import { useEffect, useState } from "react";

// Local
import { useInterval, useTimeout } from "lib"

// Styles
import styles from "./Splash.module.css"

// Component
export default function Splash({ hide }) {
    const text = [
        [ 'people', 'community', 'crowds', 'family', 'public', 'citizens', 'plants', 'cats', 'friends', 'culture', 'detail', 'typefaces', 'tools', 'robots', 'dinosaurs', 'learning', 'pens', 'dogs' ], 
        [ 'place', 'area', 'research', 'experiments', 'printing', 'hangouts', 'talking', 'process', 'collaboration', 'mapping', 'co-design', 'production', 'history', 'archives', 'photography', 'type', 'making', 'drawing' ],
        [ 'local', 'park', 'town', 'city', 'village', 'pub', 'café', 'shops', 'supermarket', 'studio', 'workshop', 'neighbourhood', 'canteen', 'corner', 'field', 'home', 'playground', 'school' ]
    ]
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [statement, setStatement] = useState('');

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

    const generateRandomNumber = (arr) =>{
        return Math.floor(Math.random() * arr.length);
    }

    useEffect(() => {
        const words = [text[0][generateRandomNumber(text[0])], text[1][generateRandomNumber(text[1])], text[2][generateRandomNumber(text[2])]]
        setStatement(`${words[0]}, ${words[1]} & the ${words[2]}`);
    }, [timeElapsed])

    return (
        <div className={styles.base} onClick={hide} >
            <p>{statement}</p>
        </div>
    )
}