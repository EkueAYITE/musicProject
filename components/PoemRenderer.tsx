'use client';

import React, { useEffect, useMemo } from 'react';

/**
 * PoemRenderer — Renders poem content with inline style markup.
 *
 * Supported syntax (can be nested):
 *   {bold}text{/bold}             — Gras
 *   {italic}text{/italic}         — Italique
 *   {underline}text{/underline}   — Souligné
 *   {font:NomPolice}text{/font}   — Police personnalisée (ex: Georgia, Courier New, etc.)
 *   {size:20px}text{/size}        — Taille personnalisée
 *   {color:#ff0000}text{/color}   — Couleur personnalisée
 *   {uppercase}text{/uppercase}   — Majuscules
 *   {smallcaps}text{/smallcaps}   — Petites capitales
 *   {spacing:4px}text{/spacing}   — Espacement des lettres
 */

// System fonts that don't need Google Fonts loading
const SYSTEM_FONTS = new Set([
    'georgia', 'times new roman', 'courier new', 'palatino', 'garamond',
    'bookman', 'comic sans ms', 'trebuchet ms', 'arial black', 'impact',
    'lucida console', 'lucida sans', 'verdana', 'arial', 'helvetica',
    'tahoma', 'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
]);

// Allowed font families (whitelist for safety)
const ALLOWED_FONTS = [
    'Georgia', 'Times New Roman', 'Courier New', 'Palatino', 'Garamond',
    'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact',
    'Lucida Console', 'Lucida Sans', 'Verdana', 'Arial', 'Helvetica',
    'Tahoma', 'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
    'Dancing Script', 'Playfair Display', 'Lora', 'Merriweather',
    'Libre Baskerville', 'Cormorant Garamond', 'EB Garamond',
    'Crimson Text', 'Source Serif Pro', 'PT Serif',
    'Great Vibes', 'Pacifico', 'Satisfy', 'Caveat', 'Kalam',
    'Indie Flower', 'Sacramento', 'Tangerine', 'Alex Brush',
    'Allura', 'Amatic SC', 'Cinzel', 'Cinzel Decorative',
    'Josefin Sans', 'Montserrat', 'Raleway', 'Oswald', 'Roboto Slab',
    'Permanent Marker', 'Press Start 2P', 'Special Elite',
];

interface StyledSegment {
    text: string;
    style: React.CSSProperties;
}

type ParsedNode = StyledSegment | ParsedNode[];

/**
 * Parses a styled text string and returns React elements.
 */
function parseStyledText(input: string): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let keyIndex = 0;

    while (i < input.length) {
        // Look for an opening tag
        const tagStart = input.indexOf('{', i);

        if (tagStart === -1) {
            // No more tags, push remaining text
            const remaining = input.slice(i);
            if (remaining) nodes.push(remaining);
            break;
        }

        // Push text before the tag
        if (tagStart > i) {
            nodes.push(input.slice(i, tagStart));
        }

        // Find the end of the tag
        const tagEnd = input.indexOf('}', tagStart);
        if (tagEnd === -1) {
            // Malformed tag, push rest as text
            nodes.push(input.slice(tagStart));
            break;
        }

        const tagContent = input.slice(tagStart + 1, tagEnd);

        // Skip closing tags at this level (they'll be handled by their opener)
        if (tagContent.startsWith('/')) {
            nodes.push(input.slice(tagStart, tagEnd + 1));
            i = tagEnd + 1;
            continue;
        }

        // Determine the tag type and any parameter
        let tagName = tagContent;
        let tagParam = '';

        if (tagContent.includes(':')) {
            const colonIdx = tagContent.indexOf(':');
            tagName = tagContent.slice(0, colonIdx);
            tagParam = tagContent.slice(colonIdx + 1);
        }

        // Find the matching closing tag
        const closingTag = `{/${tagName}}`;
        const closingIdx = findMatchingClose(input, tagEnd + 1, tagName);

        if (closingIdx === -1) {
            // No closing tag found, treat as plain text
            nodes.push(input.slice(tagStart, tagEnd + 1));
            i = tagEnd + 1;
            continue;
        }

        // Extract inner content
        const innerContent = input.slice(tagEnd + 1, closingIdx);
        const style = getStyleForTag(tagName, tagParam);

        if (style) {
            const innerNodes = parseStyledText(innerContent);
            nodes.push(
                <span key={`styled-${keyIndex++}`} style={style}>
                    {innerNodes}
                </span>
            );
        } else {
            // Unknown tag, render as-is
            nodes.push(input.slice(tagStart, closingIdx + closingTag.length));
        }

        i = closingIdx + closingTag.length;
    }

    return nodes;
}

/**
 * Finds the index of the matching closing tag, handling nesting.
 */
