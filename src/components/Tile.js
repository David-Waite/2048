import styles from "../styles/tile.module.css";

export default function Tile({ number, position, animation, ref }) {
  return (
    <div
      ref={ref}
      id={styles[number]}
      className={`${styles.tile} ${styles[position]} ${
        number === 0 && styles.notInPlay
      } ${animation && styles.animation}`}
    >
      {number}
    </div>
  );
}
