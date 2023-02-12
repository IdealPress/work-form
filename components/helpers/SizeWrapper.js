import styles from "./SizeWrapper.module.css";

const selectSize = (size) => {
  const sizeLowerCase = size?.toLowerCase();
  switch(sizeLowerCase) {
    case "small":
      return "w-full md:w-1/3";
    case "medium":
      return "w-full md:w-2/3";
    default:
      return "w-full";
  }
}

export default function SizeWrapper({size, children}) {
  return (
    <div className={`${styles.base} ${selectSize(size)}`}>
      {children}
    </div>
  )
  
}
