import React from "react";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header_wrapper}>
      <div className={styles.Header}>
        <LeftHeader styles={styles} />
        <div className={styles.search_container}>
             <input className={styles.search_input} type="text" name="search" placeholder="What are you looking for?" autoComplete="off" />
        </div>
        <RightHeader styles={styles} />
      </div>
    </header>
  );
};

export default Header;
