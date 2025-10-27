# 🎨 Guide TailwindCSS - Pensaga

## Configuration

Le projet utilise **TailwindCSS v4** avec la syntaxe moderne d'importation.

### Fichiers de configuration

- `postcss.config.js` : Configuration PostCSS avec TailwindCSS et Autoprefixer
- `src/index.css` : Import de TailwindCSS et styles personnalisés

## Utilisation dans les composants

```jsx
// Exemple de composant avec TailwindCSS
function Button({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}
```

## Classes utilitaires courantes

### Layout
- `flex`, `grid`, `block`, `inline-block`
- `flex-col`, `flex-row`
- `items-center`, `justify-between`
- `gap-4`, `space-y-4`

### Typography
- `text-xl`, `text-2xl`, `text-3xl` (tailles)
- `font-bold`, `font-semibold`, `font-light`
- `text-center`, `text-left`, `text-right`

### Spacing
- `p-4`, `px-4`, `py-4` (padding)
- `m-4`, `mx-4`, `my-4` (margin)

### Colors (thème Pensaga)
- `bg-purple-600`, `bg-cyan-500` (couleurs primaires)
- `text-gray-800`, `text-white`
- `border-gray-300`

### Responsive
- `md:`, `lg:`, `xl:` (breakpoints)
- Exemple: `md:flex-row lg:grid-cols-3`

## Variables personnalisées

Dans `src/index.css`, les variables CSS personnalisées :
- `--color-primary` : Pourple
- `--color-secondary` : Cyan
- `--color-accent` : Amber

## Ressources

- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [TailwindCSS v4 Guide](https://tailwindcss.com/docs/v4-beta)
