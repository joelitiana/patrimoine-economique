function formatDate(date) {
    if (!date) {
      return "non défini";
    }
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }
  
  function formatNumber(number) {
    let absNumber = Math.abs(number);
    if (!Number.isInteger(absNumber)) {
      absNumber = absNumber.toFixed(3);
    }
    let [int, float] = absNumber.toString().split(".");
    int = int
      .split("")
      .reverse()
      .map((e, i, arr) =>
        i % 3 == 0 && i !== arr.length - 1 && i !== 0 ? e + "," : e
      )
      .reverse()
      .map((e, i, arr) =>
        i == 0 && (arr.length - 1) % 3 == 0 && arr.length !== 1 ? e + "," : e
      )
      .join("");
  
    if (number < 0) {
      return float ? "-" + int + "." + float : "-" + int;
    } else {
      return float ? int + "." + float : int;
    }
  }
  
  export { formatDate, formatNumber };