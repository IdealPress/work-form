import { useState, useEffect } from "react";
import { usePreviousValue, useWindowSize } from "lib";

export default function Sticker() {
  const size = useWindowSize();
  const previousSize = usePreviousValue(size.width);

  const [bodyHeight, setBodyHeight] = useState(0);
  const [bodyWidth, setBodyWidth] = useState(0);
  const [stickerNumber, setStickerNumber] = useState(1)
  const [hideSticker, setHideSticker] = useState(Math.random() < 0.5);

  const getRandomNumber = (maximum, minimum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  useEffect(() => {
    setStickerNumber(getRandomNumber(1, 10))
    setBodyHeight(window.document.body.scrollHeight)
    setBodyWidth(window.document.body.scrollWidth)
  }, [])

  // Hide on resize
  useEffect(() => {
    if (previousSize === undefined) return
    if (size.width === undefined) return
    if(previousSize !== size.width) {
      setHideSticker(true)
    }
  }, [size.width])

  return (typeof window !== "undefined" && !hideSticker) && (
    <div 
      className="hidden md:block absolute z-20 w-24 h-24"
      style={
        {
          left: getRandomNumber(0, bodyWidth - 100), 
          top: getRandomNumber(0, bodyHeight - 200)
        }
      }
    >
      <img src={`/stickers/${stickerNumber}.png`} />
    </div>
    
  );
}


