import * as vscode from "vscode";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { generateClient } from "./generator";

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand("apiblueprint.generate", async (uri?: vscode.Uri) => {
    const filePath = uri?.fsPath ?? vscode.window.activeTextEditor?.document.fileName;
    if (!filePath) {
      vscode.window.showErrorMessage("No file selected. Right-click an openapi.yml file.");
      return;
    }

    if (!filePath.match(/\.(ya?ml|json)$/i)) {
      vscode.window.showErrorMessage("Select an OpenAPI .yml, .yaml, or .json file.");
      return;
    }

    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const spec = filePath.endsWith(".json") ? JSON.parse(raw) : yaml.load(raw) as any;

      if (!spec?.openapi) {
        vscode.window.showErrorMessage("File does not look like an OpenAPI spec (missing 'openapi' field).");
        return;
      }

      const outDir = vscode.Uri.joinPath(vscode.Uri.file(filePath), "..", "src", "api");
      fs.mkdirSync(outDir.fsPath, { recursive: true });

      const code = generateClient(spec);
      const outFile = vscode.Uri.joinPath(outDir, "client.ts");
      fs.writeFileSync(outFile.fsPath, code, "utf8");

      const doc = await vscode.workspace.openTextDocument(outFile);
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(`APIBlueprint: Generated ${outFile.fsPath}`);
    } catch (e: any) {
      vscode.window.showErrorMessage(`APIBlueprint error: ${e.message}`);
    }
  });

  context.subscriptions.push(cmd);
}

export function deactivate() {}
