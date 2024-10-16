import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Page from '../../models/page.model';

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_CONNECT_URI as string;
  await mongoose.connect(mongoUri);
});

// Clear the database after each test
afterEach(async () => {
  await Page.deleteMany({});
});

// Close MongoDB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Page Routes', () => {

  describe('POST /pages', () => {
    it('should add a new page with translations', async () => {
      const response = await request(app)
        .post('/pages')
        .send({
          page: 'home',
          translations: {
            welcome_message: {
              en: 'Welcome',
              es: 'Bienvenido'
            }
          }
        });
  
      expect(response.status).toBe(200);
      expect(response.body.page).toBe('home');
      expect(response.body.translations.welcome_message.en).toBe('Welcome');
      expect(response.body.translations.welcome_message.es).toBe('Bienvenido');
    });
  
    it('should return 400 for missing page or translations', async () => {
      const response = await request(app)
        .post('/pages')
        .send({ page: 'home' });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Page and translations are required');
    });
  
    it('should update an existing translation', async () => {
      await request(app)
        .post('/pages')
        .send({
          page: 'home',
          translations: {
            welcome_message: {
              en: 'Welcome',
              es: 'Bienvenido'
            }
          }
        });

      const response = await request(app)
        .post('/pages')
        .send({
          page: 'home',
          translations: {
            welcome_message: {
              en: 'Hello'
            }
          }
        });
  
      expect(response.status).toBe(200);
      expect(response.body.translations.welcome_message.en).toBe('Hello');
      expect(response.body.translations.welcome_message.es).toBe('Bienvenido');
    });
  
    it('should add a new translation to an existing page', async () => {
      await request(app)
        .post('/pages')
        .send({
          page: 'home',
          translations: {
            welcome_message: {
              en: 'Welcome',
              es: 'Bienvenido'
            }
          }
        });
  
      const response = await request(app)
        .post('/pages')
        .send({
          page: 'home',
          translations: {
            cta_button: {
              en: 'Contact Us',
              es: 'Contáctanos'
            }
          }
        });
  
      expect(response.status).toBe(200);
      expect(response.body.translations.cta_button.en).toBe('Contact Us');
      expect(response.body.translations.cta_button.es).toBe('Contáctanos');
      expect(response.body.translations.welcome_message.en).toBe('Welcome');
    });
  });  

  describe('GET /pages', () => {
    it('should retrieve translations for a specific page and locale', async () => {
      const page = new Page({
        page: 'home',
        translations: {
          welcome_message: { en: 'Welcome', es: 'Bienvenido' },
          cta_button: { en: 'Contact Us', es: 'Contáctanos' }
        }
      });
      await page.save();

      const response = await request(app).get('/pages').query({ page: 'home', locale: 'es' });

      expect(response.status).toBe(200);
      expect(response.body.welcome_message).toBe('Bienvenido');
      expect(response.body.cta_button).toBe('Contáctanos');
    });

    it('should return 400 for missing page or locale query params', async () => {
      const response = await request(app).get('/pages').query({ page: 'home' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Page and locale are required');
    });

    it('should return 404 if the page is not found', async () => {
      const response = await request(app).get('/pages').query({ page: 'about', locale: 'en' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No translations found for page: about');
    });
  });

  describe('DELETE /pages/:page', () => {
    it('should delete a page by page name', async () => {
      const page = new Page({
        page: 'home',
        translations: {
          welcome_message: { en: 'Welcome', es: 'Bienvenido' }
        }
      });
      await page.save();

      const response = await request(app).delete('/pages/home');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Page home deleted successfully');

      const findResponse = await Page.findOne({ page: 'home' });
      expect(findResponse).toBeNull();
    });

    it('should return 404 if the page does not exist', async () => {
      const response = await request(app).delete('/pages/about');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Page about not found');
    });
  });
});
