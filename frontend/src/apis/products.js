import { removeSubCategories, selectProduct, selectSubCategories, selectSubCategory } from "../redux/slices/categorySlice";
import { fetchDeal } from "../redux/slices/collectionSlice";

const adaptProduct = (product) => ({
    ...product,
    id: product._id,
    new_price: product.priceAfterDiscount || product.price,
    old_price: product.priceAfterDiscount ? product.price : null,
    title: product.title,
    image: product.imageCover,
    images: product.images,
    description: product.description,
    rating: product.ratingsAverage,
    ratingCount: product.ratingsQuantity,
    category: product.category ? { title: product.category.name, id: product.category._id } : {},
    subCategory: product.subcategories && product.subcategories.length > 0 ? { title: product.subcategories[0].name, id: product.subcategories[0]._id } : {}
});

export async function getHotDealsProducts(dispatch, minSale) {
    try {
        // Fetching all products for now, ideally backend should support filtering by discount
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products?limit=50`);
        const data = await response.json();
        
        const products = data.data
            .map(adaptProduct)
            .filter(p => {
                if (!p.old_price) return false;
                const sale = Math.floor(100 - (p.new_price / p.old_price) * 100);
                return sale > minSale;
            });

        dispatch(fetchDeal({ title: "Hot deals", products }));
    } catch (error) {
        console.error("Failed to fetch hot deals:", error);
    }
}

export async function getAllDealsProducts(dispatch, minSale) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products?limit=100`);
        const data = await response.json();
        
        // Grouping by category to mimic original behavior
        const productsByCategory = {};
        
        data.data.forEach(p => {
            const adapted = adaptProduct(p);
            if (adapted.old_price) {
                const sale = Math.floor(100 - (adapted.new_price / adapted.old_price) * 100);
                if (sale > minSale) {
                    const catTitle = adapted.category.title || 'Other';
                    if (!productsByCategory[catTitle]) productsByCategory[catTitle] = [];
                    productsByCategory[catTitle].push(adapted);
                }
            }
        });

        Object.keys(productsByCategory).forEach(title => {
             if (productsByCategory[title].length > 0) {
                 dispatch(fetchDeal({ title: `${title} deals`, products: productsByCategory[title] }));
             }
        });

    } catch (error) {
        console.error("Failed to fetch all deals:", error);
    }
}

export async function getCategoryProducts(dispatch, categoryTitle) {
    try {
        dispatch(removeSubCategories());
        // First get category ID by title (inefficient but necessary without ID)
        // Ideally we should pass ID, but keeping signature same for now
        const catResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`);
        const catData = await catResponse.json();
        const category = catData.data.find(c => c.name === categoryTitle);

        if (category) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products?category=${category._id}`);
            const data = await response.json();
            const products = data.data.map(adaptProduct);
            
            // Group by subcategory for the UI
            const productsBySub = {};
            products.forEach(p => {
                const subTitle = p.subCategory.title || 'General';
                if (!productsBySub[subTitle]) productsBySub[subTitle] = [];
                productsBySub[subTitle].push(p);
            });

             Object.keys(productsBySub).forEach(subTitle => {
                dispatch(selectSubCategories({ title: subTitle, products: productsBySub[subTitle] }));
            });
        }
    } catch (error) {
        console.error("Failed to fetch category products:", error);
    }
}

export async function getProduct(dispatch, subCategoryID, productID) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${productID}`);
        const data = await response.json();
        if (data.data) {
             dispatch(selectProduct(adaptProduct(data.data)));
        }
    } catch (error) {
        console.error("Failed to fetch product:", error);
    }
}


export async function getSubCategory(dispatch, subCategoryID) {
    try {
        // Assuming subCategoryID is passed correctly
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/products?subcategories=${subCategoryID}`);
        const data = await response.json();
        const products = data.data.map(adaptProduct);
        
        // We need the subcategory title. 
        // If products are returned, we can take it from the first one
        const title = products.length > 0 ? products[0].subCategory.title : 'Subcategory';

        dispatch(selectSubCategory({
            title: title,
            products: products
        }));
    } catch (error) {
        console.error("Failed to fetch subcategory:", error);
    }
}
