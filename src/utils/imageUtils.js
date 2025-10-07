export const withBase = (imagePath) => {
	if (!imagePath) return "";
	if (imagePath.startsWith("http")) return imagePath;

	const baseUrl =
		process.env.REACT_APP_API_URL ||
		"https://bookswap-backend-np9d.onrender.com";

	if (imagePath.startsWith("/uploads/")) {
		return `${baseUrl}${imagePath}`;
	}

	return `${baseUrl}/uploads/${imagePath}`;
};

export const handleImageError = (e, fallbackText = "") => {
	const img = e.target;
	const parent = img.parentElement;

	img.style.display = "none";

	let fallback = parent.querySelector(".image-fallback");
	if (!fallback) {
		fallback = document.createElement("div");
		fallback.className =
			"image-fallback d-flex align-items-center justify-content-center bg-light";
		fallback.style.cssText = img.style.cssText;
		fallback.innerHTML = `
      <div class="text-center text-muted">
        <div style="font-size: 2rem;">📚</div>
        <p class="mt-2 mb-0 small">Image not available</p>
      </div>
    `;
		parent.appendChild(fallback);
	} else {
		fallback.style.display = "flex";
	}
};
