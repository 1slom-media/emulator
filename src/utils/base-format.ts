import axios from 'axios';

export async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Tasvirni yuklashda xatolik:', error.message);
    throw error;
  }
}
