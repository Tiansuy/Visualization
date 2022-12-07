export const getImageUrl = function (name: string) {
    return new URL(`../assets/${name}.png`, import.meta.url).href
}