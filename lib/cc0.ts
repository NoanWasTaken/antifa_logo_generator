export const CC0_URL = "https://creativecommons.org/publicdomain/zero/1.0/";

const CC0_METADATA = `  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cc="http://creativecommons.org/ns#">
      <cc:Work>
        <cc:license rdf:resource="${CC0_URL}"/>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <desc>This logo is dedicated to the public domain under CC0 1.0. You can copy, modify, distribute and sell it without attribution or permission. Third-party rights may still apply.</desc>`;

export function addCc0Metadata(svg: string): string {
  if (svg.includes(CC0_URL)) return svg;
  return svg.replace(/(<svg\b[^>]*>)/, `$1\n${CC0_METADATA}`);
}
