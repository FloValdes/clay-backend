import { Router } from 'express';
import Page from '../models/page.model';

const router = Router();

// Get translations for a specific page and locale
router.get('/', async (req, res) => {
  const { page, locale } = req.query;

  if (!page || !locale) {
    return res.status(400).json({ message: 'Page and locale are required' });
  }

  try {
    const pageData = await Page.findOne({ page: page.toString() });

    if (!pageData) {
      return res.status(404).json({ message: `No translations found for page: ${page}` });
    }

    const translationsForLocale: Record<string, string> = {};
    
    // Iterate over the keys of the Map and use .get() to access nested translations
    pageData.translations.forEach((translationMap, key) => {
      const translation = translationMap.get(locale.toString());
      translationsForLocale[key] = translation || `Translation missing for ${locale}`;
    });

    res.json(translationsForLocale);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching translations', error });
  }
});

// Add or update translations for a specific page
router.post('/', async (req, res) => {
  const { page, translations } = req.body;

  if (!page || !translations) {
    return res.status(400).json({ message: 'Page and translations are required' });
  }

  try {
    let pageData = await Page.findOne({ page });

    if (pageData) {
      // If page exists, update translations
      const newTranslations = new Map(pageData!.translations);

      Object.keys(translations).forEach((key) => {
        const existingTranslationMap = newTranslations.get(key);

        if (!existingTranslationMap) {
          newTranslations.set(key, new Map(Object.entries(translations[key])));
        } else {
          Object.entries(translations[key]).forEach(([locale, translation]) => {
            existingTranslationMap.set(locale, translation as string);
          });
        }
      });

      pageData!.translations = newTranslations;
      pageData!.updatedAt = new Date();
    } else {
      // Create new page if it doesn't exist
      const newTranslationsMap = new Map<string, Map<string, string>>();

      Object.keys(translations).forEach((key) => {
        newTranslationsMap.set(key, new Map(Object.entries(translations[key])));
      });

      pageData = new Page({
        page,
        translations: newTranslationsMap,
        updatedAt: new Date()
      });
    }

    await pageData.save();
    res.json(pageData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving page translations', error });
  }
});

router.delete('/:page', async (req, res) => {
  const { page } = req.params;

  try {
    const result = await Page.deleteOne({ page });
    if (result.deletedCount > 0) {
      res.json({ message: `Page ${page} deleted successfully` });
    } else {
      res.status(404).json({ message: `Page ${page} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page', error });
  }
});

export default router;
