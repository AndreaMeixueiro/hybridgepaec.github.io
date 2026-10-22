# Pensamiento crítico en tiempos de IA

Blog escolar de estudiantes de Hybridge Prepa, publicado con GitHub Pages:
https://hybridgeeducation.github.io/hybridgepaec/

## Estructura

- `index.html`: la página (Inicio, Sobre el proyecto, Publicaciones).
- `assets/css/styles.css`: estilos con la paleta y tipografía del Manual de imagen Hybridge.
- `assets/js/main.js`: carruseles e imagen ampliada.
- `assets/carruseles/<publicación>/01.webp, 02.webp, …`: imágenes de cada publicación.

## Agregar una publicación

1. Guarda las imágenes en una carpeta nueva dentro de `assets/carruseles/`, numeradas `01.webp`, `02.webp`, etc.
2. Copia un bloque `<article class="post">` en `index.html` y cambia `data-images`, `data-count`, el título y la descripción.
3. Si las imágenes no son 4:5, indica su proporción (ancho ÷ alto) en el carrusel, por ejemplo `style="--ratio: 1.7778"` para 16:9 o `style="--ratio: 1"` para cuadradas.
