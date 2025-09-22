/**
 * PDF text extraction utility
 * Extracts text content from PDF files for AI processing
 */

export interface PDFExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
  metadata?: {
    pages: number;
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

/**
 * Extract text content from a PDF file using a URL
 */
export async function extractPDFText(pdfUrl: string): Promise<PDFExtractionResult> {
  try {
    console.log(`Starting PDF text extraction for: ${pdfUrl}`);

    // Fetch the PDF file first
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    // Get the PDF as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`PDF buffer size: ${buffer.length} bytes`);

    // Use pdf2json for text extraction
    const PDFParser = (await import('pdf2json')).default;

    return new Promise((resolve) => {
      const pdfParser = new (PDFParser as any)(null, 1);

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF parsing error:', errData.parserError);
        resolve({
          success: false,
          error: `PDF parsing failed: ${errData.parserError}`
        });
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          let fullText = '';

          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                for (const textItem of page.Texts) {
                  if (textItem.R && Array.isArray(textItem.R)) {
                    for (const run of textItem.R) {
                      if (run.T) {
                        // Decode URI component to get actual text
                        const decodedText = decodeURIComponent(run.T);
                        fullText += decodedText + ' ';
                      }
                    }
                  }
                }
                fullText += '\n\n'; // Add page break
              }
            }
          }

          console.log(`PDF extraction successful. Pages: ${pdfData.Pages?.length || 0}, Text length: ${fullText.length}`);

          // Clean up the extracted text
          const cleanedText = cleanPDFText(fullText);

          resolve({
            success: true,
            text: cleanedText,
            metadata: {
              pages: pdfData.Pages?.length || 0,
              title: pdfData.Meta?.Title,
              author: pdfData.Meta?.Author,
              creator: pdfData.Meta?.Creator,
              producer: pdfData.Meta?.Producer,
            }
          });
        } catch (processingError) {
          console.error('PDF text processing error:', processingError);
          resolve({
            success: false,
            error: `PDF text processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`
          });
        }
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Clean and normalize extracted PDF text
 */
function cleanPDFText(text: string): string {
  return text
    // Remove excessive whitespace and normalize line breaks
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    // Remove common PDF artifacts
    .replace(/\f/g, '\n') // Form feed characters
    .replace(/\r/g, '') // Carriage returns
    // Trim whitespace
    .trim();
}

/**
 * Check if a file is a PDF based on MIME type
 */
export function isPDFFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

/**
 * Truncate text to a maximum length while preserving word boundaries
 */
export function truncateText(text: string, maxLength: number = 10000): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) { // Only use the space if it's not too far back
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Extract text from multiple PDF files
 */
export async function extractMultiplePDFTexts(pdfUrls: string[]): Promise<PDFExtractionResult[]> {
  const results = await Promise.allSettled(
    pdfUrls.map(url => extractPDFText(url))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        error: `Failed to extract PDF ${index + 1}: ${result.reason}`
      };
    }
  });
}
