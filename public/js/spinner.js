export const renderSpinner = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="/img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    parent.insertAdjacentHTML("beforeend", loader);
}