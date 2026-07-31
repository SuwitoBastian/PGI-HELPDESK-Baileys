export const THEMES = {
    light: "light",
    dark: "dark"
};

export function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "theme",
        theme
    );

}

export function loadTheme() {

    return (
        localStorage.getItem("theme") ||
        THEMES.light
    );

}