function findMatchingClose(input: string, startFrom: number, tagName: string): number {
    const openTag = `{${tagName}}`;
    const openTagParam = `{${tagName}:`;
    const closeTag = `{/${tagName}}`;
    let depth = 1;
    let pos = startFrom;

    while (pos < input.length && depth > 0) {
        const nextOpen = input.indexOf(`{${tagName}`, pos);
        const nextClose = input.indexOf(closeTag, pos);

        if (nextClose === -1) {
            return -1; // No matching close
        }

        if (nextOpen !== -1 && nextOpen < nextClose) {
            // Check if it's actually an opening tag (not a partial match)
            const afterOpen = input[nextOpen + tagName.length + 1];
            if (afterOpen === '}' || afterOpen === ':') {
                depth++;
            }
            pos = nextOpen + 1;
        } else {
            depth--;
            if (depth === 0) {
                return nextClose;
            }
            pos = nextClose + closeTag.length;
        }
    }

    return -1;
}

/**
 * Returns CSS style for a given tag.
 */
function getStyleForTag(tagName: string, param: string): React.CSSProperties | null {
    switch (tagName.toLowerCase()) {
        case 'bold':
        case 'b':
        case 'gras':
            return { fontWeight: 'bold' };

        case 'italic':
        case 'i':
        case 'italique':
            return { fontStyle: 'italic' };

        case 'underline':
        case 'u':
        case 'souligne':
            return { textDecoration: 'underline' };

        case 'font':
        case 'police': {
            // Validate the font name
            const sanitizedFont = param.trim();
            if (ALLOWED_FONTS.some(f => f.toLowerCase() === sanitizedFont.toLowerCase())) {
                return { fontFamily: `'${sanitizedFont}', serif` };
            }
            // If not in whitelist, still allow but add a generic fallback
            return { fontFamily: `'${sanitizedFont.replace(/['"]/g, '')}', serif` };
        }

        case 'size':
        case 'taille': {
            // Validate size (allow px, em, rem, %)
            const sizeMatch = param.match(/^(\d+(?:\.\d+)?)(px|em|rem|%)$/);
            if (sizeMatch) {
                return { fontSize: param };
            }
            // If just a number, assume px
            const numMatch = param.match(/^\d+(?:\.\d+)?$/);
            if (numMatch) {
                return { fontSize: `${param}px` };
            }
            return null;
        }

        case 'color':
        case 'couleur': {
            // Validate color (hex, rgb, named colors)
            const colorMatch = param.match(/^(#[0-9a-fA-F]{3,8}|[a-zA-Z]+|rgb\(.+\)|hsl\(.+\))$/);
            if (colorMatch) {
                return { color: param };
            }
            return null;
        }

        case 'uppercase':
        case 'majuscule':
            return { textTransform: 'uppercase' };

        case 'smallcaps':
        case 'petitescapitales':
            return { fontVariant: 'small-caps' };

        case 'spacing':
        case 'espacement': {
            const spacingMatch = param.match(/^(\d+(?:\.\d+)?)(px|em|rem)$/);
            if (spacingMatch) {
                return { letterSpacing: param };
            }
            const numSpacing = param.match(/^\d+(?:\.\d+)?$/);
            if (numSpacing) {
                return { letterSpacing: `${param}px` };
            }
            return null;
        }

        case 'center':
        case 'centre':
            return { display: 'block', textAlign: 'center' };

        case 'right':
        case 'droite':
            return { display: 'block', textAlign: 'right' };

        default:
            return null;
    }
}

/**
 * Extracts all font names used in {font:...} tags from the content.
 */
function extractFontNames(content: string): string[] {
    const fontRegex = /\{(?:font|police):([^}]+)\}/gi;
    const fonts = new Set<string>();
    let match;
    while ((match = fontRegex.exec(content)) !== null) {
        const fontName = match[1].trim();
        if (!SYSTEM_FONTS.has(fontName.toLowerCase())) {
            fonts.add(fontName);
        }
    }
    return Array.from(fonts);
}

interface PoemRendererProps {
    content: string;
    className?: string;
}

export default function PoemRenderer({ content, className = '' }: PoemRendererProps) {
    // Auto-load Google Fonts detected in the content
    const googleFonts = useMemo(() => extractFontNames(content), [content]);

    useEffect(() => {
        if (googleFonts.length === 0) return;

        // Build the Google Fonts URL
        const families = googleFonts
            .map(f => f.replace(/ /g, '+'))
            .join('&family=');
        const url = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;

        // Check if already loaded
        const existingLink = document.querySelector(`link[href="${url}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);

        return () => {
            // Cleanup: only remove if no other poem on the page needs it
            // We keep the link for performance (caching)
        };
    }, [googleFonts]);

    // Split content by lines and process each line
    const lines = content.split('\n');

    return (
        <div className={className}>
            {lines.map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                    {line.trim() === '' ? (
                        <br />
                    ) : (
                        <p className="poem-line" style={{ margin: '0.15em 0' }}>
                            {parseStyledText(line)}
                        </p>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
