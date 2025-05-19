import { format } from "date-fns";
import { Input } from "./input";

export default function DateInput({
  value,
  onChange,
  placeholder = "DD.MM.YYYY",
  ...props
}: any) {
  const formatDate = (input: string) => {
    // Remove all non-digit characters except dots
    const cleaned = input.replace(/[^\d.]/g, "");

    // Add dots at appropriate positions
    let formatted = cleaned;

    // If we have at least 2 digits, add a dot after the second digit (for day)
    if (cleaned.length >= 2 && !cleaned.includes(".")) {
      formatted = cleaned.substring(0, 2) + "." + cleaned.substring(2);
    }

    // If we have at least 5 characters (DD.MM), add another dot after the month
    if (formatted.length >= 5 && formatted.split(".").length < 3) {
      const parts = formatted.split(".");
      if (parts[1] && parts[1].length >= 2) {
        formatted =
          parts[0] +
          "." +
          parts[1].substring(0, 2) +
          "." +
          parts[1].substring(2);
      }
    }

    // Ensure we don't have more than 2 dots
    const parts = formatted.split(".");
    if (parts.length > 3) {
      formatted = parts[0] + "." + parts[1] + "." + parts.slice(2).join("");
    }

    // Limit each part to appropriate length
    if (parts.length === 3) {
      const day = parts[0].substring(0, 2);
      const month = parts[1].substring(0, 2);
      const year = parts[2].substring(0, 4);
      formatted = day + "." + month + "." + year;
    }

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDate(e.target.value);
    onChange(formattedValue);
  };

  // When the input loses focus, try to convert to a Date object
  const handleBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === "string" && value.trim()) {
      try {
        // Try to parse the date string (DD.MM.YYYY) to a Date object
        const parts = value.split(".");
        if (parts.length === 3) {
          const day = Number.parseInt(parts[0], 10);
          const month = Number.parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS Date
          const year = Number.parseInt(parts[2], 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month, day);
            // Check if the date is valid
            if (
              date.getDate() === day &&
              date.getMonth() === month &&
              date.getFullYear() === year
            ) {
              onChange(date);
              return;
            }
          }
        }
      } catch (error) {
        // If parsing fails, keep the string value
      }
    }
  };

  // Format the date value for display
  const displayValue =
    value instanceof Date ? format(value, "dd.MM.yyyy") : value || "";

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      {...props}
    />
  );
}
