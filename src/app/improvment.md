// GALLERY SERVICE
getRandomImage(): Observable<IGallery> {
this.setLoading(true);
const randomDelay = this.getRandomDelay(200, 300);

return this.http.get(this.apiUrl, { responseType: 'blob' }).pipe(
delay(randomDelay),
map((blob: Blob) => {
const objectURL = URL.createObjectURL(blob);
return {
id: this.generateRandomId(),
photo: objectURL,
isFavorite: false
} as IGallery;
}),
finalize(() => this.setLoading(false))
);
}

// ACTIVE-LINK.DIRECTIVE (Set the interface)
interface LinkStyle {
background: string;
color: string;
[key: string]: string;
}
