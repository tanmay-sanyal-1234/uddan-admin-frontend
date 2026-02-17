import { no_image } from "@/assets/images";

export const formatINR = (amount, compact = false) => {
    if (!amount || isNaN(amount)) return "₹0";

    if (compact) {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)} K`;
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};

export const apiImageWrapper = (imagePath) => {
    if (imagePath) {
        // ✅ already a full URL
        if (/^https?:\/\//i.test(imagePath)) {
            return imagePath;
        }

        // ✅ remove starting slash if exists
        const cleanPath = imagePath.startsWith("/")
            ? imagePath.slice(1)
            : imagePath;
        return `${import.meta.env.VITE_API_BASE_URL}/storage/${cleanPath}`;
    } else {
        return no_image;
    }
}