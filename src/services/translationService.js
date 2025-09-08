const BASE_URL = "https://api.mymemory.translated.net/get";

export class TranslationService {
  static async translate(request) {
    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(request.text)}&langpair=${request.source}|${request.target}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        translatedText: data.responseData?.translatedText || "",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Translation failed: Unknown error"
      );
    }
  }

  static async detectLanguage(text) {
    return "en";
  }
}
