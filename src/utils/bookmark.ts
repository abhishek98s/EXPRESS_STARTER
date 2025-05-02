import dotenv from 'dotenv';
dotenv.config();

export const getHostnameFromUrl = (url: string) => {
  const pattern = /https?:\/\/(?:www\.)?([^/?]+)/i;
  const match = url.match(pattern);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

export const getTitleFromURL = async (url: string) => {
  try {
    const searchAPIKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchID = process.env.GOOGLE_SEARCH_ID;

    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${encodedUrl}`,
    );
    const data = await response.json();

    if (data.items && data.items.length > 0 && data.items[0].title) {
      return data.items[0].title || data.items[0].pagemap.metatags.title;
    } else {
      return getHostnameFromUrl(url);
    }
  } catch (error) {
    return getHostnameFromUrl(url);
  }
};

export const getThumbnailFromURL = async (url: string) => {
  try {
    const searchAPIKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchID = process.env.GOOGLE_SEARCH_ID;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchID}&q=${url}`,
    );
    const data = await response.json();

    const thumbnail = data.items[0].pagemap.cse_thumbnail[0].src;
    return thumbnail;
  } catch (error) {
    const favicon = `https://www.google.com/s2/favicons?domain=${getHostnameFromUrl(
      url,
    )}&sz=256`;
    return favicon;
  }
};
