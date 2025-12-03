import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_content}>
                <div className={styles.footer_section}>
                    <h3>We're Always Here To Help</h3>
                    <ul>
                        <li>Help Center</li>
                        <li>Contact Us</li>
                    </ul>
                </div>

                <div className={styles.footer_section}>
                    <h3>Electronics</h3>
                    <ul>
                        <li>Mobiles</li>
                        <li>Tablets</li>
                        <li>Laptops</li>
                        <li>Home Appliances</li>
                    </ul>
                </div>

                <div className={styles.footer_section}>
                    <h3>Fashion</h3>
                    <ul>
                        <li>Women's Fashion</li>
                        <li>Men's Fashion</li>
                        <li>Girls' Fashion</li>
                        <li>Boys' Fashion</li>
                    </ul>
                </div>

                <div className={styles.footer_section}>
                    <h3>Home and Kitchen</h3>
                    <ul>
                        <li>Kitchen & Dining</li>
                        <li>Furniture</li>
                        <li>Home Decor</li>
                        <li>Bedding & Bath</li>
                    </ul>
                </div>

                <div className={styles.footer_section}>
                    <h3>Beauty</h3>
                    <ul>
                        <li>Fragrance</li>
                        <li>Make-Up</li>
                        <li>Haircare</li>
                        <li>Skincare</li>
                    </ul>
                </div>
            </div>

            <div className={styles.footer_bottom}>
                <div className={styles.social_links}>
                    <h3>Connect with us</h3>
                    <div className={styles.icons}>
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-twitter"></i>
                        <i className="fab fa-instagram"></i>
                        <i className="fab fa-linkedin-in"></i>
                    </div>
                </div>
                
                <div className={styles.copyright}>
                    <p>© 2023 Noon E-Commerce. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;