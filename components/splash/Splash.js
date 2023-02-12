// Modules
import { useEffect, useState } from "react";

// Local
import { useInterval, useTimeout } from "lib"

// Styles
import styles from "./Splash.module.css"

// Component
export default function Splash({ hide }) {
    const text = [
        [ 'People', 'Community', 'Crowds', 'Family', 'Public', 'Citizens', 'Plants', 'Cats', 'Friends', 'Culture', 'Detail', 'Typefaces', 'Tools', 'Robots', 'Dinosaurs', 'Learning', 'Pens', 'Dogs' ], 
        [ 'Place', 'Area', 'Research', 'Experiments', 'Printing', 'Hangouts', 'Talking', 'Process', 'Collaboration', 'Mapping', 'Co-design', 'Production', 'History', 'Archives', 'Photography', 'Type', 'Making', 'Drawing' ],
        [ 'Local', 'Park', 'Town', 'City', 'Village', 'Pub', 'Café', 'Shops', 'Supermarket', 'Studio', 'Workshop', 'Neighbourhood', 'Canteen', 'Corner', 'Field', 'Home', 'Playground', 'School' ]
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
    }, [text, timeElapsed])

    return (
        <div className={styles.base} onClick={hide} >
            <p>{statement}</p>
        </div>
    )
}