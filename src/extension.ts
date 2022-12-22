// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class ReactionViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = "reactionView"

	private view?: vscode.WebviewView

	constructor (
		private readonly _extensionUri: vscode.Uri
	) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private _getHtmlForWebview(
		webview: vscode.Webview
	) {
		const nonce = getNonce()


		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Error Reaction</title>
			</head>
			<body>
				<img src=""/>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new ReactionViewProvider(context.extensionUri)

	console.log('Congratulations, your extension "incredibly-error-prone" is now active!');

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ReactionViewProvider.viewType, provider)
	)

	vscode.languages.onDidChangeDiagnostics(evt => {
		evt.uris.forEach(uri => {
			let diagnostics = vscode.languages.getDiagnostics(uri)
		})
	})
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}