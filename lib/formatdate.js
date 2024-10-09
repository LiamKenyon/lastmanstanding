// Function to generate formatted dates for the next n days for the API
const generateFormattedDates = (n) => {
  const formattedDates = [];
  for (let i = 0; i < n; i++) {
    const date_ob = new Date();
    date_ob.setDate(date_ob.getDate() + i);
    const weekday = date_ob.toLocaleString("en-us", { weekday: "long" });
    let date = date_ob.getDate().toString();
    let month = (date_ob.getMonth() + 1).toString().padStart(2, "0");
    let year = date_ob.getFullYear();
    let monthName = date_ob.toLocaleString("default", { month: "long" });
    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formatDatePath = `${weekday}-${date}${nth(date)}-${monthName}`;
    const formatDateAPI = `${year}-${month}-${date}`;
    formattedDates.push({ formatDatePath, formatDateAPI });
  }
  return formattedDates;
};

module.exports = { generateFormattedDates };
