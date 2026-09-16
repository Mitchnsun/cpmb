#!/usr/bin/env node

const { readFileSync, existsSync } = require("fs");
const { join, resolve } = require("path");

// Helper functions to reduce cognitive complexity
function validateRequiredStringField(concert, field, index, errors) {
  if (!concert[field] || typeof concert[field] !== "string" || concert[field].trim() === "") {
    errors.push({
      field: `concert[${index}].${field}`,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required and must be a non-empty string`,
      value: concert[field],
    });
  }
}

function validateSlugField(concert, index, errors) {
  if (!concert.slug || typeof concert.slug !== "string" || concert.slug.trim() === "") {
    errors.push({
      field: `concert[${index}].slug`,
      message: "Slug is required and must be a non-empty string",
      value: concert.slug,
    });
  } else {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(concert.slug)) {
      errors.push({
        field: `concert[${index}].slug`,
        message: "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
        value: concert.slug,
      });
    }
  }
}

function validateDateField(concert, index, errors) {
  if (!concert.date || !Array.isArray(concert.date) || concert.date.length === 0) {
    errors.push({
      field: `concert[${index}].date`,
      message: "Date is required and must be a non-empty array",
      value: concert.date,
    });
  } else {
    concert.date.forEach((dateStr, dateIndex) => {
      if (typeof dateStr !== "string" || dateStr.trim() === "") {
        errors.push({
          field: `concert[${index}].date[${dateIndex}]`,
          message: "Each date must be a non-empty string",
          value: dateStr,
        });
      } else {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          errors.push({
            field: `concert[${index}].date[${dateIndex}]`,
            message: "Date must be a valid ISO date string",
            value: dateStr,
          });
        }
      }
    });
  }
}

function validateOptionalStringArray(concert, field, index, errors) {
  if (concert[field] === undefined) return;

  if (!Array.isArray(concert[field])) {
    errors.push({
      field: `concert[${index}].${field}`,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be an array if provided`,
      value: concert[field],
    });
    return;
  }

  concert[field].forEach((item, itemIndex) => {
    if (typeof item !== "string" || item.trim() === "") {
      errors.push({
        field: `concert[${index}].${field}[${itemIndex}]`,
        message: `Each ${field} item must be a non-empty string`,
        value: item,
      });
    }
  });
}

function validateOptionalFields(concert, index, errors) {
  if (concert.description !== undefined && typeof concert.description !== "string") {
    errors.push({
      field: `concert[${index}].description`,
      message: "Description must be a string if provided",
      value: concert.description,
    });
  }

  /*
   * A concert may have no poster: some of them were never given one, and the
   * pages already render without it. When one is declared it still has to
   * resolve to a real file (see validateMediaAssets).
   */
  if (concert.media !== undefined && (typeof concert.media !== "string" || concert.media.trim() === "")) {
    errors.push({
      field: `concert[${index}].media`,
      message: "Media must be a non-empty string if provided",
      value: concert.media,
    });
  }

  validateOptionalStringArray(concert, "programme", index, errors);
  validateOptionalStringArray(concert, "performers", index, errors);
  validateOptionalStringArray(concert, "venues", index, errors);

  /*
   * `venues` names the place of each performance, in the order of the dates.
   * A count that does not match them pairs a date with the wrong town, so it
   * is refused rather than published.
   */
  if (Array.isArray(concert.venues) && Array.isArray(concert.date) && concert.venues.length !== concert.date.length) {
    errors.push({
      field: `concert[${index}].venues`,
      message: `Venues must carry exactly one place per date (${concert.date.length} expected, ${concert.venues.length} given)`,
      value: concert.venues,
    });
  }
}

