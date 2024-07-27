import styles from "./TypeCardYellow.module.scss";
const TypeCardYellow = ({ item }) => {
  const { imgLink, title, text } = item;
  return (
    <>
      <div
        className={`d-flex justify-content-center p-5 my-5 ${styles.cardSize}`}
      >
        <div
          className={` rounded-5 col-6 d-flex flex-column p-5 ${styles.cardBg}`}
        >
          <h1 className="mb-2">{title}</h1>
          <p className={styles.cardText}>{text}</p>
        </div>
        <div className={`col-6  ${styles.cardImg}`}>
          <img
            className="rounded-5 h-100 w-100 object-fit-cover"
            src={imgLink}
            alt={title}
          />
        </div>
      </div>
    </>
  );
};
export default TypeCardYellow;
