export function capitalizeFirstCharacter(sentence) {
  // Check if the sentence is not empty
  if (sentence.length > 0) {
    // Capitalize the first character and concatenate with the rest of the sentence
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  } else {
    // Return empty string if the sentence is empty
    return "";
  }
}
