import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = path.resolve("../..");
const inputWorkbookPath = path.join(root, "Data", "Measurement_dataset.xlsx");
const inputCsvPath = path.join(root, "Data", "merged_df_v3.csv");
const outputDir = path.join(root, "outputs", "measurement_dataset_replace");
const outputWorkbookPath = path.join(outputDir, "Measurement_dataset.xlsx");

const input = await FileBlob.load(inputWorkbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const csvText = await fs.readFile(inputCsvPath, "utf8");
const csvWorkbook = await Workbook.fromCSV(csvText, { sheetName: "merged_df_v3" });
const csvSheet = csvWorkbook.worksheets.getItem("merged_df_v3");
const csvRange = csvSheet.getUsedRange(true);
const csvValues = csvRange.values;

console.log("Workbook sheets:");
console.log((await workbook.inspect({ kind: "sheet", include: "id,name" })).ndjson);
console.log(`Incoming merged_df_v3 shape: ${csvValues.length} rows x ${csvValues[0]?.length ?? 0} columns`);

const targetSheetName = workbook.worksheets.items
  .map((sheet) => sheet.name)
  .find((name) => name.toLowerCase() === "measurement_dataset");

if (!targetSheetName) {
  throw new Error("Could not find a worksheet named measurement_dataset.");
}

const targetSheet = workbook.worksheets.getItem(targetSheetName);
const oldRange = targetSheet.getUsedRange(true);
console.log(`Replacing worksheet: ${targetSheetName}`);
console.log(`Existing used range values: ${oldRange?.address ?? "none"}`);

if (oldRange) {
  oldRange.clear({ applyTo: "contents" });
}

targetSheet.getRangeByIndexes(0, 0, csvValues.length, csvValues[0].length).values = csvValues;

const headerRange = targetSheet.getRangeByIndexes(0, 0, 1, csvValues[0].length);
headerRange.format = {
  font: { bold: true, color: "#FFFFFF" },
  fill: "#1F4E79",
};
targetSheet.freezePanes.freezeRows(1);

const finalCheck = await workbook.inspect({
  kind: "table",
  sheetId: targetSheetName,
  range: "A1:J8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 10,
  tableMaxCellChars: 60,
  maxChars: 4000,
});
console.log("Final top-left check:");
console.log(finalCheck.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
  maxChars: 2000,
});
console.log("Formula error scan:");
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({
  sheetName: targetSheetName,
  range: "A1:J20",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "measurement_dataset_preview.png"), new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputWorkbookPath);
console.log(`Saved ${outputWorkbookPath}`);
