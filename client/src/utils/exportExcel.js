import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Department_Records') => {
  if (!data || !data.length) return;

  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => (row[key] !== null && row[key] !== undefined ? String(row[key]).length : 0))
    ) + 3
  }));
  worksheet['!cols'] = colWidths;

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Download Excel .xlsx file
  const validFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, validFilename);
};
