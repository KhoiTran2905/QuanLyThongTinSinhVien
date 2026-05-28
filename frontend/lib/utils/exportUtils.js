// frontend/lib/utils/exportUtils.js

/**
 * X?t m?ng JSON thnh file CSV v t?i xu?ng trnh duy?t
 * @param {Array} data - M?ng d? li?u d? x?t (V d?: [{ tn: 'A', tu?i: 20 }, { tn: 'B', tu?i: 22 }])
 * @param {String} filename - Tn file xu?t ra (m?c d?nh: export.csv)
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) {
    alert("Khng c d? li?u d? xu?t!");
    return;
  }

  // L?y tiu d? (keys) t? object d?u tin
  const headers = Object.keys(data[0]);

  // T?o n?i dung CSV
  const csvRows = [];
  
  // Dng header
  csvRows.push(headers.join(','));
  
  // Cc dng d? li?u
  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
      // N?u chu?i c ch?a d?u ph?y, ng?c kp ho?c dng m?i th bao trong ngo?c kp
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  
  // Thm BOM d? Excel nh?n di?n Unicode (UTF-8) \ufeff
  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
