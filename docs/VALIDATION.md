# Data Validation System

This project includes a comprehensive data validation system for concerts data to ensure data integrity and prevent runtime errors.

## 🎯 Overview

The validation system checks:

- **Structure Validation**: Required fields (title, slug, date, location, media) and optional fields (description, programme)
- **Unique Constraints**: Ensures all concert slugs are unique
- **Data Format**: Validates slug format (URL-friendly), date format (ISO), and field types
- **Asset Existence**: Verifies that all referenced media files exist in the public directory

## 🔧 Usage

### Local Development

Run validation on concerts data:

```bash
# Validate concerts data
yarn validate:concerts

# Alternative (same command)
yarn validate
```

### Example Output

**✅ Success:**

```
🎵 Validating concerts data...

📄 Found 24 concerts to validate
✅ All concerts data is valid!

📊 Validation Summary:
   • Total concerts: 24
   • All required fields present: ✅
   • All slugs unique: ✅
   • All media files exist: ✅
   • Date formats valid: ✅
```

**❌ Failure:**

```
🎵 Validating concerts data...

📄 Found 2 concerts to validate
❌ Validation failed with the following errors:

🔍 Structure Validation Errors:
   • concert[0].title: Title is required and must be a non-empty string
     Value: ""
   • concert[1].slug: Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)
     Value: "Invalid Slug!"

📁 Missing Media Files:
   • concert[0].media: Media file not found: public/concerts/missing-poster.jpg

❌ Total errors: 3
```

## 📋 Validation Rules

### Required Fields

| Field      | Type   | Rules                                        |
| ---------- | ------ | -------------------------------------------- |
| `title`    | string | Non-empty string                             |
| `slug`     | string | URL-friendly format (`a-z`, `0-9`, `-` only) |
| `date`     | array  | Array of valid ISO date strings              |
| `location` | string | Non-empty string                             |
| `media`    | string | Path to existing media file                  |

### Optional Fields

| Field         | Type   | Rules                                  |
| ------------- | ------ | -------------------------------------- |
| `description` | string | String if provided                     |
| `programme`   | array  | Array of non-empty strings if provided |

### Examples

**✅ Valid Concert:**

```json
{
  "title": "Concert Vivaldi Jenkins, 14 et 15 juin 2025",
  "slug": "concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais",
  "date": ["2025-06-14T20:30:00+02:00", "2025-06-15T18:00:00+02:00"],
  "description": "Le Choeur des Pays du Mont Blanc...",
  "location": "Boëge et Saint-Gervais-les-Bains, France",
  "media": "/concerts/affiche-concert-vivaldi-jenkins.jpg",
  "programme": ["Gloria de Vivaldi", "Extraits du Gloria de Jenkins"]
}
```

**❌ Invalid Examples:**

```json
{
  "title": "", // ❌ Empty title
  "slug": "Invalid Slug!", // ❌ Contains space and special chars
  "date": "2025-06-14", // ❌ Should be array
  "location": "", // ❌ Empty location
  "media": "/missing-file.jpg", // ❌ File doesn't exist
  "programme": ["", 123] // ❌ Empty string and non-string
}
```

## 🛠 Technical Implementation

### Files Structure

```
scripts/validate-concerts.js # Standalone Node.js validation script
.github/workflows/          # CI/CD workflows
  data-validation.yml       # GitHub Actions validation workflow
```

### Validation Functions

Le script `scripts/validate-concerts.js` contient toutes les fonctions de validation :

- **`validateConcert(concert, index)`**: Valide un objet concert individuel
- **`validateConcerts(concerts)`**: Valide la structure du tableau et l'unicité des slugs
- **`validateMediaAssets(concerts, publicDir)`**: Vérifie l'existence des fichiers média
- **`validateConcertsWithAssets(concerts, publicDir)`**: Validation complète

### Fonctions Helper

Pour réduire la complexité cognitive, le script utilise des fonctions helper :

- **`validateRequiredStringField(concert, field, index, errors)`**: Valide les champs string requis
- **`validateSlugField(concert, index, errors)`**: Valide spécifiquement le format des slugs
- **`validateDateField(concert, index, errors)`**: Valide les tableaux de dates et le format ISO
- **`validateOptionalFields(concert, index, errors)`**: Valide les champs optionnels

### CI/CD Integration

The validation runs automatically on:

- **Push** to `main`, `develop`, or feature branches
- **Pull Requests** to `main` or `develop`
- **File Changes** in:
  - `assets/contents/**` (data files)
  - `public/concerts/**` (media files)
  - `public/articles/**` (article images)
  - `public/carrousel/**` (carousel images)
  - Validation code itself

### CI Workflow Steps

1. **Structure Validation**: Exécute la validation complète des données avec le script Node.js
2. **Asset Verification**: Vérifie que tous les fichiers référencés existent
3. **JSON Syntax**: Valide que les fichiers JSON sont analysables
4. **Code Quality**: Exécute le linting sur le code de validation

## 🧪 Testing

Tester la validation manuellement :

```bash
# Tester avec les données actuelles
yarn validate:concerts

# Tester le script directement
node scripts/validate-concerts.js
```

### Validation manuelle

Le script de validation teste automatiquement :

- ✅ Scénarios de données valides
- ❌ Scénarios de données invalides (champs manquants, mauvais types, etc.)
- 🔄 Cas limites (tableaux vides, caractères spéciaux, etc.)
- 📁 Validation de l'existence des assets
- 🔗 Détection des slugs dupliqués

## 🚀 Adding New Data

When adding new concerts:

1. **Add Concert Data**: Update `assets/contents/concerts.json`
2. **Add Media File**: Place poster/image in `public/concerts/`
3. **Test Locally**: Run `yarn validate` to check
4. **Commit Changes**: Push to trigger CI validation

### Common Issues & Solutions

| Issue                       | Solution                                         |
| --------------------------- | ------------------------------------------------ |
| "Slug must be URL-friendly" | Use only lowercase letters, numbers, and hyphens |
| "Media file not found"      | Ensure the file exists in `public/concerts/`     |
| "Date must be valid ISO"    | Use format: `2025-06-14T20:30:00+02:00`          |
| "Duplicate slug found"      | Make sure each concert has a unique slug         |

## 🔒 Benefits

- **Runtime Safety**: Prevents broken images and missing data errors
- **Data Consistency**: Ensures uniform data structure across all concerts
- **Developer Experience**: Catch issues early in development
- **Automated Checking**: No manual verification needed
- **Documentation**: Clear error messages help fix issues quickly

## 📚 Documentation associée

- [Configuration du projet Next.js](../README.md)
- [Guides de contribution](../.github/copilot-instructions.md)
- [Script de validation](../scripts/validate-concerts.js)
