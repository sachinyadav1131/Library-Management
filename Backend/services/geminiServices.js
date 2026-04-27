import { PDFParse } from "pdf-parse";
import { InferenceClient } from "@huggingface/inference";

const getHfClient = () => {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Missing Hugging Face Key");
  }

  return new InferenceClient(process.env.HUGGINGFACE_API_KEY.trim());
};
const DEFAULT_HF_SUMMARIZATION_MODELS = [
  "facebook/bart-large-cnn",
  "sshleifer/distilbart-cnn-12-6",
];
const DEFAULT_HF_DESCRIPTION_MODELS = [
  "google/flan-t5-large",
  "google/flan-t5-base",
];

const NOISE_PATTERNS = [
  /--\s*\d+\s*of\s*\d+\s*--/gi,
  /---\s*page\s*\d+\s*---/gi,
  /\bpage\s+\d+\s+of\s+\d+\b/gi,
  /\b(?:rent|buy|purchase)\s+price\b/gi,
  /\bin\s+stock\b/gi,
  /\b(?:soft\s+copy|physical)\b/gi,
  /\u20B9\s*\d+/g,
];

const normalizePdfText = (text) => {
  let cleaned = text
    .replace(/\r/g, "\n")
    .replace(/\\/g, " ")
    .replace(/[^\S\n]+/g, " ");

  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }

  return cleaned
    .replace(/[_*=]{3,}/g, " ")
    .replace(/-{4,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
};

const isUsefulLine = (line) => {
  const trimmed = line.trim();
  if (trimmed.length < 35) return false;

  const letters = (trimmed.match(/[A-Za-z]/g) || []).length;
  const digits = (trimmed.match(/\d/g) || []).length;
  const alphaRatio = letters / trimmed.length;

  if (letters < 20 || alphaRatio < 0.55) return false;
  if (digits > letters / 2) return false;
  if (/^[^a-zA-Z]+$/.test(trimmed)) return false;

  return true;
};

const selectBestExcerpt = (text) => {
  const normalizedText = normalizePdfText(text);
  const abstractMatch = normalizedText.match(
    /\bAbstract\b([\s\S]{200,2200}?)(?=\b(?:1\.?\s*Introduction|Introduction|1\.1\s*Problem Statement|Keywords)\b)/i,
  );

  if (abstractMatch?.[1]) {
    return abstractMatch[1].replace(/\s+/g, " ").trim().slice(0, 2200);
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const uniqueLines = [];
  const seen = new Set();

  for (const line of lines) {
    const key = line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLines.push(line);
    }
  }

  const usefulLines = uniqueLines.filter(isUsefulLine);
  const excerpt = usefulLines.join(" ").replace(/\s+/g, " ").trim();

  if (excerpt.length >= 250) {
    return excerpt.slice(0, 4500);
  }

  return normalizedText.replace(/\n/g, " ").replace(/\s+/g, " ").slice(0, 4500);
};

const getHfSummarizationModels = () => {
  const envModels = process.env.HF_SUMMARIZATION_MODELS
    ?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return envModels?.length ? envModels : DEFAULT_HF_SUMMARIZATION_MODELS;
};

const getHfDescriptionModels = () => {
  const envModels = process.env.HF_DESCRIPTION_MODELS
    ?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return envModels?.length ? envModels : DEFAULT_HF_DESCRIPTION_MODELS;
};

const toSentenceCase = (value) => {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const extractMeaningfulSentences = (rawText) => {
  return rawText
    .split(/(?<=[.?!])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 45)
    .filter((sentence) => {
      const words = sentence.split(/\s+/).length;
      return words >= 8 && !/^\d+[\d\s.-]*$/.test(sentence);
    });
};

const joinSentencesToWordTarget = (sentences, minWords, maxWords) => {
  const selected = [];
  let wordCount = 0;

  for (const sentence of sentences) {
    const sentenceWordCount = sentence.split(/\s+/).length;
    if (selected.length > 0 && wordCount + sentenceWordCount > maxWords) {
      break;
    }

    selected.push(sentence);
    wordCount += sentenceWordCount;

    if (wordCount >= minWords) {
      break;
    }
  }

  return selected.join(" ").replace(/\s+/g, " ").trim();
};

const ensureTrailingPunctuation = (text) => {
  if (!text) return text;
  return /[.?!]$/.test(text) ? text : `${text}.`;
};

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const keywordGroups = [
  {
    label: "mathematics",
    words: ["algebra", "geometry", "calculus", "equation", "theorem", "matrix", "statistics"],
  },
  {
    label: "drama",
    words: ["play", "theatre", "character", "dialogue", "scene", "performance", "stage"],
  },
  {
    label: "fiction",
    words: ["novel", "story", "character", "plot", "narrative", "fantasy", "mystery"],
  },
  {
    label: "electronics",
    words: ["electronics", "communication", "signal", "embedded", "circuit", "sensor"],
  },
  {
    label: "computer vision",
    words: ["vision", "image", "segmentation", "detection", "mask r-cnn", "opencv", "defect"],
  },
  {
    label: "machine learning",
    words: ["deep learning", "model", "training", "neural", "dataset", "inference", "classification"],
  },
  {
    label: "manufacturing",
    words: ["casting", "industrial", "quality control", "inspection", "metal", "production", "defect"],
  },
];

const inferDomainCategory = (rawText, bookMeta = {}) => {
  const metaCategory = bookMeta.category?.trim();
  if (metaCategory) return metaCategory.toLowerCase();

  const text = rawText.toLowerCase();
  let bestLabel = "technical";
  let bestScore = 0;

  for (const group of keywordGroups) {
    const score = group.words.reduce(
      (total, word) => total + (text.includes(word) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestLabel = group.label;
    }
  }

  if (text.includes("report") || text.includes("abstract") || text.includes("methodology")) {
    return bestLabel === "technical" ? "academic" : `${bestLabel} / academic`;
  }

  return bestLabel;
};

const extractTopKeywords = (rawText) => {
  const stopWords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "into", "using", "used", "were", "was",
    "are", "their", "have", "has", "had", "will", "shall", "than", "then", "into", "about", "such",
    "which", "while", "where", "when", "these", "those", "your", "book", "title", "report", "final",
    "page", "introduction", "abstract", "study", "project", "system", "application", "results",
  ]);

  const tokens = rawText.toLowerCase().match(/[a-z][a-z-]{3,}/g) || [];
  const counts = new Map();

  for (const token of tokens) {
    if (stopWords.has(token)) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
};

const buildCatalogStyleDescription = (summaryText, rawText, bookMeta = {}) => {
  const { title = "", author = "" } = bookMeta;
  const safeTitle = toSentenceCase(title || "This title");
  const domainCategory = inferDomainCategory(rawText, bookMeta);
  const keywords = extractTopKeywords(rawText);
  const keywordText = keywords.length
    ? ` Key themes include ${keywords.slice(0, 5).join(", ")}.`
    : "";
  const cleanedSummary = ensureTrailingPunctuation(
    summaryText
      .replace(/\s+/g, " ")
      .replace(/\bthis (paper|report|project)\b/gi, safeTitle)
      .trim(),
  );

  const intro = `${safeTitle} is a ${domainCategory} work that offers readers a broad overview of the subject, its main concerns, and the practical or intellectual context in which the material sits.`;
  const audience = author
    ? ` Written by ${author}, the text is especially useful for readers who want a structured explanation of the topic without having to rely on highly fragmented technical details alone.`
    : ` It is especially useful for readers who want a structured explanation of the topic without having to rely on highly fragmented technical details alone.`;
  const closing = ` Overall, the description should be read as a library-style introduction: it highlights the book's focus, scope, and likely value for students, general readers, or practitioners who want a clear sense of what the work covers before beginning it.`;

  return `${intro} ${cleanedSummary}${keywordText}${audience}${closing}`
    .replace(/\s+/g, " ")
    .slice(0, 2200)
    .trim();
};

const buildFallbackDescription = (rawText, bookMeta = {}) => {
  const { title = "" } = bookMeta;
  const safeTitle = toSentenceCase(title || "This title");
  const domainCategory = inferDomainCategory(rawText, bookMeta);
  const candidateSentences = extractMeaningfulSentences(rawText);
  const assembledBody = joinSentencesToWordTarget(candidateSentences, 120, 180);
  const keywords = extractTopKeywords(rawText);
  const keywordText = keywords.length
    ? ` Key themes include ${keywords.slice(0, 5).join(", ")}.`
    : "";

  if (assembledBody) {
    const lead = `${safeTitle} belongs broadly to the ${domainCategory} category and can be understood as a work that introduces the central topic, explains why it matters, and outlines the main methods or ideas used to explore it.`;
    const interpretation = ` Rather than reproducing the source text line by line, this description presents the material as a readable library summary for someone deciding whether the book is relevant to their interests or studies.`;
    const closing = ` It is likely to appeal to readers who want both conceptual context and a sense of how the subject connects to practical applications, academic inquiry, or broader themes in the field.`;
    return `${lead} ${assembledBody}${keywordText}${interpretation}${closing}`
      .replace(/\s+/g, " ")
      .slice(0, 2200)
      .trim();
  }

  return `${safeTitle} belongs broadly to the ${domainCategory} category and serves as an informative introduction to the subject it covers. This description is written in a library style, so it focuses on the book's scope, themes, and likely usefulness rather than repeating exact lines from the original text. Readers can expect an overview of the main ideas, methods, and applications discussed in the work, along with a clearer sense of the intended audience and practical value of the material. It is a suitable choice for someone looking for a more interpretive summary before reading the full document.`.trim();
};

const generateBookDescriptionWithHf = async (rawText, bookMeta = {}) => {
  const hf = getHfClient();
  const { title = "", category = "" } = bookMeta;
  const generationModels = getHfDescriptionModels();
  const summarizationModels = getHfSummarizationModels();
  const domainCategory = inferDomainCategory(rawText, bookMeta);

  const descriptionPrompt = `
Write a fresh library catalog description in 250 to 320 words.
Do not copy exact lines from the source.
Infer the likely category of the work and present it naturally in the description.
Focus on topic, scope, themes, methods, intended readers, and practical or academic value.
Avoid bullet points.

Title: ${title || "Unknown"}
Category hint: ${category || domainCategory}
Source excerpt:
${rawText.slice(0, 2500)}
  `.trim();

  for (const modelName of generationModels) {
    try {
      console.log(`Trying Hugging Face text generation model: ${modelName}`);
      const result = await hf.textGeneration({
        model: modelName,
        inputs: descriptionPrompt,
        parameters: {
          max_new_tokens: 420,
          return_full_text: false,
          temperature: 0.7,
        },
      });

      const generatedText = ensureTrailingPunctuation(
        result?.generated_text?.replace(/\s+/g, " ").trim(),
      );

      if (generatedText && countWords(generatedText) >= 180) {
        return generatedText;
      }
    } catch (error) {
      console.warn(`HF text generation failed for ${modelName}: ${error.message}`);
    }
  }

  for (const modelName of summarizationModels) {
    try {
      console.log(`Trying Hugging Face summarization model: ${modelName}`);
      const result = await hf.summarization({
        model: modelName,
        inputs: `${title ? `${title}. ` : ""}${rawText}`.slice(0, 3500),
        parameters: {
          max_length: 260,
          min_length: 150,
        },
      });

      const summaryText = ensureTrailingPunctuation(
        result?.summary_text?.replace(/\s+/g, " ").trim(),
      );
      if (summaryText && countWords(summaryText) >= 100) {
        return buildCatalogStyleDescription(summaryText, rawText, bookMeta);
      }
    } catch (error) {
      console.warn(`HF summarization failed for ${modelName}: ${error.message}`);
    }
  }

  return null;
};

export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
    const result = await parser.getText();

    if (parser.destroy) await parser.destroy();
    if (!result.text || result.text.trim() === "") throw new Error("Blank PDF");

    const cleanText = selectBestExcerpt(result.text);
    if (!cleanText || cleanText.trim().length < 120) {
      throw new Error(
        "The uploaded PDF does not contain enough readable text for AI description generation.",
      );
    }

    return cleanText;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
};

export const generateBookDescription = async (rawText, bookMeta = {}) => {
  const { category = "" } = bookMeta;
  try {
    const hfDescription = await generateBookDescriptionWithHf(rawText, bookMeta);
    if (hfDescription) {
      return hfDescription;
    }
  } catch (error) {
    console.warn("HF description generation failed:", error.message);
  }

  console.error("HF description generation failed. Using local fallback description.");
  return buildFallbackDescription(rawText, bookMeta);
};

export const generateEmbedding = async (textToEmbed) => {
  try {
    const hf = getHfClient();
    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: textToEmbed,
    });

    return Array.isArray(response[0]) ? response[0] : response;
  } catch (error) {
    console.warn("AI embedding failed:", error.message);
    return new Array(384).fill(0);
  }
};
