import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../apis/categories";
import styles from './CategoryNav.module.css';

const CategoryNav = () => {
    const categories = useSelector(({ categoryState }) => categoryState.categories);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getCategories(dispatch);
    }, [dispatch])

    return (
        <div className={styles.category_nav_container}>
            <div className={styles.category_nav}>
                <ul className={styles.category_list}>
                    <li className={styles.all_categories} onClick={() => navigate('/')}>
                        ALL CATEGORIES
                        <i className="fas fa-chevron-down" style={{marginLeft: '8px', fontSize: '10px'}}></i>
                    </li>
                    {categories && categories.map((category) => (
                        <li 
                            key={category.id}
                            className={styles.category_item}
                            onClick={() => navigate(`/${category.title}`)}
                        >
                            {category.title.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryNav;
