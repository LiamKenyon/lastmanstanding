export class DateHandler {
  /**
   *
   * @returns {string[]} - An array of dates from today until the next Sunday
   */
  static generateDatesUntilSunday(): string[] {
    const formattedDates: string[] = [];
    const dateObj = new Date();
    const currentDay = dateObj.getDay();
    const daysUntilSunday = 8 - currentDay;

    for (let i = 0; i < daysUntilSunday; i++) {
      const newDate = new Date(dateObj);
      newDate.setDate(dateObj.getDate() + i);
      formattedDates.push(newDate.toISOString());
    }

    return formattedDates;
  }

  /**
   *
   * @returns {string[]} - An array of dates from today until the previous Sunday
   */
  static generateDatesUntilPreviousSunday(): string[] {
    const formattedDates: string[] = [];
    const dateObj = new Date();
    const currentDay = dateObj.getDay();
    const daysSinceSunday = currentDay === 0 ? 8 : currentDay + 2;

    for (let i = 0; i < daysSinceSunday; i++) {
      const newDate = new Date(dateObj);
      newDate.setDate(dateObj.getDate() - i);
      formattedDates.push(newDate.toISOString());
    }

    return formattedDates;
  }
}
