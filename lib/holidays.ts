// Key format: "MM-DD"
export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-14": "Makar Sankranti",
  "01-26": "Republic Day",
  "02-14": "Valentine's Day",
  "03-08": "International Women's Day",
  "03-17": "Holi",
  "03-25": "Good Friday",
  "04-05": "Easter Sunday",
  "04-14": "Dr. Ambedkar Jayanti",
  "04-21": "Ram Navami",
  "05-01": "Labour Day",
  "05-08": "Rabindranath Tagore Jayanti",
  "05-12": "Buddha Purnima",
  "06-21": "International Yoga Day",
  "07-04": "Independence Day (US)",
  "08-15": "Independence Day (India)",
  "08-19": "Janmashtami",
  "08-26": "Ganesh Chaturthi",
  "09-05": "Teachers' Day",
  "10-02": "Gandhi Jayanti",
  "10-13": "Dussehra",
  "10-20": "Diwali",
  "10-31": "Halloween",
  "11-01": "All Saints' Day",
  "11-14": "Children's Day",
  "11-28": "Thanksgiving",
  "12-24": "Christmas Eve",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export function getHoliday(date: Date): string | null {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return HOLIDAYS[`${month}-${day}`] || null;
}
