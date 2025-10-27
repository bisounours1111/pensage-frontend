export const genresList = [
  // Romance
  { id: 'romance', name: 'Romance', category: 'Romance' },
  { id: 'romance-contemporaine', name: 'Romance Contemporaine', category: 'Romance' },
  { id: 'romance-historique', name: 'Romance Historique', category: 'Romance' },
  { id: 'romance-etudiante', name: 'Romance Étudiante', category: 'Romance' },
  { id: 'romance-action', name: 'Romance d\'Action', category: 'Romance' },
  
  // Romantasy
  { id: 'romantasy', name: 'Romantasy', category: 'Romantasy' },
  { id: 'romance-fantasy', name: 'Romance Fantasy', category: 'Romantasy' },
  { id: 'romance-paranormale', name: 'Romance Paranormale', category: 'Romantasy' },
  { id: 'dark-romance', name: 'Dark Romance', category: 'Romantasy' },
  { id: 'reverse-harem', name: 'Reverse Harem', category: 'Romantasy' },
  { id: 'romance-surnaturel', name: 'Romance Surnaturel', category: 'Romantasy' },
  
  // Fantasy
  { id: 'fantasy', name: 'Fantasy', category: 'Fantasy' },
  { id: 'high-fantasy', name: 'High Fantasy', category: 'Fantasy' },
  { id: 'urban-fantasy', name: 'Urban Fantasy', category: 'Fantasy' },
  { id: 'fantasy-dark', name: 'Dark Fantasy', category: 'Fantasy' },
  { id: 'fantasy-epic', name: 'Epic Fantasy', category: 'Fantasy' },
  { id: 'fantasy-young-adult', name: 'YA Fantasy', category: 'Fantasy' },
  
  // Science-Fiction
  { id: 'science-fiction', name: 'Science-Fiction', category: 'Science-Fiction' },
  { id: 'sf-space-opera', name: 'Space Opera', category: 'Science-Fiction' },
  { id: 'sf-cyberpunk', name: 'Cyberpunk', category: 'Science-Fiction' },
  { id: 'sf-steampunk', name: 'Steampunk', category: 'Science-Fiction' },
  { id: 'sf-post-apocalyptique', name: 'Post-Apocalyptique', category: 'Science-Fiction' },
  { id: 'sf-dystopie', name: 'Dystopie', category: 'Science-Fiction' },
  
  // LGBTQIA+
  { id: 'lgbtqia', name: 'LGBTQIA+', category: 'LGBTQIA+' },
  { id: 'lgbt-contemporain', name: 'Contemporain LGBTQ+', category: 'LGBTQIA+' },
  { id: 'lgbt-fantasy', name: 'Fantasy LGBTQ+', category: 'LGBTQIA+' },
  { id: 'lgbt-historical', name: 'Historique LGBTQ+', category: 'LGBTQIA+' },
  { id: 'm-m-romance', name: 'M/M Romance', category: 'LGBTQIA+' },
  { id: 'f-f-romance', name: 'F/F Romance', category: 'LGBTQIA+' },
  
  // Autres genres populaires
  { id: 'thriller', name: 'Thriller', category: 'Autres' },
  { id: 'suspense', name: 'Suspense', category: 'Autres' },
  { id: 'mystery', name: 'Mystère', category: 'Autres' },
  { id: 'horror', name: 'Horreur', category: 'Autres' },
  { id: 'historical-fiction', name: 'Fiction Historique', category: 'Autres' },
  { id: 'young-adult', name: 'Young Adult (YA)', category: 'Autres' },
  { id: 'new-adult', name: 'New Adult', category: 'Autres' },
  { id: 'contemporary', name: 'Contemporain', category: 'Autres' },
  { id: 'slice-of-life', name: 'Slice of Life', category: 'Autres' },
  { id: 'adventure', name: 'Aventure', category: 'Autres' },
  { id: 'mafia-romance', name: 'Romance Mafia', category: 'Autres' },
  { id: 'romance-sports', name: 'Romance Sportive', category: 'Autres' },
];

// Regrouper par catégorie pour l'affichage
export const genresByCategory = genresList.reduce((acc, genre) => {
  if (!acc[genre.category]) {
    acc[genre.category] = [];
  }
  acc[genre.category].push(genre);
  return acc;
}, {});

export default genresList;

