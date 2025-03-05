export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export const formatLabel = (str: string) => {
  return str
    .replace(/^gx:/, "") // Remove "gx:" prefix
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .replace(/\d+/g, " $&") // Add space before numbers
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};