// Inline validation functions to avoid import issues
function validateConcert(concert, index) {
  const errors = [];

  if (!concert || typeof concert !== "object") {
    return {
      isValid: false,
      errors: [{ field: `concert[${index}]`, message: "Concert must be an object" }],
    };
  }

  // Validate required fields using helper functions
  validateRequiredStringField(concert, "title", index, errors);
  validateSlugField(concert, index, errors);
  validateDateField(concert, index, errors);
  validateRequiredStringField(concert, "location", index, errors);

  // Validate optional fields
  validateOptionalFields(concert, index, errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateConcerts(concerts) {
  const errors = [];

  if (!Array.isArray(concerts)) {
    return {
      isValid: false,
      errors: [{ field: "concerts", message: "Concerts must be an array" }],
    };
  }

  const slugs = new Set();

  concerts.forEach((concert, index) => {
    // Validate individual concert structure
    const concertValidation = validateConcert(concert, index);
    errors.push(...concertValidation.errors);

    // Check for unique slugs
    if (concert && typeof concert === "object" && "slug" in concert) {
      const slug = concert.slug;
      if (typeof slug === "string" && slug.trim() !== "") {
        if (slugs.has(slug)) {
          errors.push({
            field: `concert[${index}].slug`,
            message: `Duplicate slug "${slug}" found`,
            value: slug,
          });
        } else {
          slugs.add(slug);
        }
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateMediaAssets(concerts, publicDir = "public") {
  const errors = [];

  concerts.forEach((concert, index) => {
    if (concert.media) {
      const mediaPath = concert.media.startsWith("/") ? concert.media.slice(1) : concert.media;
      const fullPath = join(publicDir, mediaPath);

      if (!existsSync(fullPath)) {
        errors.push({
          field: `concert[${index}].media`,
          message: `Media file not found: ${fullPath}`,
          value: concert.media,
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateConcertsWithAssets(concerts, publicDir = "public") {
  const structureValidation = validateConcerts(concerts);

  if (!structureValidation.isValid) {
    return structureValidation;
  }

  const assetsValidation = validateMediaAssets(concerts, publicDir);

  return {
    isValid: structureValidation.isValid && assetsValidation.isValid,
    errors: [...structureValidation.errors, ...assetsValidation.errors],
  };
}

/**
 * Main validation script for concerts data
 */
function validateConcertsData() {
  console.log("🎵 Validating concerts data...\n");

  try {
    // Read concerts.json
    const projectRoot = resolve(__dirname, "..");
    const concertsPath = join(projectRoot, "assets/contents/concerts.json");
    const concertsData = JSON.parse(readFileSync(concertsPath, "utf-8"));

    console.log(`📄 Found ${concertsData.length} concerts to validate`);

    // Validate with assets
    const publicDir = join(projectRoot, "public");
    const result = validateConcertsWithAssets(concertsData, publicDir);

    if (result.isValid) {
      console.log("✅ All concerts data is valid!\n");

      // Show summary
      console.log("📊 Validation Summary:");
      console.log(`   • Total concerts: ${concertsData.length}`);
      console.log(`   • All required fields present: ✅`);
      console.log(`   • All slugs unique: ✅`);
      console.log(`   • All media files exist: ✅`);
      console.log(`   • Date formats valid: ✅\n`);

      process.exit(0);
    } else {
      console.log("❌ Validation failed with the following errors:\n");

      // Group errors by type for better readability
      const structureErrors = result.errors.filter((error) => !error.message.includes("Media file not found"));
      const assetErrors = result.errors.filter((error) => error.message.includes("Media file not found"));

      if (structureErrors.length > 0) {
        console.log("🔍 Structure Validation Errors:");
        structureErrors.forEach((error) => {
          console.log(`   • ${error.field}: ${error.message}`);
          if (error.value !== undefined) {
            console.log(`     Value: ${JSON.stringify(error.value)}`);
          }
        });
        console.log();
      }

      if (assetErrors.length > 0) {
        console.log("📁 Missing Media Files:");
        assetErrors.forEach((error) => {
          console.log(`   • ${error.field}: ${error.message}`);
        });
        console.log();
      }

      console.log(`❌ Total errors: ${result.errors.length}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Error during validation:");
    console.error(error);
    process.exit(1);
  }
}

// Run the validation
validateConcertsData();
