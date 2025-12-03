import { fetchCategories } from "../redux/slices/categorySlice";

export async function getCategories(dispatch) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`);
        const data = await response.json();
        // Backend returns { data: [...] }
        // Frontend expects array of objects with { id, title, ... }
        const categories = data.data.map(cat => ({
            id: cat._id,
            title: cat.name,
            image: cat.image,
            slug: cat.slug
        }));
        
        dispatch(fetchCategories(categories));
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
}
